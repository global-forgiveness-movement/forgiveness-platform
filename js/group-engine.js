/* THE GROUP ENGINE — the one place that decides what a Forgiveness Group
   series looks like to whoever is looking at it.

   Wyatt, 28 Sep: "one base 'game engine' or data structure, and one 'display
   engine' that takes in the user's role ... the problem we want to pre-solve
   for is DRIFT — where changing something for the facilitator requires
   manually changing it for the members too."

   So: PURE. No DOM, no fetch, no storage. Data in, a description of the
   series out. js/series.js draws whatever this returns and decides nothing;
   scripts/qa/group-engine-onehelm.mjs goes red if a role is compared, or a
   facilitator flag read, anywhere but this file.

   The facts it owns, in the site's own words:
   - WHO IS LOOKING: a visitor, someone in no group, a member, a facilitator.
   - A MEETING IS DONE when the facilitator ticked it, OR its date and time
     have passed (ruling 4), OR a later meeting is done (you cannot have met
     for meeting 3 without meeting 2 having happened).
   - A STEP IS OPEN once everything the group does before it is done. Nothing
     about when a person joined enters into it, so someone who joins late
     sees everything already done as open (ruling 6).
   - A VIDEO CAN BE PLAYED by the facilitator from the moment its meeting is
     open (they play it in the room), and by everyone in the group once that
     meeting is done (Richard, 24 Sep: "once they finished it, they just have
     full access").
   - A MEMBER'S LESSON TICKS ARE THEIRS. Only they tick them, only they see
     them — unless FACILITATOR_SEES_MEMBER_TICKS is switched on (ruling 5,
     OFF until Kate and Richard answer). */

/* Ruling 5, 28 Sep: build it, keep it off. Flipping this alone is NOT enough
   on the live site: firestore.rules keeps the matching read commented out,
   so the privacy line on My Path ("it does not tell your facilitator ...
   anything about your workbook") stays literally true until both change. */
export const FACILITATOR_SEES_MEMBER_TICKS = false;

export const ROLES = ['visitor', 'none', 'member', 'facilitator'];

/* A meeting counts as over this long after it starts. The Groups page says
   sessions run one to one and a half hours. */
export const MEETING_LENGTH_MS = 90 * 60 * 1000;

/* Who is looking. The public Groups page always shows the visitor's view,
   signed in or not; My Path shows the viewer's own. */
export function roleFor({ surface, user, membership }) {
  if (surface === 'public' || !user) return 'visitor';
  if (!membership?.seriesId) return 'none';
  return membership.facilitator ? 'facilitator' : 'member';
}

/* The ordered steps of a series, before anyone's state is applied. The ids
   are the keys group state and ticks are stored under, so they must never
   depend on titles (an editor can rename a step without losing its ticks). */
export function stepsOf(series) {
  const steps = [];
  if (series.prep) {
    steps.push({ id: 'prep', kind: 'own', gate: true, n: 0, tag: 'On your own · first',
      src: series.prep, path: 'prep' });
  }
  (series.sessions || []).forEach((s, i) => {
    if (s.before) {
      steps.push({ id: `own-${s.n}`, kind: 'own', gate: false, n: s.n,
        tag: `On your own · before meeting ${s.n}`, src: s.before, path: `sessions.${i}.before` });
    }
    steps.push({ id: `meet-${s.n}`, kind: 'together', gate: true, n: s.n,
      tag: `Together · meeting ${s.n}`, src: s, path: `sessions.${i}` });
  });
  return steps;
}

const WHEN_FORMAT = { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' };
export function whenText(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleString('en-US', WHEN_FORMAT);
}

/* Only a real web address becomes a link a member can click. */
export function safeLink(raw) {
  const s = String(raw || '').trim();
  if (!s) return '';
  const url = /^https?:\/\//i.test(s) ? s : `https://${s}`;
  try {
    const u = new URL(url);
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.href : '';
  } catch { return ''; }
}

const past = (iso, now) => {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  return !Number.isNaN(t) && t + MEETING_LENGTH_MS <= now.getTime();
};

/* Per role, everything that differs: what it may do, what it is told. This
   table IS the anti-drift property — a new rule for one role is one line
   here, and every other role's rows sit beside it. */
const CAN = {
  visitor:     { inGroup: false, tickGroup: false, tickMine: false, setMeeting: false, playOpen: false, playDone: false, guide: false, seesTicks: false },
  none:        { inGroup: false, tickGroup: false, tickMine: false, setMeeting: false, playOpen: false, playDone: false, guide: false, seesTicks: false },
  member:      { inGroup: true,  tickGroup: false, tickMine: true,  setMeeting: false, playOpen: false, playDone: true,  guide: false, seesTicks: false },
  facilitator: { inGroup: true,  tickGroup: true,  tickMine: true,  setMeeting: true,  playOpen: true,  playDone: true,  guide: true,  seesTicks: FACILITATOR_SEES_MEMBER_TICKS },
};

const GROUP_TICK_LABEL = {
  prep: 'Everyone has their workbook',
  meet: 'We met and played the videos',
};

const PANEL = {
  member: {
    kicker: 'You’re following a group',
    blurb: 'Your group meets and talks; you do the lessons on your own, in your own time. Tick each set of lessons when you’ve done them — that tick is yours alone. Each meeting’s videos open here to re-watch once your group has met.',
    leave: 'Leave this group',
    leaveWarn: 'Stop following this group? Your workbook progress is not affected.',
  },
  facilitator: {
    kicker: 'The group you facilitate',
    blurb: 'Share the code with everyone in your group — it is saved here, so you never have to remember it. Add each meeting’s date and place below. When you tick a meeting, the next step opens for everyone, and that meeting’s videos open for them to re-watch.',
    leave: 'Remove this group from My Path',
    leaveWarn: 'Remove this group from My Path? We keep your registration, but the code stops showing here — write it down first.',
  },
};

/* deriveSeries — the whole series as this viewer should see it.

   series   one series from the `series` collection (SERIES defaults, editor
            overrides on top)
   group    the group's shared state { steps: { [stepId]: { done, when,
            place, link } } } — written only by its facilitator; or null
   me       this viewer's own ticks { [stepId]: true }; or null
   ticks    everyone's ticks [{ ticks }] — read only when the switch is on
   role     one of ROLES (from roleFor)
   now      a Date; passed in so the engine stays pure and testable
   video    the placeholder source for every session slot (ruling 8) */
export function deriveSeries({ series, group = null, me = null, ticks = [], role, now = new Date(), video = '' }) {
  if (!ROLES.includes(role)) throw new Error(`unknown role: ${role}`);
  const can = CAN[role];
  const shared = (can.inGroup && group?.steps) || {};
  const mine = (can.inGroup && me) || {};
  const base = stepsOf(series);

  /* Done, for the steps the group does together. A later done step makes
     every earlier one done, so walk backwards. */
  const doneGate = {};
  let later = false;
  for (let i = base.length - 1; i >= 0; i--) {
    const s = base[i];
    if (!s.gate) continue;
    const st = shared[s.id] || {};
    const self = !!st.done || (s.kind === 'together' && past(st.when, now));
    doneGate[s.id] = { done: self || later, ticked: !!st.done, byDate: !st.done && past(st.when, now), byLater: !self && later };
    later = later || self;
  }

  let blocked = false;
  const steps = base.map((s) => {
    const st = shared[s.id] || {};
    const open = !blocked;
    let state;
    if (!can.inGroup) state = 'preview';
    else if (s.gate) state = doneGate[s.id].done ? 'done' : open ? 'open' : 'upcoming';
    else state = mine[s.id] ? 'done' : open ? 'open' : 'upcoming';
    if (s.gate && !doneGate[s.id].done) blocked = true;

    const actions = [];
    if (s.gate && can.tickGroup) {
      const g = doneGate[s.id];
      actions.push({
        type: 'check', scope: 'group',
        label: s.kind === 'together' ? GROUP_TICK_LABEL.meet : GROUP_TICK_LABEL.prep,
        checked: g.done,
        locked: g.byDate || g.byLater,
        note: g.byDate ? 'Done — the meeting time has passed.' : g.byLater ? 'Done — a later meeting is marked done.' : '',
      });
    }
    if (!s.gate && can.tickMine) {
      actions.push({ type: 'check', scope: 'mine', label: 'I’ve done these lessons', checked: !!mine[s.id], locked: false,
        note: 'Only you see this tick.' });
    }
    if (s.kind === 'together' && can.setMeeting) {
      actions.push({ type: 'meeting', when: st.when || '', place: st.place || '', link: st.link || '' });
    }

    let tally = null;
    if (!s.gate && can.seesTicks) {
      tally = { done: ticks.filter((t) => t?.ticks?.[s.id]).length, of: ticks.length };
    }

    const meeting = s.kind === 'together' && can.inGroup && (st.when || st.place || st.link)
      ? { when: st.when || '', whenText: whenText(st.when), place: st.place || '', link: safeLink(st.link) }
      : null;

    let videoOut = null;
    if (s.kind === 'together' && can.inGroup) {
      const playable = state === 'done' ? can.playDone : state === 'open' ? can.playOpen : false;
      videoOut = {
        src: s.src.video || video,
        title: `Meeting ${s.n} · ${s.src.title}`,
        playable,
        note: playable
          ? 'Placeholder: the clients’ current films. The session films land in mid-October.'
          : can.playOpen
            ? 'Opens when the meeting before it is done.'
            : 'Your facilitator plays this at the meeting. It opens here to re-watch once your group has met.',
      };
    }

    const materials = [];
    if (s.id === 'prep') materials.push({ kind: 'link', label: 'Get the free PDF', href: 'workbooks/' });
    if (s.kind === 'together' && can.guide) materials.push({ kind: 'soon', label: 'Facilitator guide for this meeting — arrives soon' });

    return {
      id: s.id, kind: s.kind, n: s.n, tag: s.tag,
      title: s.src.title, detail: s.src.detail,
      fields: { title: `${s.path}.title`, detail: `${s.path}.detail` },
      state, actions, meeting, video: videoOut, materials, tally,
    };
  });

  /* The next meeting: the first one not done. Its details sit at the top. */
  const nextStep = can.inGroup ? steps.find((s) => s.kind === 'together' && s.state !== 'done') : null;
  const next = nextStep
    ? { stepId: nextStep.id, n: nextStep.n, title: nextStep.title, ...(nextStep.meeting || { when: '', whenText: '', place: '', link: '' }),
        note: nextStep.meeting?.whenText ? '' : can.setMeeting ? 'Add its date and place below.' : 'Your facilitator hasn’t added a date yet.' }
    : null;
  const current = can.inGroup ? (steps.find((s) => s.state === 'open') || null) : null;

  return {
    role,
    series: { id: series.id, name: series.name, framing: series.framing, workbook: series.workbook },
    steps,
    next,
    currentId: current?.id || null,
    finished: can.inGroup && steps.every((s) => s.kind !== 'together' || s.state === 'done'),
    panel: PANEL[role] || null,
    showSeries: role !== 'none',
  };
}

/* The one place that says which way round a tick goes. Group state is a
   whole document written back in full (so a cleared date really clears). */
export function applyGroupAction(group, stepId, action) {
  const steps = { ...(group?.steps || {}) };
  const cur = { ...(steps[stepId] || {}) };
  if (action.type === 'check') cur.done = !!action.value;
  if (action.type === 'meeting') {
    cur.when = action.when || '';
    cur.place = String(action.place || '').trim().slice(0, 140);
    cur.link = safeLink(action.link);
  }
  steps[stepId] = cur;
  return { ...(group || {}), steps };
}

export function applyMyTick(me, stepId, value) {
  const next = { ...(me || {}) };
  if (value) next[stepId] = true; else delete next[stepId];
  return next;
}

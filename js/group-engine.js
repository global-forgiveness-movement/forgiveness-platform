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

/* A meeting counts as over this long after it starts. Meetings are one hour
   (Kate, 6 Oct — it was one to one and a half). */
export const MEETING_LENGTH_MS = 60 * 60 * 1000;

/* WHO FACILITATES A GROUP — ONE fact, ONE place (lane D, 28 Sep): the
   account named on groupCodes/{code}.facilitator. firestore.rules checks the
   same field before it lets anyone write the group's dates and ticks, so the
   page can never offer a tick the database will refuse. Nothing a person's
   own membership says enters into it — groups made before September 28
   named nobody there until /admin gave them back their facilitator.
   scripts/qa/group-engine-onehelm.mjs goes red if anything else reads it. */
export const facilitatorOf = (codeDoc) => (codeDoc && typeof codeDoc.facilitator === 'string' && codeDoc.facilitator) || null;

/* Whether a group code names this account as the one who runs it. */
export const createdBy = (codeDoc, userId) => !!userId && facilitatorOf(codeDoc) === userId;

/* Who is looking. The public Groups page always shows the visitor's view,
   signed in or not; My Path shows the viewer's own, one group at a time:
   `membership` is this person's entry for the group, `codeDoc` that group's
   groupCodes record. */
export function roleFor({ surface, user, membership, codeDoc }) {
  if (surface === 'public' || !user) return 'visitor';
  if (!membership?.seriesId) return 'none';
  return createdBy(codeDoc, user.id) ? 'facilitator' : 'member';
}

/* Whether this account runs the group on this code record. */
export const runsGroup = (codeDoc, userId) =>
  CAN[roleFor({ surface: 'mypath', user: { id: userId }, membership: { seriesId: 'any' }, codeDoc })].tickGroup;

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

/* What My Path puts in "Your group" for each role: the cards, in order,
   and whether the series itself is shown (ruling 9: only your series). */
const PATH = {
  visitor: { cards: [], showSeries: true },
  none: { cards: ['create', 'join'], showSeries: false },
  member: { cards: ['group'], showSeries: true },
  facilitator: { cards: ['group'], showSeries: true },
};
export function pathView(role) {
  if (!ROLES.includes(role)) throw new Error(`unknown role: ${role}`);
  return { role, ...PATH[role], panel: PANEL[role] ? { ...PANEL[role], ...FINISH } : null };
}

/* Ruling 2, 28 Sep: no scary warning. Finishing a group moves it to Past
   groups, code still showing, one tap from coming back — nothing is lost, so
   nothing asks "are you sure". The same words for whoever runs or follows it. */
const FINISH = {
  finish: 'Finished with this group',
  bringBack: 'Bring back',
};

const ACCOUNTS_TICK = 'prep-accounts';

const GROUP_TICK_LABEL = {
  prep: 'Everyone has their workbook',
  meet: 'We met and played the videos',
};

/* Wyatt, 28 Sep: "someone can very easily, at a glance, understand what they
   need to do next." So no blurbs: the code, the next meeting, the steps. What
   differs per role is one line under the code, and a tag in the switcher. */
const PANEL = {
  member: {
    tag: 'You’re a member',
    codeLine: 'Your group’s code',
  },
  facilitator: {
    tag: 'You lead',
    codeLine: 'Give this code to everyone in your group.',
    copy: 'Copy code',
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
    /* Richard, 29 Sep call: a reminder that everyone has made a free account
       (so they can join with the code). A tick of its own on the first step,
       kept under its own key in the group state; it opens nothing. */
    if (s.id === 'prep' && can.tickGroup) {
      actions.push({ type: 'check', scope: 'group', target: ACCOUNTS_TICK, label: 'Everyone has made a free account',
        checked: !!shared[ACCOUNTS_TICK]?.done, locked: false, note: 'So they can join with your code.' });
    }
    if (!s.gate && can.tickMine) {
      actions.push({ type: 'check', scope: 'mine', label: 'I’ve done these lessons', checked: !!mine[s.id], locked: false,
        note: 'Only you see this tick.' });
    }
    if (s.kind === 'together' && can.setMeeting) {
      /* `others`: the meetings a place or link typed here also fills, when
         they have none of their own (29 Sep call: "type in the place and the
         video call link in the first box then that auto populates"). */
      const others = base.filter((b) => b.kind === 'together' && b.id !== s.id).map((b) => b.id);
      actions.push({ type: 'meeting', when: st.when || '', place: st.place || '', link: st.link || '', others });
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
            ? 'Opens once the step before it is done.'
            : 'Your facilitator plays this at the meeting. It opens here to re-watch once your group has met.',
      };
    }

    const materials = [];
    /* Kate, 6 Oct: "Get the Workbook Editions". The facilitator's manual and
       film are for the whole series, so they sit under Your materials (kit,
       below), not in each meeting. */
    if (s.id === 'prep') materials.push({ kind: 'link', label: 'Get the Workbook Editions', href: 'workbooks/' });

    return {
      id: s.id, kind: s.kind, n: s.n, tag: s.tag,
      title: s.src.title, detail: s.src.detail,
      fields: { title: `${s.path}.title`, detail: `${s.path}.detail` },
      state, actions, meeting, video: videoOut, materials, tally,
    };
  });

  /* The next meeting: the first one not done. Its details sit at the top —
     and for whoever may set them, so does the very same form the step carries
     (`action`), so the date is set where the eye already is. */
  const nextStep = can.inGroup ? steps.find((s) => s.kind === 'together' && s.state !== 'done') : null;
  const next = nextStep
    ? { stepId: nextStep.id, n: nextStep.n, title: nextStep.title, ...(nextStep.meeting || { when: '', whenText: '', place: '', link: '' }),
        action: nextStep.actions.find((a) => a.type === 'meeting') || null,
        note: nextStep.meeting?.whenText || can.setMeeting ? '' : 'Your facilitator hasn’t set a date yet.' }
    : null;
  const current = can.inGroup ? (steps.find((s) => s.state === 'open') || null) : null;

  /* 29 Sep call: every meeting's date is set before the group starts. Until
     any is, whoever sets them is shown the whole plan at once — each
     meeting's date and time, and one place or link for them all. */
  const meetings = steps.filter((s) => s.kind === 'together');
  const plan = can.setMeeting && !meetings.some((m) => shared[m.id]?.when)
    ? { meetings: meetings.map((m) => ({ stepId: m.id, n: m.n, title: m.title })),
        place: meetings.map((m) => shared[m.id]?.place).find(Boolean) || '',
        link: meetings.map((m) => shared[m.id]?.link).find(Boolean) || '' }
    : null;

  return {
    role,
    series: { id: series.id, name: series.name, framing: series.framing, workbook: series.workbook },
    steps,
    next,
    plan,
    currentId: current?.id || null,
    /* Which facilitator materials this viewer gets: the manual for this
       edition and the one film — or none. */
    kit: can.guide ? [`manual-${series.id}`, 'film'] : [],
    finished: can.inGroup && steps.every((s) => s.kind !== 'together' || s.state === 'done'),
    ...pathView(role),
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
  if (stepId) steps[stepId] = cur;
  /* A place or link fills every other meeting that has neither yet. */
  const place = String(action.place || '').trim().slice(0, 140);
  const link = safeLink(action.link);
  const fill = (id) => {
    const o = { ...(steps[id] || {}) };
    if (!o.place && !o.link) { o.place = place; o.link = link; }
    steps[id] = o;
  };
  if (action.type === 'meeting' && (place || link)) (action.others || []).forEach(fill);
  /* The whole plan at once: each meeting's date, one place or link for all. */
  if (action.type === 'schedule') {
    for (const { stepId: id, when } of action.entries || []) {
      steps[id] = { ...(steps[id] || {}), when: when || '', place, link };
    }
  }
  return { ...(group || {}), steps };
}

export function applyMyTick(me, stepId, value) {
  const next = { ...(me || {}) };
  if (value) next[stepId] = true; else delete next[stepId];
  return next;
}

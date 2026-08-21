/* app.js — hash router + step engine. Static, offline-friendly, zero network calls with user data. */

import { store } from './storage.js';
import { LESSONS, REACH, LETTER, RESOURCES, CREDITS } from './content.js';

const app = document.getElementById('app');

/* ---------------------------------------------------------------- SVG bits */
const LEAF = (cls = '') => `<svg class="leaf ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C7 7 4 12 4 16a8 8 0 0 0 16 0c0-4-3-9-8-14z" transform="rotate(40 12 12)"/></svg>`;
const CHECKLEAF = `<svg viewBox="0 0 28 28" aria-hidden="true" class="checkleaf"><path class="cl-leaf" d="M14 2C8 8 4.5 13.5 4.5 18.5a9.5 9.5 0 0 0 19 0C23.5 13.5 20 8 14 2z"/><path class="cl-check" d="M9.5 15.5l3.2 3.2 6-6.5" fill="none"/></svg>`;
const ICONS = {
  heart: `<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="14" fill="none" stroke-width="1.6"/><path d="M16 22c-4-3-7-5.6-7-8.6C9 11 10.8 9.5 13 9.5c1.3 0 2.4.6 3 1.6.6-1 1.7-1.6 3-1.6 2.2 0 4 1.5 4 3.9 0 3-3 5.6-7 8.6z" fill="none" stroke-width="1.6"/><path d="M9 16h3l1.4-2.4 2 4 1.6-2.6H20" fill="none" stroke-width="1.4"/></svg>`,
  bulb: `<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="14" fill="none" stroke-width="1.6"/><path d="M16 8a6 6 0 0 1 3.5 10.9c-.8.6-1 1.4-1 2.1h-5c0-.7-.2-1.5-1-2.1A6 6 0 0 1 16 8z" fill="none" stroke-width="1.6"/><path d="M14 23.5h4M14.7 25.8h2.6" fill="none" stroke-width="1.4"/></svg>`,
  hands: `<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="14" fill="none" stroke-width="1.6"/><path d="M8 15l4-3 4.5 3.6c.6.5.6 1.3.1 1.8l-1.2 1.1M24 15l-4-3-2 1.6M12.5 19.5l2 1.7c.7.6 1.7.6 2.3 0l4-3.7" fill="none" stroke-width="1.5"/></svg>`,
  pray: `<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="14" fill="none" stroke-width="1.6"/><path d="M16 8c-1.2 3-4.5 6-4.5 10 0 2.5 2 4.5 4.5 4.5s4.5-2 4.5-4.5c0-4-3.3-7-4.5-10z" fill="none" stroke-width="1.6"/><path d="M16 12v10" stroke-width="1.2" fill="none"/></svg>`,
  pencil: `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M12 32L28 8l5 3.5L18 36l-7 2z" fill="none" stroke-width="1.8"/><path d="M26 11l5 3.5M13 31l5 3.5" fill="none" stroke-width="1.4"/></svg>`,
  mirror: `<svg viewBox="0 0 40 40" aria-hidden="true"><ellipse cx="20" cy="16" rx="10" ry="12" fill="none" stroke-width="1.8"/><path d="M20 28v8M16 36h8M14 12l6 8M18 9l6 9" fill="none" stroke-width="1.4"/></svg>`,
  dumbbell: `<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="4" y="14" width="6" height="12" rx="2" fill="none" stroke-width="1.8"/><rect x="30" y="14" width="6" height="12" rx="2" fill="none" stroke-width="1.8"/><path d="M10 20h20" stroke-width="3" fill="none"/></svg>`,
  microscope: `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M16 6l8 8-4 4-8-8zM20 14l-6 10a7 7 0 0 0 10 8" fill="none" stroke-width="1.8"/><path d="M8 34h24M14 30h12" fill="none" stroke-width="1.8"/></svg>`,
};
const BRANCH_CORNER = `<svg class="branch" viewBox="0 0 200 120" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M0 20 Q70 30 200 90"/><path d="M40 26 q10 -22 30 -26 q-4 20 -22 28"/><path d="M100 45 q22 -10 40 -2 q-16 16 -38 8"/><path d="M150 70 q4 -22 24 -30 q0 22 -18 34"/></g><g class="leaves"><path class="lf lf-y" d="M60 10c6 8 6 16 0 20-6-4-6-12 0-20z"/><path class="lf lf-p" d="M120 30c8 4 12 12 8 18-8 0-14-8-8-18z"/><path class="lf lf-t" d="M170 55c8 2 14 10 12 16-8 2-16-6-12-16z"/><path class="lf lf-s" d="M28 40c2 9-2 16-9 17-3-7 2-15 9-17z"/></g></svg>`;
const COLLAGE = `<div class="collage" aria-hidden="true"><span class="c1"></span><span class="c2"></span><span class="c3"></span><span class="c4"></span><span class="c5"></span><span class="c6"></span><span class="c7"></span></div>`;
const CLOUD = `<svg viewBox="0 0 120 70" class="cloud" aria-hidden="true"><path d="M28 52c-12 0-20-8-20-17 0-10 9-17 18-16C29 9 40 4 51 6c9-11 28-8 33 3 12-2 24 5 26 16 2 12-8 24-22 25z" /><circle cx="26" cy="62" r="4"/><circle cx="16" cy="67" r="2.5"/></svg>`;

/* ---------------------------------------------------------------- helpers */
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function savedTick(container) {
  let tick = container.querySelector('.saved-tick');
  if (!tick) {
    tick = el(`<span class="saved-tick" role="status">Saved on this device ${CHECKLEAF}</span>`);
    container.appendChild(tick);
  }
  tick.classList.remove('show');
  void tick.offsetWidth;
  tick.classList.add('show');
}

const PRIVACY_CHIP = `<div class="privacy-chip">${CHECKLEAF}<span><b>Private:</b> what you write is saved only on this device — never sent anywhere. <a href="#/privacy">How this works</a></span></div>`;

/* ---------------------------------------------------------------- block renderers */
const renderers = {
  p: (b) => el(`<p class="body">${b.html}</p>`),
  lead: (b) => el(`<p class="lead">${b.html}</p>`),
  prompt: (b) => el(`<p class="prompt">${b.html}</p>`),
  rule: () => el(`<hr class="rule">`),
  heading: (b) => el(`<h3 class="${b.big ? 'heading-big' : 'heading'}">${b.text}</h3>`),
  badge: (b) => el(`<span class="badge">${b.text}</span>`),
  scripttitle: (b) => el(`<h2 class="script-display">${b.text}</h2>`),
  quiztitle: () => el(`<h2 class="script-display quiz-title">Quiz<br>Yourself</h2>`),
  privacy: () => el(PRIVACY_CHIP),
  think: (b) => el(`<aside class="think"><span class="think-badge">${CLOUD}<span class="think-label script">Think<br>About This</span></span><div>${b.html}</div></aside>`),
  note: (b) => el(`<div class="note">${b.html}</div>`),
  quote: (b) => el(`<figure class="quote"><blockquote>&ldquo;${b.text}&rdquo;</blockquote></figure>`),
  cols: (b) => el(`<div class="cols ${b.cards ? 'cols--cards' : ''}"><div>${b.a}</div><div>${b.b}</div></div>`),
  ex: (b) => {
    if (!b.title) return el(`<p class="ex-num script">Exercise ${b.num}</p>`);
    return el(`<header class="ex-head"><p class="ex-num script">Exercise ${b.num}</p><h2 class="ex-title">${b.title}${b.sub ? ` <span class="ex-sub">${b.sub}</span>` : ''}</h2></header>`);
  },
  reachlist: () => el(`<ul class="reach-list">${REACH.map((r) => `<li><span class="script reach-letter">${r.letter}</span><div><span class="script reach-word">${r.word}</span><p>${r.desc}</p></div></li>`).join('')}</ul>`),
  icons: (b) => el(`<div class="icon-row">${b.items.map((i) => `<span class="obj-icon">${ICONS[i] || ''}</span>`).join('')}</div>`),
  benefits: (b) => el(`<div class="benefit-cards">${b.items.map((x) => `<section class="benefit"><h3>${x.title}</h3><p>${x.body}</p></section>`).join('')}</div>`),
  numbered: (b) => el(`<ol class="numbered">${b.items.map((x) => `<li>${x}</li>`).join('')}</ol>`),
  reveal: (b) => {
    const node = el(`<ul class="reveal">${b.items.map((x) => `<li>${CHECKLEAF}<span>${x}</span></li>`).join('')}</ul>`);
    requestAnimationFrame(() => node.querySelectorAll('li').forEach((li, i) => setTimeout(() => li.classList.add('in'), 150 + i * 450)));
    return node;
  },
  quiz: (b) => {
    const node = el(`<ul class="quizlist">${b.items.map((x) => `<li>${CHECKLEAF}<span>${x}</span></li>`).join('')}</ul>`);
    requestAnimationFrame(() => node.querySelectorAll('li').forEach((li, i) => setTimeout(() => li.classList.add('in'), 150 + i * 450)));
    return node;
  },
  example: (b) => el(`<div class="dialogue-example">${b.lines.map((l) => `<div class="bubble bubble--${l.who === 'ME' ? 'me' : 'them'}"><span class="who">${l.who === 'ME' ? 'Me' : 'Wrongdoer'}</span><p>${l.text}</p></div>`).join('')}</div>`),
  recall: (b) => {
    let content;
    if (b.dialogue) {
      const lines = store.get(b.key, []);
      content = Array.isArray(lines) && lines.length
        ? lines.filter((l) => l.text).map((l) => `<p><b>${l.who === 'me' ? 'Me' : 'Wrongdoer'}:</b> ${esc(l.text)}</p>`).join('')
        : `<p class="muted"><i>(You haven't written your dialogue yet — go back a step to write it.)</i></p>`;
    } else {
      const v = store.get(b.key, '');
      content = v ? `<p>${esc(v).replace(/\n/g, '<br>')}</p>` : `<p class="muted"><i>(Nothing written yet.)</i></p>`;
    }
    return el(`<div class="recall"><p class="recall-label">${b.label}</p><div class="recall-body">${content}</div></div>`);
  },

  text: (b) => {
    const wrap = el(`<div class="field ${b.short ? 'field--short' : ''}"></div>`);
    const ta = document.createElement('textarea');
    ta.rows = b.rows || 5;
    ta.placeholder = b.ph || 'Write here…';
    ta.value = typeof store.get(b.key) === 'string' ? store.get(b.key) : '';
    ta.setAttribute('aria-label', b.ph || 'Your response');
    const save = debounce(() => { store.set(b.key, ta.value); savedTick(wrap); }, 500);
    ta.addEventListener('input', save);
    wrap.appendChild(ta);
    return wrap;
  },

  fields: (b) => {
    const wrap = el(`<div class="fields"></div>`);
    b.items.forEach((f) => {
      const item = el(`<div class="field"><label class="field-label" for="f-${f.key}">${f.icon ? `<span class="obj-icon small">${ICONS[f.icon]}</span>` : ''}${f.label}</label></div>`);
      const ta = document.createElement('textarea');
      ta.id = `f-${f.key}`;
      ta.rows = f.rows || 3;
      ta.value = typeof store.get(f.key) === 'string' ? store.get(f.key) : '';
      const save = debounce(() => { store.set(f.key, ta.value); savedTick(item); }, 500);
      ta.addEventListener('input', save);
      item.appendChild(ta);
      wrap.appendChild(item);
    });
    return wrap;
  },

  scale: (b) => {
    const wrap = el(`<div class="scale-wrap"></div>`);
    if (b.compare && store.has(b.compare.key)) {
      wrap.appendChild(el(`<p class="compare">${b.compare.label}: <b>${esc(store.get(b.compare.key))}</b>. See how you feel now.</p>`));
    }
    const scale = el(`<div class="scale" role="radiogroup" aria-label="Rating from ${b.from} to ${b.to}"></div>`);
    const current = store.get(b.key, null);
    for (let v = b.from; v <= b.to; v++) {
      const btn = el(`<button type="button" class="scale-btn ${current == v ? 'sel' : ''}" role="radio" aria-checked="${current == v}"><span>${v}</span></button>`);
      btn.addEventListener('click', () => {
        store.set(b.key, v);
        scale.querySelectorAll('.scale-btn').forEach((x) => { x.classList.remove('sel'); x.setAttribute('aria-checked', 'false'); });
        btn.classList.add('sel');
        btn.setAttribute('aria-checked', 'true');
        savedTick(wrap);
      });
      scale.appendChild(btn);
    }
    wrap.appendChild(scale);
    return wrap;
  },

  ratingRows: (b) => {
    const wrap = el(`<div class="rating-rows"></div>`);
    b.items.forEach((item) => {
      const row = el(`<div class="rating-row"><p>${item.label}</p><div class="rating-opts" role="radiogroup"></div></div>`);
      const opts = row.querySelector('.rating-opts');
      const current = store.get(item.key, null);
      b.options.forEach((v) => {
        const btn = el(`<button type="button" class="scale-btn small ${current == v ? 'sel' : ''}" role="radio" aria-checked="${current == v}"><span>${v}</span></button>`);
        btn.addEventListener('click', () => {
          store.set(item.key, v);
          opts.querySelectorAll('.scale-btn').forEach((x) => { x.classList.remove('sel'); x.setAttribute('aria-checked', 'false'); });
          btn.classList.add('sel'); btn.setAttribute('aria-checked', 'true');
          savedTick(row);
        });
        opts.appendChild(btn);
      });
      wrap.appendChild(row);
    });
    return wrap;
  },

  choice: (b) => {
    const wrap = el(`<div class="choices ${b.pills ? 'choices--pills' : ''} ${b.big ? 'choices--big' : ''}" role="${b.multi ? 'group' : 'radiogroup'}"></div>`);
    const getSel = () => {
      const v = store.get(b.key, b.multi ? [] : null);
      return b.multi ? (Array.isArray(v) ? v : []) : v;
    };
    b.options.forEach((o) => {
      const selected = b.multi ? getSel().includes(o.v) : getSel() === o.v;
      const btn = el(`<button type="button" class="choice ${selected ? 'sel' : ''}" aria-pressed="${selected}">${o.icon ? `<span class="obj-icon">${ICONS[o.icon]}</span>` : ''}<span class="choice-label">${o.label}</span>${CHECKLEAF}</button>`);
      btn.addEventListener('click', () => {
        if (b.multi) {
          const cur = getSel();
          const next = cur.includes(o.v) ? cur.filter((x) => x !== o.v) : [...cur, o.v];
          store.set(b.key, next);
          btn.classList.toggle('sel');
          btn.setAttribute('aria-pressed', btn.classList.contains('sel'));
        } else {
          store.set(b.key, o.v);
          wrap.querySelectorAll('.choice').forEach((x) => { x.classList.remove('sel'); x.setAttribute('aria-pressed', 'false'); });
          btn.classList.add('sel'); btn.setAttribute('aria-pressed', 'true');
        }
        savedTick(wrap);
      });
      wrap.appendChild(btn);
    });
    return wrap;
  },

  goodbad: (b) => {
    const wrap = el(`<div class="goodbad"></div>`);
    b.items.forEach((item) => {
      const cur = store.get(item.key, null);
      const row = el(`<div class="gb-row"><p>${item.label}</p><div class="gb-btns" role="radiogroup"><button type="button" class="gb good ${cur === 'good' ? 'sel' : ''}">Good</button><button type="button" class="gb bad ${cur === 'bad' ? 'sel' : ''}">Bad</button></div></div>`);
      const [g, bad] = row.querySelectorAll('.gb');
      const set = (v, btn, other) => { store.set(item.key, v); btn.classList.add('sel'); other.classList.remove('sel'); savedTick(row); };
      g.addEventListener('click', () => set('good', g, bad));
      bad.addEventListener('click', () => set('bad', bad, g));
      wrap.appendChild(row);
    });
    return wrap;
  },

  rank: (b) => {
    const wrap = el(`<div class="rank"></div>`);
    const state = store.get(b.key, {});
    const rows = b.items.map((item) => {
      const row = el(`<div class="rank-row"><p>${item.label}</p><div class="rank-btns" role="radiogroup" data-id="${item.id}"></div></div>`);
      const btns = row.querySelector('.rank-btns');
      for (let v = 1; v <= b.items.length; v++) {
        const btn = el(`<button type="button" class="scale-btn small" data-v="${v}"><span>${v}</span></button>`);
        btn.addEventListener('click', () => {
          const cur = store.get(b.key, {});
          // remove this rank from any other item (each rank used once)
          Object.keys(cur).forEach((k) => { if (cur[k] === v && k !== item.id) delete cur[k]; });
          cur[item.id] = v;
          store.set(b.key, cur);
          sync();
          savedTick(wrap);
        });
        btns.appendChild(btn);
      }
      return row;
    });
    rows.forEach((r) => wrap.appendChild(r));
    const revealBox = el(`<div class="rank-reveal think" hidden><span class="think-badge">${CLOUD}<span class="think-label script">Think<br>About This</span></span><div>${b.reveal}</div></div>`);
    wrap.appendChild(revealBox);
    function sync() {
      const cur = store.get(b.key, {});
      wrap.querySelectorAll('.rank-btns').forEach((btns) => {
        const id = btns.dataset.id;
        btns.querySelectorAll('.scale-btn').forEach((btn) => {
          btn.classList.toggle('sel', cur[id] == btn.dataset.v);
        });
      });
      revealBox.hidden = Object.keys(cur).length < b.items.length;
    }
    sync();
    return wrap;
  },

  blanks: (b) => {
    const wrap = el(`<div class="blanks ${b.stacked ? 'blanks--stacked' : ''}"></div>`);
    if (b.intro) wrap.appendChild(el(`<p class="body">${b.intro}</p>`));
    const row = el(`<div class="blank-row"></div>`);
    b.items.forEach((item) => {
      const box = el(`<label class="blank">${item.hint ? `<span class="blank-hint ${b.stacked ? 'script' : ''}">${item.hint}</span>` : ''}<input type="text" size="${item.size || 14}" autocapitalize="none" autocomplete="off"><span class="blank-check">${CHECKLEAF}</span></label>`);
      const input = box.querySelector('input');
      input.value = store.get(item.key, '');
      const check = () => {
        const norm = input.value.trim().toLowerCase().replace(/[^a-z0-9 ]/g, '');
        box.classList.toggle('ok', item.answers.some((a) => norm === a || norm.startsWith(a)));
      };
      input.addEventListener('input', debounce(() => { store.set(item.key, input.value); check(); savedTick(wrap); }, 400));
      check();
      row.appendChild(box);
    });
    wrap.appendChild(row);
    return wrap;
  },

  movement: (b) => el(`<div class="movement"><span class="movement-tag script">Movement Activity</span><ul>${b.steps.map((s) => `<li>${LEAF()}<span>${s}</span></li>`).join('')}</ul></div>`),

  timer: (b) => {
    const total = b.seconds;
    const wrap = el(`
      <div class="timer" role="timer">
        <p class="timer-label">${b.label}</p>
        <div class="timer-face">
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <circle class="t-track" cx="60" cy="60" r="52"/>
            <circle class="t-fill" cx="60" cy="60" r="52" pathLength="100"/>
          </svg>
          <div class="timer-num" aria-live="polite">${fmt(total)}</div>
        </div>
        <div class="timer-btns">
          <button type="button" class="btn btn--primary t-start">Begin</button>
          <button type="button" class="btn btn--ghost t-reset" hidden>Reset</button>
        </div>
        <p class="timer-hint">No pressure — this timer is just here to hold the space with you.</p>
      </div>`);
    function fmt(s) { const m = Math.floor(s / 60); return m > 0 ? `${m}:${String(s % 60).padStart(2, '0')}` : `${s}`; }
    const num = wrap.querySelector('.timer-num');
    const fill = wrap.querySelector('.t-fill');
    const start = wrap.querySelector('.t-start');
    const reset = wrap.querySelector('.t-reset');
    let left = total, iv = null;
    function render() {
      num.textContent = fmt(left);
      fill.style.strokeDashoffset = 100 - ((total - left) / total) * 100;
    }
    function stop() { clearInterval(iv); iv = null; }
    start.addEventListener('click', () => {
      if (iv) { stop(); start.textContent = 'Resume'; return; }
      start.textContent = 'Pause';
      reset.hidden = false;
      iv = setInterval(() => {
        left -= 1;
        if (left <= 0) {
          left = 0; stop();
          start.textContent = 'Begin again';
          num.textContent = '✓';
          wrap.classList.add('done');
          left = total;
          setTimeout(() => { render(); wrap.classList.remove('done'); num.textContent = fmt(total); }, 4000);
          return;
        }
        render();
      }, 1000);
    });
    reset.addEventListener('click', () => { stop(); left = total; start.textContent = 'Begin'; wrap.classList.remove('done'); render(); });
    render();
    return wrap;
  },

  dialogue: (b) => {
    const wrap = el(`<div class="dialogue"></div>`);
    const list = el(`<div class="dialogue-lines"></div>`);
    wrap.appendChild(list);
    let lines = store.get(b.key, null);
    if (!Array.isArray(lines) || !lines.length) {
      lines = [];
      for (let i = 0; i < (b.min || 6); i++) lines.push({ who: i % 2 === 0 ? 'me' : 'them', text: '' });
    }
    const save = debounce(() => { store.set(b.key, lines); savedTick(wrap); }, 500);
    function row(line, i) {
      const r = el(`<div class="bubble bubble--${line.who === 'me' ? 'me' : 'them'} bubble--input"><span class="who">${line.who === 'me' ? 'Me' : 'Wrongdoer'}</span></div>`);
      const ta = document.createElement('textarea');
      ta.rows = 2;
      ta.placeholder = line.who === 'me' ? 'What do you say?' : 'What might they say?';
      ta.value = line.text || '';
      ta.addEventListener('input', () => { lines[i].text = ta.value; save(); });
      r.appendChild(ta);
      return r;
    }
    function renderAll() {
      list.innerHTML = '';
      lines.forEach((l, i) => list.appendChild(row(l, i)));
    }
    renderAll();
    const add = el(`<button type="button" class="btn btn--ghost">+ Add another exchange</button>`);
    add.addEventListener('click', () => {
      lines.push({ who: 'me', text: '' }, { who: 'them', text: '' });
      store.set(b.key, lines);
      renderAll();
    });
    wrap.appendChild(add);
    return wrap;
  },

  percent: (b) => {
    const wrap = el(`<div class="percent-block"><p class="prompt">${b.prompt}</p></div>`);
    const sentence = el(`<p class="percent-sentence"></p>`);
    const parts = b.sentence.split('{input}');
    sentence.appendChild(document.createTextNode(parts[0]));
    const input = el(`<input class="percent-input" type="number" min="0" max="100" inputmode="numeric" aria-label="Percent forgiven">`);
    input.value = store.get(b.key, '');
    input.addEventListener('input', debounce(() => { store.set(b.key, input.value); savedTick(wrap); }, 400));
    sentence.appendChild(input);
    sentence.appendChild(document.createTextNode(parts[1]));
    wrap.appendChild(sentence);
    return wrap;
  },

  pick: (b) => {
    const wrap = el(`<div class="pick" role="radiogroup"></div>`);
    const cur = store.get(b.key, null);
    let any = false;
    b.from.forEach((k, i) => {
      const v = store.get(k, '');
      if (!v || typeof v !== 'string' || !v.trim()) return;
      any = true;
      const btn = el(`<button type="button" class="choice pick-item ${cur === k ? 'sel' : ''}" role="radio" aria-checked="${cur === k}"><span class="pick-num">${i + 1}</span><span class="choice-label">${esc(v.length > 160 ? v.slice(0, 160) + '…' : v)}</span>${CHECKLEAF}</button>`);
      btn.addEventListener('click', () => {
        store.set(b.key, k);
        wrap.querySelectorAll('.choice').forEach((x) => { x.classList.remove('sel'); x.setAttribute('aria-checked', 'false'); });
        btn.classList.add('sel'); btn.setAttribute('aria-checked', 'true');
        savedTick(wrap);
      });
      wrap.appendChild(btn);
    });
    if (!any) wrap.appendChild(el(`<p class="muted"><i>Your five hurts from Step 2 (Exercise 9.2) will appear here once you've written them.</i></p>`));
    return wrap;
  },

  reachwrite: (b) => {
    const wrap = el(`<div class="reachwrite"></div>`);
    b.items.forEach((item) => {
      const card = el(`<section class="rw-card"><header><span class="rw-leaf">${LEAF()}<span class="script rw-letter">${item.letter}</span></span><div><p class="script rw-word">${item.word}</p><h3>${item.title}</h3></div></header><p class="prompt">${item.prompt}</p></section>`);
      const ta = document.createElement('textarea');
      ta.rows = 4;
      ta.value = typeof store.get(item.key) === 'string' ? store.get(item.key) : '';
      ta.addEventListener('input', debounce(() => { store.set(item.key, ta.value); savedTick(card); }, 500));
      card.appendChild(ta);
      wrap.appendChild(card);
    });
    return wrap;
  },

  selfmessage: () => {
    const wrap = el(`<div class="selfmsg"><p class="prompt">Draft your message here, then send it to yourself:</p></div>`);
    const ta = document.createElement('textarea');
    ta.rows = 4;
    ta.placeholder = 'I sincerely want to become a more forgiving person because…';
    ta.value = typeof store.get('self-message') === 'string' ? store.get('self-message') : '';
    ta.addEventListener('input', debounce(() => { store.set('self-message', ta.value); savedTick(wrap); }, 500));
    wrap.appendChild(ta);
    const btns = el(`<div class="selfmsg-btns"><a class="btn btn--primary" href="#">Open in your email app</a><button type="button" class="btn btn--ghost">Copy to clipboard</button></div>`);
    const [mail, copy] = btns.children;
    mail.addEventListener('click', (e) => {
      e.preventDefault();
      location.href = `mailto:?subject=${encodeURIComponent('My commitment to becoming a more forgiving person')}&body=${encodeURIComponent(ta.value)}`;
    });
    copy.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(ta.value); copy.textContent = 'Copied ✓'; setTimeout(() => (copy.textContent = 'Copy to clipboard'), 2000); } catch {}
    });
    wrap.appendChild(btns);
    wrap.appendChild(el(`<p class="tiny muted">Only the email <i>you</i> choose to send leaves this device — this site itself never sends anything.</p>`));
    return wrap;
  },

  certificate: () => {
    const d = new Date();
    const day = d.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
    const year = String(d.getFullYear());
    const wrap = el(`
      <div class="cert-wrap">
        <div class="certificate" id="certificate">
          <div class="cert-inner">
            <h3>Certificate of Emotional Forgiveness</h3>
            <p class="cert-line">I declare to myself that as of the date <b>${day}, ${year}</b>,</p>
            <p class="cert-line">I have decided to forgive <input id="cert-who" type="text" aria-label="Who you are forgiving" placeholder="who"> for</p>
            <p class="cert-line"><input id="cert-what" type="text" class="wide" aria-label="What you are forgiving" placeholder="the hurt you are forgiving">.</p>
            <p class="cert-line">To date, I have forgiven <input id="cert-pct" type="number" min="0" max="100" inputmode="numeric" aria-label="Percent"> percent of the emotional unforgiveness.</p>
            <p class="cert-line cert-signed">Signed: <input id="cert-sign" type="text" class="script-input" aria-label="Your signature" placeholder="your name"></p>
            <svg class="rosette" viewBox="0 0 80 100" aria-hidden="true"><circle cx="40" cy="40" r="26" fill="none" stroke-width="2"/><circle cx="40" cy="40" r="19" fill="none" stroke-width="1.5"/><g stroke-width="1.5" fill="none"><path d="M40 6l4 8h-8zM40 74l4-8h-8zM6 40l8 4v-8zM74 40l-8 4v-8zM16 16l8 4-4 4zM64 16l-8 4 4 4zM16 64l8-4-4-4zM64 64l-8-4 4-4z"/></g><path d="M30 64l-6 30 16-10 16 10-6-30" fill="none" stroke-width="2"/></svg>
          </div>
        </div>
        <div class="cert-btns"><button type="button" class="btn btn--primary" id="cert-print">Print or save as PDF</button></div>
        <p class="tiny muted">Your certificate is saved on this device with everything else — printing happens on your device too.</p>
      </div>`);
    const fields = { who: 'cert-who', what: 'cert-what', pct: 'cert-pct', sign: 'cert-sign' };
    Object.entries(fields).forEach(([k, id]) => {
      const input = wrap.querySelector(`#${id}`);
      input.value = store.get(`certificate-${k}`, '');
      input.addEventListener('input', debounce(() => { store.set(`certificate-${k}`, input.value); savedTick(wrap.querySelector('.cert-btns')); }, 400));
    });
    wrap.querySelector('#cert-print').addEventListener('click', () => {
      document.body.classList.add('printing-cert');
      window.print();
      setTimeout(() => document.body.classList.remove('printing-cert'), 500);
    });
    return wrap;
  },

  hoursmin: (b) => {
    const wrap = el(`<div class="hoursmin"><label><input type="number" min="0" inputmode="numeric" id="hm-h" aria-label="Hours"> <span>hours</span></label><label><input type="number" min="0" max="59" inputmode="numeric" id="hm-m" aria-label="Minutes"> <span>minutes</span></label></div>`);
    const v = store.get(b.key, { h: '', m: '' });
    const h = wrap.querySelector('#hm-h'), m = wrap.querySelector('#hm-m');
    h.value = v.h || ''; m.value = v.m || '';
    const save = debounce(() => { store.set(b.key, { h: h.value, m: m.value }); savedTick(wrap); }, 400);
    h.addEventListener('input', save); m.addEventListener('input', save);
    return wrap;
  },

  range: (b) => {
    const wrap = el(`<div class="range-wrap"><input type="range" min="0" max="100" step="10" aria-label="Likelihood percent"><div class="range-labels"><span>0%</span><span>50%</span><span>100%</span></div><p class="range-val"></p></div>`);
    const input = wrap.querySelector('input');
    const val = wrap.querySelector('.range-val');
    input.value = store.get(b.key, 50);
    const sync = () => { val.textContent = `${input.value}%`; };
    input.addEventListener('input', () => { sync(); });
    input.addEventListener('change', () => { store.set(b.key, input.value); savedTick(wrap); });
    sync();
    return wrap;
  },

  summary: () => {
    const rows = [
      { label: 'How forgiving you are as a person', a: 'rate-trait-1', b: 'rate-trait-12' },
      { label: 'Your decision to forgive this hurt', a: 'rate-decisional-1', b: 'rate-decisional-12' },
      { label: 'Your emotional forgiveness', a: 'rate-emotional-1', b: 'rate-emotional-12' },
    ];
    const wrap = el(`<div class="summary"><h3 class="heading">Your journey, in your own ratings</h3></div>`);
    rows.forEach((r) => {
      const a = Number(store.get(r.a, 0)) || 0;
      const b = Number(store.get(r.b, 0)) || 0;
      wrap.appendChild(el(`
        <div class="sum-row">
          <p>${r.label}</p>
          <div class="sum-bars">
            <div class="sum-bar"><span class="sum-tag">Lesson 1</span><span class="bar bar--before" style="--w:${a * 10}%"><i>${a || '–'}</i></span></div>
            <div class="sum-bar"><span class="sum-tag">Now</span><span class="bar bar--after" style="--w:${b * 10}%"><i>${b || '–'}</i></span></div>
          </div>
        </div>`));
    });
    wrap.appendChild(el(`<p class="tiny muted">Wherever these numbers landed, showing up for this work matters. Forgiveness deepens with repetition.</p>`));
    return wrap;
  },
};

function renderBlocks(blocks, mount) {
  blocks.forEach((b) => {
    const r = renderers[b.t];
    if (r) mount.appendChild(r(b));
  });
}

/* ---------------------------------------------------------------- shell */
function shell(inner, opts = {}) {
  app.innerHTML = '';
  app.appendChild(el(`
    <div class="page ${opts.dark ? 'page--dark' : ''} ${opts.cls || ''}">
      <header class="top">
        <a class="brand" href="#/journey" aria-label="REACH Forgiveness home">${LEAF('brand-leaf')}<span>REACH <b>Forgiveness</b></span></a>
        <button type="button" class="menu-btn" aria-label="Menu" aria-expanded="false"><span></span><span></span></button>
      </header>
      <nav class="drawer" hidden>
        <a href="#/journey">Your journey</a>
        <a href="#/letter">A letter from Ev &amp; Tyler</a>
        <a href="#/reach">What is REACH?</a>
        <a href="#/privacy">Privacy &amp; your data</a>
        <a href="#/resources">Support resources</a>
        <a href="#/about">About this workbook</a>
      </nav>
      <main id="main"></main>
      <footer class="foot">
        <p>${CHECKLEAF} Private by design — everything you write stays on this device. <a href="#/privacy">Learn more</a></p>
        <p class="foot-links"><a href="#/resources">Psychological support resources</a> · <a href="#/about">About &amp; credits</a></p>
        <p class="tiny">REACH Forgiveness by Everett L. Worthington, Jr. · Adapted by the <a href="https://hfh.fas.harvard.edu/" target="_blank" rel="noopener">Human Flourishing Program</a> at Harvard University · This self-guided workbook is not a substitute for professional mental-health care.</p>
      </footer>
    </div>`));
  const menuBtn = app.querySelector('.menu-btn');
  const drawer = app.querySelector('.drawer');
  menuBtn.addEventListener('click', () => {
    const open = !drawer.hidden;
    drawer.hidden = open;
    menuBtn.setAttribute('aria-expanded', String(!open));
    menuBtn.classList.toggle('open', !open);
  });
  const main = app.querySelector('#main');
  main.appendChild(inner);
  window.scrollTo(0, 0);
  return main;
}

/* ---------------------------------------------------------------- views */
function viewWelcome() {
  const started = store.hasAnyData();
  const inner = el(`
    <div class="welcome">
      ${BRANCH_CORNER}
      <div class="welcome-hero">
        <h1 class="welcome-title"><span class="wt-line">Your Path to</span> <span class="script wt-script">REACH</span> <span class="wt-line wt-big">Forgiveness</span></h1>
        <p class="welcome-sub">Self-directed learning exercises to become a more forgiving person in a few hours</p>
      </div>
      <div class="promise">
        ${CHECKLEAF}
        <div>
          <h2>Everything you write stays with you.</h2>
          <p>This workbook asks you to write about real hurts. So there are <b>no accounts, no logins, and no server</b>. Your words are saved only in this browser, on this device — they are never sent anywhere, and we couldn't read them even if we wanted to. <a href="#/privacy">How this works →</a></p>
        </div>
      </div>
      <div class="welcome-facts">
        <p>${LEAF()}<span><b>12 experiences</b>, each 10–20 minutes</span></p>
        <p>${LEAF()}<span>Evidence-based: tested in randomized trials with 4,500+ participants</span></p>
        <p>${LEAF()}<span>Pick up right where you left off, any time</span></p>
      </div>
      <div class="welcome-cta">
        ${started ? `<a class="btn btn--primary btn--big" href="#/journey">Continue your journey</a>` : `<a class="btn btn--primary btn--big" href="#/letter">Begin</a>`}
        ${started ? `<a class="btn btn--ghost" href="#/letter">Start from the letter</a>` : ''}
      </div>
      <p class="welcome-credit">By Everett L. Worthington, Jr. · Adapted by the Human Flourishing Program at Harvard University</p>
    </div>`);
  shell(inner, { cls: 'shell--welcome' });
}

function viewLetter() {
  const inner = el(`<article class="letter"><h1 class="script letter-head">${LETTER.heading}</h1>${LETTER.paras.map((x) => `<p>${x}</p>`).join('')}<p class="letter-signoff">${LETTER.signoff}</p><p class="script letter-sig">${LETTER.signature}</p><div class="stepnav"><a class="btn btn--primary" href="#/reach">Next: The five steps →</a></div></article>`);
  shell(inner, { dark: true });
}

function viewReach() {
  const inner = el(`<div class="reach-view"><h1 class="page-title">The five steps to <span class="script accent">REACH</span> Forgiveness</h1><div class="reach-mount"></div><div class="stepnav"><a class="btn btn--primary" href="#/lesson/1">Start Lesson 1 →</a><a class="btn btn--ghost" href="#/journey">See the whole journey</a></div></div>`);
  renderBlocks([{ t: 'reachlist' }], inner.querySelector('.reach-mount'));
  requestAnimationFrame(() => inner.querySelectorAll('.reach-list li').forEach((li, i) => setTimeout(() => li.classList.add('in'), 200 + i * 350)));
  shell(inner);
}

function viewJourney() {
  const completed = store.completedLessons();
  const prog = store.getProgress();
  const inner = el(`<div class="journey"><h1 class="page-title">Your journey</h1></div>`);
  if (!store.hasAnyData()) {
    inner.appendChild(el(`<div class="promise slim">${CHECKLEAF}<div><p><b>Private by design:</b> everything you write is saved only on this device. No account, no server. <a href="#/privacy">How this works</a></p></div></div>`));
  }
  if (prog && !(completed.size === LESSONS.length)) {
    const lesson = LESSONS.find((l) => l.n === prog.lesson);
    if (lesson) {
      const card = el(`<a class="resume" href="#/lesson/${prog.lesson}/${prog.step}"><span class="resume-label script">Welcome back</span><p>Continue <b>Lesson ${prog.lesson}: ${lesson.title}</b> — ${lesson.steps[prog.step - 1] ? lesson.steps[prog.step - 1].name : ''}</p><span class="btn btn--primary">Continue →</span></a>`);
      inner.appendChild(card);
    }
  }
  const list = el(`<ol class="lesson-list"></ol>`);
  LESSONS.forEach((l) => {
    const done = completed.has(l.n);
    const inProgress = prog && prog.lesson === l.n && !done;
    const li = el(`
      <li class="lesson-card ${done ? 'done' : ''} ${inProgress ? 'now' : ''}">
        <a href="#/lesson/${l.n}">
          <span class="lc-leaf">${done ? CHECKLEAF : LEAF()}</span>
          <span class="lc-text">
            <span class="lc-num">Lesson ${l.n}${l.part ? ` · ${l.part}` : ''}${l.letter ? ` · <i class="script lc-letter">${l.letter}</i>` : ''}</span>
            <span class="lc-title">${l.title}</span>
            <span class="lc-status">${done ? 'Complete' : inProgress ? 'In progress' : `${l.steps.length} steps · 10–20 min`}</span>
          </span>
        </a>
      </li>`);
    list.appendChild(li);
  });
  inner.appendChild(list);
  inner.appendChild(el(`<div class="journey-extras"><a href="#/letter">${LEAF()} A letter from Ev &amp; Tyler</a><a href="#/reach">${LEAF()} What is REACH?</a><a href="#/privacy">${LEAF()} Privacy &amp; your data</a></div>`));
  shell(inner);
}

function viewCover(n) {
  const l = LESSONS.find((x) => x.n === n);
  if (!l) return viewJourney();
  const inner = el(`
    <div class="cover">
      ${COLLAGE}
      <div class="cover-body">
        <span class="badge">Lesson ${l.n}</span>
        ${l.letter ? `<span class="script cover-letter">${l.letter}</span>` : ''}
        <h1>${l.title}</h1>
        ${l.part ? `<p class="cover-part">${l.part}</p>` : ''}
        ${l.intro ? `<p class="cover-intro">${l.intro}</p>` : ''}
        <a class="btn btn--light btn--big" href="#/lesson/${l.n}/1">${store.getProgress() && store.getProgress().lesson === n ? 'Continue' : 'Begin'} →</a>
      </div>
    </div>`);
  shell(inner, { cls: 'shell--cover' });
}

function viewStep(n, s) {
  const l = LESSONS.find((x) => x.n === n);
  if (!l) return viewJourney();
  const step = l.steps[s - 1];
  if (!step) return viewCover(n);
  store.setProgress(n, s);
  store.bumpFurthest(n, s);

  const dots = l.steps.map((st, i) => `<a class="dot ${i + 1 === s ? 'cur' : ''} ${i + 1 < s ? 'past' : ''}" href="#/lesson/${n}/${i + 1}" aria-label="Step ${i + 1}: ${esc(st.name)}" title="${esc(st.name)}"></a>`).join('');
  const inner = el(`
    <div class="step ${step.dark ? 'step--dark' : ''}">
      <div class="step-meta">
        <a class="step-lesson" href="#/lesson/${n}">Lesson ${n}${l.letter ? ` · <span class="script">${l.letter}</span>` : ''}</a>
        <span class="step-count">${s} of ${l.steps.length}</span>
      </div>
      <div class="dots">${dots}</div>
      <div class="blocks anim-in"></div>
      <div class="stepnav">
        ${s > 1 ? `<a class="btn btn--ghost" href="#/lesson/${n}/${s - 1}">← Back</a>` : `<a class="btn btn--ghost" href="#/lesson/${n}">← Lesson ${n}</a>`}
        ${s < l.steps.length
          ? `<a class="btn btn--primary" href="#/lesson/${n}/${s + 1}">Continue →</a>`
          : `<a class="btn btn--primary" href="#/lesson/${n}/done" data-complete>Finish Lesson ${n} ${LEAF()}</a>`}
      </div>
    </div>`);
  renderBlocks(step.blocks, inner.querySelector('.blocks'));
  const fin = inner.querySelector('[data-complete]');
  if (fin) fin.addEventListener('click', () => store.completeLesson(n));
  shell(inner, { dark: !!step.dark });
}

function viewLessonDone(n) {
  const l = LESSONS.find((x) => x.n === n);
  if (!l) return viewJourney();
  store.completeLesson(n);
  const next = LESSONS.find((x) => x.n === n + 1);
  if (next) store.setProgress(next.n, 1);
  const inner = el(`
    <div class="done-view">
      <div class="sprout" aria-hidden="true">
        <svg viewBox="0 0 120 140"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path class="stem" d="M60 130 C60 100 60 80 60 55"/><path class="sd-leaf a" d="M60 90 C40 85 30 70 32 58 C48 60 58 72 60 90z"/><path class="sd-leaf b" d="M60 75 C80 70 90 55 88 43 C72 45 62 57 60 75z"/><path class="sd-leaf c" d="M60 55 C48 45 46 32 52 24 C62 30 64 44 60 55z"/></g><path class="mound" d="M35 132 q25 -10 50 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </div>
      <p class="script done-script">Well done</p>
      <h1>Lesson ${n} complete</h1>
      <p class="done-sub">${next ? `You've finished <b>${l.title}</b>. Whenever you're ready, the next lesson is <b>${next.title}</b>${next.part ? ` (${next.part})` : ''}.` : `You've finished the whole workbook.`}</p>
      <div class="stepnav">
        ${next ? `<a class="btn btn--primary btn--big" href="#/lesson/${next.n}">Continue to Lesson ${next.n} →</a>` : `<a class="btn btn--primary btn--big" href="#/journey">See your completed journey</a>`}
        <a class="btn btn--ghost" href="#/journey">Back to your journey</a>
      </div>
      ${!next ? `<p class="done-sub">Thank you for doing this work. You can revisit any lesson, or <a href="#/privacy">download everything you wrote</a> to keep.</p>` : ''}
    </div>`);
  shell(inner, { dark: true });
}

function viewPrivacy() {
  const inner = el(`
    <article class="prose">
      <h1 class="page-title">Privacy &amp; your data</h1>
      <div class="promise slim">${CHECKLEAF}<div><p><b>The short version:</b> everything you write stays on this device. Nothing is ever sent anywhere.</p></div></div>
      <h2>How it works</h2>
      <p>This site is a set of static files — there is <b>no server, no database, no account, and no analytics</b>. When you type a response, it is saved by your browser using a feature called <i>localStorage</i>, which lives entirely on your device. Your responses are never transmitted over the internet. You can verify this: open your browser's developer tools and watch the network tab — after the page loads, no requests are made at all.</p>
      <h2>What that means in practice</h2>
      <ul>
        <li>${LEAF()}<span>Your writing persists between visits, so you can complete the 12 lessons over days or weeks. It stays until <b>you</b> delete it.</span></li>
        <li>${LEAF()}<span>Anyone who uses this same browser profile on this device could open this site and see your responses. If you share a computer, consider using a private/incognito window (note: your writing is erased when a private window closes) or erasing your data below when you finish.</span></li>
        <li>${LEAF()}<span>Clearing your browser's site data will also erase your responses. Use the download button below first if you want to keep them.</span></li>
        <li>${LEAF()}<span>Your responses do not follow you across devices or browsers — there is no account and no cloud copy.</span></li>
      </ul>
      <h2>Your data, your controls</h2>
      <div class="data-btns">
        <button type="button" class="btn btn--primary" id="dl-text">Download my responses (text)</button>
        <button type="button" class="btn btn--ghost" id="dl-json">Download raw data (JSON)</button>
        <button type="button" class="btn btn--danger" id="erase">Erase everything</button>
      </div>
      <p class="tiny muted">Downloads are generated on your device by your browser — nothing is uploaded.</p>
    </article>`);
  const main = shell(inner);
  main.querySelector('#dl-json').addEventListener('click', () => download('reach-forgiveness-data.json', store.exportJSON(), 'application/json'));
  main.querySelector('#dl-text').addEventListener('click', () => download('reach-forgiveness-responses.txt', exportText(), 'text/plain'));
  main.querySelector('#erase').addEventListener('click', () => {
    if (confirm('Erase everything you have written and all progress from this device? This cannot be undone.')) {
      store.eraseAll();
      location.hash = '#/';
    }
  });
}

function download(name, content, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}

function exportText() {
  const out = [`YOUR PATH TO REACH FORGIVENESS — my responses`, `Exported ${new Date().toLocaleString()}`, `(This file was created on your device. Keep it somewhere private.)`, ''];
  const answers = store.allAnswers();
  LESSONS.forEach((l) => {
    const lines = [];
    l.steps.forEach((s) => {
      s.blocks.forEach((b) => {
        const grab = (key, label) => {
          const v = answers[key];
          if (v === undefined || v === '' || v === null) return;
          let str = v;
          if (Array.isArray(v) && key === 'roleplay') str = v.filter((x) => x.text).map((x) => `${x.who === 'me' ? 'Me' : 'Wrongdoer'}: ${x.text}`).join('\n');
          else if (Array.isArray(v)) str = v.join(', ');
          else if (typeof v === 'object') str = JSON.stringify(v);
          lines.push(`• ${label || key}\n  ${String(str).replace(/\n/g, '\n  ')}`);
        };
        if (b.key) grab(b.key, b.prompt || (b.t === 'scale' ? 'Rating' : null));
        if (b.items) b.items.forEach((it) => it.key && grab(it.key, it.label));
      });
    });
    if (lines.length) out.push(`═══ LESSON ${l.n}: ${l.title} ═══`, ...lines, '');
  });
  ['certificate-who', 'certificate-what', 'certificate-pct', 'certificate-sign'].forEach((k) => {
    if (answers[k]) out.push(`Certificate — ${k.replace('certificate-', '')}: ${answers[k]}`);
  });
  return out.join('\n');
}

function viewResources() {
  const inner = el(`
    <article class="prose">
      <h1 class="script page-title-script">${RESOURCES.title}</h1>
      <p class="body">${RESOURCES.intro}</p>
      <p class="body"><b>Below are some resources that you might find helpful.</b></p>
      <h2>${RESOURCES.listTitle}</h2>
      <ul class="res-list">${RESOURCES.links.map((r) => `<li>${LEAF()}<a href="${r.url}" target="_blank" rel="noopener">${r.label}</a></li>`).join('')}</ul>
      <p class="tiny muted">${esc(RESOURCES.credit)}</p>
      <p class="tiny muted">If you are in crisis or thinking about harming yourself, please reach out now: in the US, call or text <b>988</b>; elsewhere, contact your local emergency services or a trusted crisis line.</p>
    </article>`);
  shell(inner, { dark: true });
}

function viewAbout() {
  const inner = el(`
    <article class="prose">
      <h1 class="page-title">About this workbook</h1>
      ${CREDITS.paras.map((x) => `<p class="body">${x}</p>`).join('')}
      <p class="body">This interactive edition adapts the workbook for the web. It is a static site: your responses stay on your device (<a href="#/privacy">privacy details</a>).</p>
      <p class="body">Book design by Wyndetryst (<a href="https://wyndetryst.com" target="_blank" rel="noopener">wyndetryst.com</a>).</p>
    </article>`);
  shell(inner);
}

/* ---------------------------------------------------------------- router */
function route() {
  const h = location.hash.replace(/^#\/?/, '');
  const parts = h.split('/').filter(Boolean);
  if (!parts.length) return store.hasAnyData() ? viewJourney() : viewWelcome();
  switch (parts[0]) {
    case 'welcome': return viewWelcome();
    case 'journey': return viewJourney();
    case 'letter': return viewLetter();
    case 'reach': return viewReach();
    case 'privacy': return viewPrivacy();
    case 'resources': return viewResources();
    case 'about': return viewAbout();
    case 'lesson': {
      const n = parseInt(parts[1], 10);
      if (!n) return viewJourney();
      if (parts[2] === 'done') return viewLessonDone(n);
      const s = parseInt(parts[2], 10);
      return s ? viewStep(n, s) : viewCover(n);
    }
    default: return viewWelcome();
  }
}

window.addEventListener('hashchange', route);
route();

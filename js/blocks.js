/* The one page renderer. Turns a list of blocks (see content-schema.js) into
   the same styled sections the hand-built pages use — a Kate-built page and a
   Wyatt-built page render through the same classes by construction.
   All editor text is escaped; links resolve against the site root. */

export const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const paras = (body = '') =>
  body.split(/\n\s*\n/).filter(Boolean).map((p) => `<p>${esc(p.trim())}</p>`).join('');

const link = (href = '', root = '/') =>
  /^(https?:|mailto:)/.test(href) ? esc(href) : esc(root + href.replace(/^\//, ''));

const buttons = (list = [], root, darkOutline = false) =>
  list.filter((b) => b.label).map((b) => {
    const style = b.style === 'outline'
      ? `btn--outline${darkOutline ? '" style="border-color:var(--sage);color:var(--sage)' : ''}`
      : b.style === 'plum' ? 'btn--plum' : 'btn--primary';
    return `<a class="btn ${style}" href="${link(b.href, root)}">${esc(b.label)}</a>`;
  }).join('');

const RENDER = {
  hero: (b, root) => `
    <section class="section section--paper"><div class="wrap">
      ${b.kicker ? `<p class="kicker">${esc(b.kicker)}</p>` : ''}
      <h1>${esc(b.title)}</h1>
      ${b.text ? paras(b.text) : ''}
      ${b.buttons?.length ? `<p style="display:flex;gap:0.7rem;flex-wrap:wrap">${buttons(b.buttons, root)}</p>` : ''}
    </div></section>`,

  text: (b) => `
    <section class="section"><div class="wrap">
      ${b.title ? `<h2>${esc(b.title)}</h2>` : ''}
      ${paras(b.body)}
    </div></section>`,

  cards: (b) => `
    <section class="section section--paper"><div class="wrap">
      ${b.title ? `<h2>${esc(b.title)}</h2>` : ''}
      <div class="grid grid--${Math.min(b.items?.length || 1, 3)}">
        ${(b.items || []).map((c) => `<div class="card">
          ${c.kicker ? `<p class="kicker">${esc(c.kicker)}</p>` : ''}
          ${c.title ? `<h3>${esc(c.title)}</h3>` : ''}
          ${c.text ? `<p class="small">${esc(c.text)}</p>` : ''}
        </div>`).join('')}
      </div>
    </div></section>`,

  video: (b) => `
    <section class="section"><div class="wrap" style="max-width:820px">
      <figure class="video">
        <iframe src="${esc(b.src)}" title="${esc(b.caption || 'Video')}" loading="lazy"
          allow="encrypted-media; picture-in-picture" allowfullscreen></iframe>
        ${b.caption ? `<figcaption>${esc(b.caption)}</figcaption>` : ''}
      </figure>
    </div></section>`,

  stats: (b) => `
    <section class="section"><div class="wrap stats">
      ${(b.items || []).map((s) => `<div class="stat"><b>${esc(s.number)}</b><span>${esc(s.label)}</span></div>`).join('')}
    </div></section>`,

  quotes: (b) => `
    <section class="section section--paper"><div class="wrap">
      <div class="grid grid--${Math.min(b.items?.length || 1, 3)}">
        ${(b.items || []).map((q) => `<blockquote class="quote"><p>“${esc(q.quote)}”</p>
          ${q.attribution ? `<footer>${esc(q.attribution)}</footer>` : ''}</blockquote>`).join('')}
      </div>
    </div></section>`,

  notice: (b) => `
    <section class="section"><div class="wrap"><p class="notice">${esc(b.text)}</p></div></section>`,

  band: (b, root) => `
    <section class="section section--navy center"><div class="wrap">
      <h2>${esc(b.title)}</h2>
      ${b.text ? `<p style="margin:0 auto 1.4rem">${esc(b.text)}</p>` : ''}
      ${b.buttons?.length ? `<p style="display:flex;gap:0.7rem;flex-wrap:wrap;justify-content:center">${buttons(b.buttons, root, true)}</p>` : ''}
    </div></section>`,
};

export function renderBlocks(blocks = [], root = '/') {
  return blocks.map((b) => (RENDER[b.type] ? RENDER[b.type](b, root) : '')).join('');
}

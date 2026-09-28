/* Which address a film plays from — decided here, and only here.

   An editor pastes whatever link they have into /admin → Videos: a Vimeo page
   (https://vimeo.com/123456789), a Vimeo private link (vimeo.com/123/abcdef),
   a YouTube watch, share, Shorts or playlist link, or an embed address. The
   page needs the embed address. embedUrl() turns the one into the other, and
   videoFrame() is the only place on the site that draws the <iframe> — the
   home page, the Groups page, Research, the series boxes and editor-built
   pages all come through it (scripts/qa/one-video-address.mjs goes red if an
   iframe is built anywhere else).

   Pure: no DOM, no fetch, so the QA script can run it in Node. */

const YT_ID = /^[A-Za-z0-9_-]{11}$/;
const YT_EMBED = 'https://www.youtube-nocookie.com/embed/';

function parse(link) {
  const s = String(link ?? '').trim();
  if (!s) return null;
  try {
    return new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(s) ? s : `https://${s.replace(/^\/\//, '')}`);
  } catch {
    return null;
  }
}

/* "1m30s", "90s" or "90" → seconds, for YouTube's ?start=. */
function seconds(t) {
  if (!t) return 0;
  if (/^\d+$/.test(t)) return Number(t);
  const m = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(t);
  return m ? (Number(m[1] || 0) * 3600) + (Number(m[2] || 0) * 60) + Number(m[3] || 0) : 0;
}

function youtube(u, host) {
  const q = u.searchParams;
  const parts = u.pathname.split('/').filter(Boolean);
  let id = null;
  if (host === 'youtu.be') id = parts[0];
  else if (parts[0] === 'watch') id = q.get('v');
  else if (['embed', 'shorts', 'live', 'v', 'e'].includes(parts[0])) id = parts[1];
  const list = q.get('list');
  if (id === 'videoseries' || (!id && list)) {
    return list ? `${YT_EMBED}videoseries?list=${encodeURIComponent(list)}` : null;
  }
  if (!id || !YT_ID.test(id)) return null;
  const out = new URLSearchParams();
  const start = seconds(q.get('start') || q.get('t'));
  if (start) out.set('start', String(start));
  if (list) out.set('list', list);
  const tail = out.toString();
  return `${YT_EMBED}${id}${tail ? `?${tail}` : ''}`;
}

function vimeo(u, host) {
  const parts = u.pathname.split('/').filter(Boolean);
  let id = null;
  let hash = u.searchParams.get('h');
  if (host === 'player.vimeo.com') {
    if (parts[0] === 'video' && /^\d+$/.test(parts[1] || '')) id = parts[1];
  } else {
    /* The id is the first all-digit segment (vimeo.com/123, /channels/x/123,
       /groups/x/videos/123, /manage/videos/123); a private link carries its
       key in the segment straight after it (vimeo.com/123/abcdef). */
    const at = parts.findIndex((p) => /^\d+$/.test(p));
    if (at >= 0) {
      id = parts[at];
      const next = parts[at + 1];
      if (!hash && next && /^[0-9a-f]{6,}$/i.test(next)) hash = next;
    }
  }
  if (!id) return null;
  /* Vimeo's own overlay would show the raw upload name ("Nonrel_60promo v7")
     and the uploader's portrait to every visitor. Hidden here, once, for every
     film on the site (Wyatt, 28 Sep). */
  const q = new URLSearchParams();
  if (hash) q.set('h', hash);
  q.set('title', '0'); q.set('byline', '0'); q.set('portrait', '0');
  return `https://player.vimeo.com/video/${id}?${q}`;
}

/* Any YouTube or Vimeo page, share or embed link → the address the film plays
   from. Another https address is trusted as an embed and passed through; a
   link that is not an address at all gives null (the slot then stays empty
   rather than drawing a broken frame). */
export function embedUrl(link) {
  const u = parse(link);
  if (!u || !/^https?:$/.test(u.protocol)) return null;
  const host = u.hostname.replace(/^(www|m)\./, '');
  if (['youtube.com', 'youtube-nocookie.com', 'youtu.be', 'music.youtube.com'].includes(host)) return youtube(u, host);
  if (host === 'vimeo.com' || host === 'player.vimeo.com') return vimeo(u, host);
  return u.protocol === 'https:' ? u.href : null;
}

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* The one <iframe> on the site. `link` is whatever the editor pasted. */
export function videoFrame(link, title = 'Video') {
  const src = embedUrl(link);
  if (!src) return '';
  return `<iframe src="${esc(src)}" title="${esc(title)}" loading="lazy"
    allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
}

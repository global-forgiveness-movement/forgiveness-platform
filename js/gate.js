/* The pre-launch gate — one implementation for every page, including the
   interactive workbook (which has its own chrome and skips the site shell).
   A curtain, not a lock: it keeps the preview out of casual view. It carries
   its own styles so any page can use it without the site stylesheet. */

/* Key bumped to v2 when the password changed (2026-08-21, Wyatt's call: Kate
   shouldn't see the site yet) — bumping invalidates any earlier unlock.
   The /plan scope doc keeps its own separate password. */
const GATE_KEY = 'gfm.gate.v2';
const GATE_HASH = 'c340b23d6607ae41367b3c4ca08f46f750c539a5e37a93c8ce05ebdf4c504e4b'; // sha256("reach1")

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const leaf = (fill) =>
  `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C7 7 4 12 4 16a8 8 0 0 0 16 0c0-4-3-9-8-14z" fill="${fill}" transform="rotate(40 12 12)"/></svg>`;

const GATE_CSS = `
.gate{position:fixed;inset:0;z-index:50;display:grid;place-items:center;background:#f5f1e2;padding:1.5rem;
  font-family:'Nunito Sans','Avenir','Segoe UI',sans-serif;color:#24333e}
.gate-card{max-width:400px;width:100%;text-align:center}
.gate-card svg{width:44px;height:44px;margin-bottom:0.8rem}
.gate-card .script{font-family:'Sacramento','Snell Roundhand',cursive;font-size:2.1rem;color:#006d62;line-height:1.1;display:block}
.gate-card h1{font-family:'Poppins','Trebuchet MS',sans-serif;font-size:1.35rem;color:#003d57;margin:0.2rem 0 0.4rem}
.gate-card p{font-size:0.92rem;color:rgba(36,51,62,0.66);margin:0 auto 1.2rem}
.gate-card form{display:flex;gap:0.5rem}
.gate-card input{flex:1;border:1.5px solid rgba(0,61,87,0.14);border-radius:999px;background:#fffdf7;padding:0.65rem 1.1rem;font-size:1rem;font-family:inherit}
.gate-card input:focus{border-color:#00887a;outline:none}
.gate-card button{border:0;border-radius:999px;background:#00887a;color:#fff;font-family:'Poppins',sans-serif;
  font-weight:600;font-size:0.98rem;padding:0.75rem 1.5rem;cursor:pointer}
.gate-err{color:#770061;font-size:0.88rem;min-height:1.4em;margin-top:0.6rem}
.gate .visually-hidden{position:absolute;width:1px;height:1px;margin:-1px;clip-path:inset(50%);overflow:hidden;white-space:nowrap}
`;

export const gateOpen = () => localStorage.getItem(GATE_KEY) === 'open';

export function ensureGate(onOpen) {
  if (gateOpen()) return onOpen();

  const style = document.createElement('style');
  style.textContent = GATE_CSS;
  document.head.append(style);

  const gate = document.createElement('div');
  gate.className = 'gate';
  gate.innerHTML = `
    <div class="gate-card">
      ${leaf('#00887a')}
      <span class="script">Global Forgiveness</span>
      <h1>A site in the making</h1>
      <p>This preview isn’t public yet. Enter the password Wyatt sent you to look around.</p>
      <form>
        <label class="visually-hidden" for="gatePw">Password</label>
        <input id="gatePw" type="password" autocomplete="off" autofocus>
        <button type="submit">Enter</button>
      </form>
      <div class="gate-err" role="alert" aria-live="polite"></div>
    </div>`;
  document.body.append(gate);
  document.documentElement.setAttribute('data-shell-ready', '');
  gate.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const pw = gate.querySelector('input').value.trim().toLowerCase();
    if ((await sha256(pw)) === GATE_HASH) {
      localStorage.setItem(GATE_KEY, 'open');
      gate.remove();
      style.remove();
      onOpen();
    } else {
      gate.querySelector('.gate-err').textContent = 'That’s not it — check the note from Wyatt.';
    }
  });
}

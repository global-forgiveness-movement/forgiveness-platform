/* One account layer, two backends — Firebase Auth when configured, a local
   demo otherwise. Every page gets the same API either way; the UI labels demo
   mode honestly wherever it appears. */

import { store, MODE, withPatience } from './store.js';
import { firebaseConfig } from './firebase-config.js';

export const AUTH_MODE = MODE; // 'firebase' | 'demo'

const listeners = new Set();
let user = null; // normalized: { id, name, email }
let resolved = false; // true once the backend has answered (or the wait ran out)

export const currentUser = () => user;

/* Tri-state on purpose: before the backend's first answer the state is
   UNKNOWN, not signed out. Listeners hear nothing until announce() —
   broadcasting an early null used to paint every signed-in page signed-out
   for the SDK's whole load time (the My Path flash, Wyatt 1 Sep). */
export function onAuth(cb) {
  listeners.add(cb);
  if (resolved) cb(user);
  return () => listeners.delete(cb);
}

/* One bit, no identity: "this device's last answer was signed-in". Lets the
   header hold back the sign-in links it would otherwise flash at a
   returning member. Written only here; js/site.js buildHeader() reads the
   same key for the header's very first paint. */
const HINT = 'gfm.auth.hint.v1';
const wasSignedIn = () => {
  try { return localStorage.getItem(HINT) === '1'; } catch { return false; }
};

function announce(next) {
  resolved = true;
  user = next;
  try { next ? localStorage.setItem(HINT, '1') : localStorage.removeItem(HINT); } catch {}
  listeners.forEach((cb) => cb(user));
}

const norm = (email) => email.trim().toLowerCase();
async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/* ------------------------------------------------------------- demo */
const SESSION = 'gfm.session.v1';
const uidFor = (email) => 'u_' + email.replaceAll(/[^a-z0-9]/g, '_');

const demo = {
  async init() {
    const email = localStorage.getItem(SESSION);
    if (!email) return announce(null);
    const rec = await store.get('demoUsers', uidFor(email));
    announce(rec ? { id: uidFor(email), name: rec.name, email } : null);
  },
  async signUp({ name, email, password, newsletter }) {
    email = norm(email);
    if (await store.get('demoUsers', uidFor(email))) throw new Error('An account with that email already exists — try signing in.');
    await store.set('demoUsers', uidFor(email), {
      name, email, newsletter: !!newsletter,
      pwHash: await sha256(password),
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem(SESSION, email);
    announce({ id: uidFor(email), name, email });
  },
  async signIn({ email, password }) {
    email = norm(email);
    const rec = await store.get('demoUsers', uidFor(email));
    if (!rec || rec.pwHash !== (await sha256(password))) throw new Error('That email and password don’t match an account here.');
    localStorage.setItem(SESSION, email);
    announce({ id: uidFor(email), name: rec.name, email });
  },
  async signInGoogle() {
    const email = 'demo.google@example.com';
    if (!(await store.get('demoUsers', uidFor(email)))) {
      await store.set('demoUsers', uidFor(email), { name: 'Demo Visitor', email, pwHash: null, createdAt: new Date().toISOString() });
    }
    localStorage.setItem(SESSION, email);
    announce({ id: uidFor(email), name: 'Demo Visitor', email });
  },
  async signOut() {
    localStorage.removeItem(SESSION);
    announce(null);
  },
  async setDisplayName(name) {
    if (!user) return;
    const rec = await store.get('demoUsers', user.id);
    if (rec) await store.set('demoUsers', user.id, { ...rec, name });
    announce({ ...user, name });
  },
  async resetPassword() {
    throw new Error('Demo mode has no email — password reset arrives with the real backend.');
  },
  async checkResetLink() {
    throw new Error('Demo mode has no email — password reset arrives with the real backend.');
  },
  async finishReset() {
    throw new Error('Demo mode has no email — password reset arrives with the real backend.');
  },
  async applyEmailLink() {
    throw new Error('Demo mode has no email.');
  },
  async deleteAccount() {
    if (!user) return;
    await (await import('./groups.js')).eraseGroupData(user.id);
    await store.remove('progress', user.id);
    await store.remove('members', user.id);
    await store.remove('demoUsers', user.id);
    localStorage.removeItem(SESSION);
    announce(null);
  },
};

/* --------------------------------------------------------- firebase */
let fbAuth = null;
async function fba() {
  if (fbAuth) return fbAuth;
  const [{ initializeApp, getApps }, a] = await Promise.all([
    import('https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js'),
  ]);
  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  fbAuth = { auth: a.getAuth(app), a };
  return fbAuth;
}
/* A person's NAME, or nothing — never the front half of their email address.
   Kate, 18 Sep §7: "Show display name rather than email." A page with no name
   to show says "Welcome back" and asks once (My Path), rather than greeting
   someone as "kjacksonmeyer". */
const fromFb = (u) => (u ? { id: u.uid, name: (u.displayName || '').trim(), email: u.email } : null);

/* Firebase announces a new account the instant it exists — BEFORE signUp has
   saved the name to it. /join/ redirects on that first announcement, so the
   page used to leave mid-signup and the name was never stored (A36). While a
   signup is in flight its announcement is held back; signUp announces once,
   with the name, when the name is safely saved. */
let signingUp = false;

const firebase = {
  async init() {
    const { auth, a } = await fba();
    a.onAuthStateChanged(auth, async (u) => {
      if (signingUp) return;
      const next = fromFb(u);
      /* Accounts made before this fix may have their name only in members/,
         or nowhere. Recover it where it exists and write it back onto the
         profile, so this lookup happens once per person, not every visit. */
      if (next && !next.name) {
        try {
          const m = await withPatience(store.get('members', u.uid));
          if (m?.name && !/@/.test(m.name)) {
            next.name = m.name;
            a.updateProfile(u, { displayName: m.name }).catch(() => {});
          }
        } catch { /* no name to recover — My Path will ask */ }
      }
      announce(next);
    });
  },
  async signUp({ name, email, password, newsletter }) {
    const { auth, a } = await fba();
    name = (name || '').trim();
    signingUp = true;
    let cred;
    try {
      cred = await a.createUserWithEmailAndPassword(auth, norm(email), password);
      if (name) await a.updateProfile(cred.user, { displayName: name });
      await store.set('members', cred.user.uid, { name, newsletter: !!newsletter, createdAt: new Date().toISOString() });
    } finally {
      signingUp = false;
      if (cred) announce({ ...fromFb(cred.user), name });
    }
  },
  async setDisplayName(name) {
    const { auth, a } = await fba();
    if (!auth.currentUser) return;
    await a.updateProfile(auth.currentUser, { displayName: name });
    await store.set('members', auth.currentUser.uid, { name });
    announce({ ...fromFb(auth.currentUser), name });
  },
  async signIn({ email, password }) {
    const { auth, a } = await fba();
    await a.signInWithEmailAndPassword(auth, norm(email), password);
  },
  async signInGoogle() {
    const { auth, a } = await fba();
    await a.signInWithPopup(auth, new a.GoogleAuthProvider());
  },
  async signOut() {
    const { auth, a } = await fba();
    await a.signOut(auth);
  },
  /* The email's link opens /join/reset/ once the console's action URL points
     there (see that page); until then Firebase's own page opens, and its
     Continue button brings the person back here. `continueUrl` carries where
     they were headed. A host the console hasn't authorized refuses a
     continueUrl — the email still goes, just without the way back. */
  async resetPassword(email, next) {
    const { auth, a } = await fba();
    const back = new URL(`join/?${next ? `next=${encodeURIComponent(next)}&` : ''}reset=1#signin`, new URL('..', import.meta.url)).href;
    try {
      await a.sendPasswordResetEmail(auth, norm(email), { url: back });
    } catch (err) {
      if (!/unauthorized-continue-uri|invalid-continue-uri/.test(err?.code || '')) throw err;
      await a.sendPasswordResetEmail(auth, norm(email));
    }
  },
  /* The link's code → the address it resets, or a thrown expired/used error. */
  async checkResetLink(code) {
    const { auth, a } = await fba();
    return a.verifyPasswordResetCode(auth, code);
  },
  /* Set the new password, then sign straight in with it — nobody should
     type a password twice to get back to their work. */
  async finishReset(code, email, password) {
    const { auth, a } = await fba();
    await a.confirmPasswordReset(auth, code, password);
    await a.signInWithEmailAndPassword(auth, norm(email), password);
  },
  /* Firebase's other emails (confirm an address, undo an email change) land
     on the same page; each is one call. */
  async applyEmailLink(code) {
    const { auth, a } = await fba();
    await a.applyActionCode(auth, code);
  },
  async deleteAccount() {
    const { auth, a } = await fba();
    if (!auth.currentUser) return;
    /* Group data first: erasing a facilitator's group state needs their
       members record, which is removed below. */
    await (await import('./groups.js')).eraseGroupData(auth.currentUser.uid);
    await store.remove('progress', auth.currentUser.uid);
    await store.remove('members', auth.currentUser.uid);
    await a.deleteUser(auth.currentUser);
  },
};

const impl = AUTH_MODE === 'firebase' ? firebase : demo;
export const signUp = (x) => impl.signUp(x);
export const signIn = (x) => impl.signIn(x);
export const signInGoogle = () => impl.signInGoogle();
export const signOutUser = () => impl.signOut();
export const resetPassword = (e, next) => impl.resetPassword(e, next);
export const checkResetLink = (code) => impl.checkResetLink(code);
export const finishReset = (code, email, pw) => impl.finishReset(code, email, pw);
export const applyEmailLink = (code) => impl.applyEmailLink(code);

/* ONE place that turns Firebase's error codes into sentences a person can
   act on. Every account form shows authMessage(err), never err.message —
   "Firebase: Error (auth/missing-email)." is what /join/ used to say.
   '' means "say nothing" (they closed the Google window themselves). */
const AUTH_MESSAGES = {
  'auth/missing-email': 'Type your email address first.',
  'auth/invalid-email': 'That doesn’t look like an email address — check for a typo.',
  'auth/invalid-credential': 'That email and password don’t match an account here.',
  'auth/wrong-password': 'That email and password don’t match an account here.',
  'auth/user-not-found': 'That email and password don’t match an account here.',
  'auth/email-already-in-use': 'There’s already an account with that email — try signing in.',
  'auth/weak-password': 'Choose a password of at least 8 characters.',
  'auth/missing-password': 'Type a password.',
  'auth/too-many-requests': 'Too many tries in a row. Wait a few minutes, then try again.',
  'auth/network-request-failed': 'We couldn’t reach the server. Check your connection and try again.',
  'auth/popup-blocked': 'Your browser blocked the Google window. Allow pop-ups for this site, then try again.',
  'auth/popup-closed-by-user': '',
  'auth/cancelled-popup-request': '',
  'auth/user-disabled': 'This account has been switched off. Write to us through the Contact page.',
  'auth/requires-recent-login': 'For your safety, this needs a fresh sign-in. Sign out, sign back in, then try again.',
  'auth/expired-action-code': 'This reset link has expired — links last about an hour.',
  'auth/invalid-action-code': 'This reset link has already been used, or was cut short when it was copied.',
};
export const authMessage = (err) => {
  const code = err?.code || '';
  if (code in AUTH_MESSAGES) return AUTH_MESSAGES[code];
  if (code.startsWith('auth/')) return 'Something went wrong. Please try again.';
  return err?.message || String(err);
};
export const deleteAccount = () => impl.deleteAccount();
export const setDisplayName = (name) => impl.setDisplayName(String(name || '').trim());

/* "Wyatt Roy" → "Wyatt"; no name → '' (callers then say nothing, not an email). */
export const firstName = (u) => (u?.name || '').trim().split(/\s+/)[0] || '';

const ready = impl.init().catch((err) => {
  console.warn('auth backend unavailable:', err);
  if (!resolved) announce(null);
});
/* Bound the unknown state: if no answer lands (offline, blocked CDN), the
   page must still resolve to signed-out rather than wait forever. 2.5s
   matches the store's patience. */
setTimeout(() => { if (!resolved) announce(null); }, 2500);

/* Header widget — the same slot on every page. */
export function mountAuth(slot) {
  if (!slot) return;
  const root = new URL('..', import.meta.url);
  const href = (p) => new URL(p, root).pathname;
  /* A device whose last answer was signed-in gets a calm blank slot until
     the real answer, not sign-in links about to swap. A signed-out visitor
     keeps the static links untouched, immediately. */
  if (wasSignedIn()) slot.innerHTML = '';
  onAuth((u) => {
    /* Sign out lives in the header beside My Path, on every page — it used to
       exist only at the foot of My Path, which Richard could not find
       (Kate's 18 Sep email §7). One control, one place, always in view. */
    slot.innerHTML = u
      ? `<a class="btn btn--quiet" href="${href('my-path/')}">My Path${firstName(u) ? ` · ${firstName(u)}` : ''}</a>
         <button class="signout" type="button" data-signout>Sign out</button>`
      : `<a class="signin" href="${href('join/')}">Sign in</a>
         <a class="btn btn--outline" href="${href('join/')}">Create account</a>`;
  });
  /* Delegated, so it survives every re-render of the slot above. */
  slot.addEventListener('click', async (e) => {
    if (!e.target.closest('[data-signout]')) return;
    await signOutUser();
    location.href = href('');
  });
  return ready;
}

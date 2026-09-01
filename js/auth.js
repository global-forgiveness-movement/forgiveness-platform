/* One account layer, two backends — Firebase Auth when configured, a local
   demo otherwise. Every page gets the same API either way; the UI labels demo
   mode honestly wherever it appears. */

import { store, MODE } from './store.js';
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
  async resetPassword() {
    throw new Error('Demo mode has no email — password reset arrives with the real backend.');
  },
  async deleteAccount() {
    if (!user) return;
    await store.remove('progress', user.id);
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
const fromFb = (u) => (u ? { id: u.uid, name: u.displayName || u.email.split('@')[0], email: u.email } : null);

const firebase = {
  async init() {
    const { auth, a } = await fba();
    a.onAuthStateChanged(auth, (u) => announce(fromFb(u)));
  },
  async signUp({ name, email, password, newsletter }) {
    const { auth, a } = await fba();
    const cred = await a.createUserWithEmailAndPassword(auth, norm(email), password);
    await a.updateProfile(cred.user, { displayName: name });
    await store.set('members', cred.user.uid, { name, newsletter: !!newsletter, createdAt: new Date().toISOString() });
    announce(fromFb(cred.user));
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
  async resetPassword(email) {
    const { auth, a } = await fba();
    await a.sendPasswordResetEmail(auth, norm(email));
  },
  async deleteAccount() {
    const { auth, a } = await fba();
    if (!auth.currentUser) return;
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
export const resetPassword = (e) => impl.resetPassword(e);
export const deleteAccount = () => impl.deleteAccount();

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
    slot.innerHTML = u
      ? `<a class="btn btn--quiet" href="${href('my-path/')}">My Path · ${u.name.split(' ')[0]}</a>`
      : `<a class="signin" href="${href('join/')}">Sign in</a>
         <a class="btn btn--outline" href="${href('join/')}">Create account</a>`;
  });
  return ready;
}

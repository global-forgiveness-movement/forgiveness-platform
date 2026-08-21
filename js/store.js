/* One storage interface, two backends.
   - firebase: Firestore, when js/firebase-config.js holds a config.
   - demo: localStorage in this browser, when it doesn't.
   Everything above this file (forms, sync, metrics, member area) calls the
   same four functions and never knows which backend answered. */

import { firebaseConfig } from './firebase-config.js';

export const MODE = firebaseConfig ? 'firebase' : 'demo';

/* ------------------------------------------------------------- demo */
const LS = 'gfm.store.v1';
const read = () => JSON.parse(localStorage.getItem(LS) || '{}');
const write = (data) => localStorage.setItem(LS, JSON.stringify(data));

const demo = {
  async get(collection, id) {
    return read()[collection]?.[id] ?? null;
  },
  async set(collection, id, value) {
    const data = read();
    (data[collection] ??= {})[id] = value;
    write(data);
  },
  async add(collection, value) {
    const id = 'd' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    await demo.set(collection, id, value);
    return id;
  },
  async increment(collection, id, field) {
    const data = read();
    const doc = ((data[collection] ??= {})[id] ??= {});
    doc[field] = (doc[field] || 0) + 1;
    write(data);
  },
  async remove(collection, id) {
    const data = read();
    delete data[collection]?.[id];
    write(data);
  },
  async list(collection) {
    return Object.entries(read()[collection] || {}).map(([id, value]) => ({ id, ...value }));
  },
};

/* --------------------------------------------------------- firebase */
let fb = null;
async function firestore() {
  if (fb) return fb;
  const [{ initializeApp, getApps }, fs] = await Promise.all([
    import('https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js'),
  ]);
  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  fb = { db: fs.getFirestore(app), fs };
  return fb;
}

const firebase = {
  async get(collection, id) {
    const { db, fs } = await firestore();
    const snap = await fs.getDoc(fs.doc(db, collection, id));
    return snap.exists() ? snap.data() : null;
  },
  async set(collection, id, value) {
    const { db, fs } = await firestore();
    await fs.setDoc(fs.doc(db, collection, id), value, { merge: true });
  },
  async add(collection, value) {
    const { db, fs } = await firestore();
    const ref = await fs.addDoc(fs.collection(db, collection), value);
    return ref.id;
  },
  async increment(collection, id, field) {
    const { db, fs } = await firestore();
    await fs.setDoc(fs.doc(db, collection, id), { [field]: fs.increment(1) }, { merge: true });
  },
  async remove(collection, id) {
    const { db, fs } = await firestore();
    await fs.deleteDoc(fs.doc(db, collection, id));
  },
  async list(collection) {
    const { db, fs } = await firestore();
    const snap = await fs.getDocs(fs.collection(db, collection));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },
};

export const store = MODE === 'firebase' ? firebase : demo;

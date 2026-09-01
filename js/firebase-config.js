/* Firebase web config. `null` = the site runs in local demo mode: every
   account/progress/form flow works inside this browser, nothing leaves it,
   and the UI says so.

   Live since 2026-08-28: the `gfm-platform` project (Auth: email/password +
   Google; Firestore). To fall back to demo mode, set this to `null` again.
   Web config values are public identifiers, safe to commit. Server keys
   never go in this repo. */

export const firebaseConfig = {
  apiKey: 'AIzaSyDYtdQ238Vy_mB8MpPuc1WdCWxZaSRwDoQ',
  authDomain: 'gfm-platform.firebaseapp.com',
  projectId: 'gfm-platform',
  storageBucket: 'gfm-platform.firebasestorage.app',
  messagingSenderId: '48048876258',
  appId: '1:48048876258:web:a33efaa56f65d08c1bccbb',
};

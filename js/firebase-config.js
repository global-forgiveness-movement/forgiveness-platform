/* Firebase web config. `null` = the site runs in local demo mode: every
   account/progress/form flow works inside this browser, nothing leaves it,
   and the UI says so.

   To go live (Wyatt): create the Firebase project (Auth: email/password +
   Google; Firestore), then replace `null` with the web app config object —
   e.g. { apiKey: '…', authDomain: '…', projectId: '…', appId: '…' }.
   That's the entire switch; no other file changes. Web config values are
   public identifiers, safe to commit. Server keys never go in this repo. */

export const firebaseConfig = null;

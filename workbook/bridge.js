/* Platform bridge for the interactive workbook.
   Two jobs, both quiet: run the shared pre-launch gate, and — only for
   signed-in users — sync workbook POSITION (never answers; see
   ../js/progress-sync.js) on load, on leave, and periodically.
   The workbook app itself is untouched; if this module fails for any
   reason the workbook keeps working exactly as the standalone does. */

import { ensureGate } from '../js/gate.js';

ensureGate(async () => {
  try {
    const { onAuth } = await import('../js/auth.js');
    const { syncProgress, readLocalProgress } = await import('../js/progress-sync.js');

    let uid = null;
    let lastSynced = null;

    const sync = async () => {
      if (!uid) return;
      const { updatedAt } = readLocalProgress();
      if (updatedAt && updatedAt !== lastSynced) {
        await syncProgress(uid);
        lastSynced = readLocalProgress().updatedAt;
      }
    };

    onAuth((user) => {
      uid = user?.id || null;
      if (uid) syncProgress(uid).then(() => (lastSynced = readLocalProgress().updatedAt));
    });

    setInterval(sync, 20_000);
    addEventListener('pagehide', sync);
    document.addEventListener('visibilitychange', () => document.hidden && sync());
  } catch (err) {
    console.warn('progress sync unavailable:', err);
  }
});

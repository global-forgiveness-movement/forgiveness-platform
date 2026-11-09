/* Platform bridge for the interactive workbook.
   Two jobs: ask for a free account before
   the workbook opens (29 Sep call — Kate and Richard: the interactive
   workbook sits behind sign-in; the PDF never does); and sync workbook
   POSITION (never answers; see ../js/progress-sync.js) on load, on leave,
   and periodically.
   The workbook app itself is untouched; if this module fails for any
   reason the workbook keeps working exactly as the standalone does. */

/* Nothing shows until we know who is here. Signed out, the visitor goes to
   make a free account and comes straight back. This
   is a curtain, not a lock — if anything here fails, the workbook opens. */
const app = document.getElementById('app');
const reveal = () => { if (app) app.style.visibility = ''; };
if (app) app.style.visibility = 'hidden';

(async () => {
  try {
    const { onAuth } = await import('../js/auth.js');
    const { syncProgress, readLocalProgress } = await import('../js/progress-sync.js');
    const { WORKBOOK_EDITIONS, editionFrom } = await import('../js/workbook-editions.js');
    /* Which edition this is (from the address): its own place syncs, and
       sign-up sends a new person straight back to it. */
    const edition = editionFrom(location.search);
    const read = () => readLocalProgress(edition);

    let uid = null;
    let lastSynced = null;

    const sync = async () => {
      if (!uid) return;
      const { updatedAt } = read();
      if (updatedAt && updatedAt !== lastSynced) {
        await syncProgress(uid, edition);
        lastSynced = read().updatedAt;
      }
    };

    onAuth((user) => {
      if (!user) { location.replace(`../join/?next=${WORKBOOK_EDITIONS[edition].next}`); return; }
      reveal();
      uid = user?.id || null;
      if (uid) syncProgress(uid, edition).then(() => (lastSynced = read().updatedAt));
    });

    setInterval(sync, 20_000);
    addEventListener('pagehide', sync);
    document.addEventListener('visibilitychange', () => document.hidden && sync());
  } catch (err) {
    reveal();
    console.warn('progress sync unavailable:', err);
  }
})();

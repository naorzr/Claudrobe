/* ───────────────────────────────────────────────────────────────────────────
 * panel/dismiss.js
 *   Closing the panel: outside clicks and the keyboard shortcut.
 *
 * Runs in the capture phase, because the app swallows some clicks; that means
 * it fires before our own handlers, so containment is tested with
 * composedPath() rather than stopPropagation().
 * ─────────────────────────────────────────────────────────────────────────── */


  // ── Dismissal ──────────────────────────────────────────────────────────────

  /** Runs in the capture phase so it sees clicks the app would otherwise
   *  swallow — which means it fires *before* our own handlers, so
   *  stopPropagation inside the panel cannot protect it. Containment has to be
   *  tested here instead, via composedPath() because the UI is in a shadow
   *  root and event.target reports the host, not the inner element. */
  const onDocClick = e => {
    if (e && host && e.composedPath?.().includes(host)) return;
    if (open || accentOpen >= 0) { open = false; accentOpen = -1; renderUI(); }
  };
  document.addEventListener('click', onDocClick, true);
  const onEsc = e => { if (e.key === 'Escape' && (open || accentOpen >= 0)) onDocClick(); };

  // ⌥⇧T — ⌘⇧K is taken by the app's command palette.
  const onKey = e => {
    if (e.altKey && e.shiftKey && (e.code === 'KeyT' || e.key.toLowerCase() === 't')) {
      e.preventDefault(); e.stopPropagation();
      open = !open; accentOpen = -1; renderUI();
    }
    onEsc(e);
  };
  window.addEventListener('keydown', onKey, true);

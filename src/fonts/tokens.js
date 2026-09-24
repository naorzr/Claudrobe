/* ───────────────────────────────────────────────────────────────────────────
 * fonts/tokens.js — The font tokens the app resolves its families through.
 *
 * Three independent roles — the app chrome, the transcript, and code — each
 * set through its own group of custom properties, and captured so the
 * unthemed "app default" path can still put them back.
 * ─────────────────────────────────────────────────────────────────────────── */


  // The app chrome resolves its family through these; --font-ui is shared
  // with the Code tab's transcript, hence the restore described in baseCSS.
  const APP_FONT_TOKENS = ['--cds-font-sans', '--cds-font-sans-display', '--_cds-title-family',
                           '--font-ui', '--font-sans', '--font-sans-serif'];
  const TRANSCRIPT_FONT_TOKENS = ['--font-claude-response', '--font-user-message',
                                  '--_prose-font-body', '--_prose-font-heading',
                                  '--_prose-font-heading-display'];

  /** The app's own font values, read before our stylesheet exists, so the
   *  transcript can be handed back exactly what it had. */
  let fontBase = {};
  function captureFonts() {
    const cs = getComputedStyle(document.documentElement);
    const out = { family: cs.fontFamily };
    for (const n of [...APP_FONT_TOKENS, ...TRANSCRIPT_FONT_TOKENS]) {
      const v = cs.getPropertyValue(n).trim(); if (v) out[n] = v;
    }
    return out;
  }

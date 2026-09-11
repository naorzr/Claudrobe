/* ───────────────────────────────────────────────────────────────────────────
 * constants.js — Storage keys, DOM ids, and the published accent property.
 *
 * One place, so the state, CSS and UI layers cannot drift apart.
 * ─────────────────────────────────────────────────────────────────────────── */

  const STYLE_ID = 'cdt-style';
  const HOST_ID = 'cdt-host';
  const LS_THEME = 'cdt:theme';
  const LS_SESSIONS = 'cdt:sessions';
  const LS_TEXT = 'cdt:text';
  const LS_BORDER = 'cdt:borderStyle';
  const LS_WIDTH = 'cdt:borderWidth';
  const VAR = '--cdt-session-accent';

  if (window.__cdtUninstall) window.__cdtUninstall();

/* ───────────────────────────────────────────────────────────────────────────
 * apply-theme.js
 *   Switch the active theme and republish everything that depends on it.
 * ─────────────────────────────────────────────────────────────────────────── */


  function applyTheme(theme) {
    current = theme;
    localStorage.setItem(themeKey(), theme.slug);
    applyStyle();
    paintAccent();
    renderUI();
  }

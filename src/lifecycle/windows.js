/* ───────────────────────────────────────────────────────────────────────────
 * lifecycle/windows.js — Best effort for "Open in new window".
 *
 * A separate window is its own renderer that did not exist when the script
 * ran, so it cannot be reached. This only helps when the app happens to route
 * through window.open and hands back a same-origin handle: the stylesheet,
 * not the panel, is injected into the child.
 * ─────────────────────────────────────────────────────────────────────────── */


  // ── Detached windows (best effort) ─────────────────────────────────────────
  // "Open in new window" creates a separate Electron BrowserWindow with its own
  // renderer, which a console-pasted script cannot reach — it did not exist
  // when we ran. Properly fixing that needs main-process injection on
  // browser-window-created, i.e. patching the asar.
  //
  // This hook only helps in the case where the app happens to route through
  // window.open and hands back a same-origin handle. It injects the stylesheet
  // (not the panel) into the child. If the window is created over IPC instead,
  // nothing fires and nothing breaks — paste the script in that window too.

  const origOpen = window.open;
  window.open = function (...args) {
    const w = origOpen.apply(this, args);
    try {
      if (!w || !w.document) return w;
      const inject = () => { try {
        const d = w.document;
        if (!d || !d.documentElement) return;
        let s = d.getElementById(STYLE_ID);
        if (!s) { s = d.createElement('style'); s.id = STYLE_ID; }
        s.textContent = buildCSS(current, textOpts);
        d.documentElement.appendChild(s);
        const color = colorForSession(sessionId());
        if (color) { d.documentElement.style.setProperty(VAR, color);
                     d.documentElement.setAttribute('data-cdt-accent', ''); }
      } catch {} };
      inject();
      w.addEventListener?.('load', inject);
      [300, 1000, 2500].forEach(ms => setTimeout(inject, ms));
    } catch {}
    return w;
  };

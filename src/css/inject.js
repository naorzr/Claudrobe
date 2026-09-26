/* ───────────────────────────────────────────────────────────────────────────
 * css/inject.js — Write the stylesheet into the page, and the contrast floor.
 *
 * The floor repeatedly nudges a colour lighter or darker until it clears a
 * ratio against its background; it is what keeps borders and card surfaces
 * visible in dark palettes that ship barely more than 1.3:1.
 * ─────────────────────────────────────────────────────────────────────────── */


  const ensureContrast = (fg, bg, min) => {
    let c = fg, guard = 0;
    const up = lum(fg) > lum(bg);
    while (contrast(c, bg) < min && guard++ < 16) c = shade(c, up ? 0.06 : -0.06);
    return c;
  };

  function applyStyle() {
    let el = document.getElementById(STYLE_ID);
    if (!el) { el = document.createElement('style'); el.id = STYLE_ID; }
    el.textContent = buildCSS(current, textOpts);
    document.documentElement.appendChild(el);
  }

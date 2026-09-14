/* ───────────────────────────────────────────────────────────────────────────
 * color.js — Every colour conversion the theming needs.
 *
 * hex to rgb to hsl and back, sRGB luminance and contrast ratio, and the
 * clamp/lerp the ramps are built from. Pure functions; nothing here touches
 * the DOM.
 * ─────────────────────────────────────────────────────────────────────────── */


  // ── Colour maths ───────────────────────────────────────────────────────────

  const hex2rgb = h => {
    h = h.replace('#', '');
    // #rgb and #rgba both expand from the first three nibbles. Missing the
    // 4-digit case made parseInt() read past the end of the string: #fff9 came
    // out as NaN and every token written from it (the New button's glyph,
    // --cds-backdrop) was emitted as an invalid colour.
    if (h.length === 3 || h.length === 4) h = [...h.slice(0, 3)].map(c => c + c).join('');
    if (h.length === 8) h = h.slice(0, 6);
    return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
  };
  const rgb2hex = ([r, g, b]) => '#' + [r, g, b]
    .map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');

  function rgb2hsl([r, g, b]) {
    r /= 255; g /= 255; b /= 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
    if (mx === mn) return [0, 0, l];
    const d = mx - mn, s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    let h;
    if (mx === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (mx === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
    return [h * 360, s, l];
  }
  function hsl2rgb([h, s, l]) {
    h = ((h % 360) + 360) % 360 / 360;
    if (s === 0) { const v = l * 255; return [v, v, v]; }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
    const f = t => { t = (t + 1) % 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p; };
    return [f(h + 1 / 3) * 255, f(h) * 255, f(h - 1 / 3) * 255];
  }
  const hex2hsl = h => rgb2hsl(hex2rgb(h));
  const hsl2hex = a => rgb2hex(hsl2rgb(a));
  const shade = (hex, amt) => {
    const [r, g, b] = hex2rgb(hex), t = amt > 0 ? 255 : 0, k = Math.abs(amt);
    return rgb2hex([r + (t - r) * k, g + (t - g) * k, b + (t - b) * k]);
  };
  const lum = hex => {
    const [r, g, b] = hex2rgb(hex).map(v => { v /= 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contrast = (a, b) => {
    const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;

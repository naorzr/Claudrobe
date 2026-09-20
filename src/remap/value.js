/* ───────────────────────────────────────────────────────────────────────────
 * remap/value.js
 *   Apply the remap to a token value that may be a shorthand or a var().
 *
 * Rewrites every hex literal in the string, double-spacing the single alpha
 * nibble of #rgba on the way through.
 * ─────────────────────────────────────────────────────────────────────────── */


  function remapValue(value, remapHex, name) {
    const shadowy = !!name && SHADOWY.test(name);
    // --cds-bg-* in a saturated hue is a tinted surface (banners, chips),
    // never text. --cds-fill-* is the solid one and is not included.
    const tintBg = !!name && /^--cds-bg-/.test(name);
    return value.replace(/#[0-9a-fA-F]{3,8}\b/g, m => {
      const body = m.slice(1);
      // #rgba's single alpha nibble has to be doubled: pasting it onto a
      // 6-digit result produced a 7-digit hex, which is not a colour at all.
      const alpha = body.length === 8 ? body.slice(6)
                  : body.length === 4 ? body[3] + body[3] : '';
      return remapHex(m, shadowy, tintBg) + alpha;
    });
  }

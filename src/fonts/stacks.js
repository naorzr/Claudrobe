/* ───────────────────────────────────────────────────────────────────────────
 * fonts/stacks.js — Turn a chosen font key into a CSS font stack.
 * ─────────────────────────────────────────────────────────────────────────── */


  /** Resolve a picker value to a font stack. Three kinds of value: a key from
   *  the curated list, `custom:<family>` typed by the user, or `sys:<family>`
   *  chosen from a system scan. */
  function stackFor(list, key, fallbackGeneric) {
    if (!key) return '';
    if (key.startsWith('custom:') || key.startsWith('sys:')) {
      const fam = key.slice(key.indexOf(':') + 1).trim();
      return fam ? `${quoteFamily(fam)}, ${fallbackGeneric}` : '';
    }
    return (list.find(f => f[0] === key) || [])[2] || '';
  }
  const proseStackOf = o => stackFor(FONTS, o.font, 'ui-sans-serif, sans-serif');
  const transcriptStackOf = o => stackFor(FONTS, o.tfont, 'ui-sans-serif, sans-serif');
  const monoStackOf = o => stackFor(MONOS, o.mono, 'ui-monospace, monospace');

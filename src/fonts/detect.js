/* ───────────────────────────────────────────────────────────────────────────
 * fonts/detect.js — Which fonts this machine actually has.
 *
 * Every candidate family is measured against a fallback stack, so the picker
 * only offers fonts that resolve differently here. The full system list is an
 * optional async scan behind a button, because enumerating local fonts is a
 * privileged operation in the browser.
 * ─────────────────────────────────────────────────────────────────────────── */


  /** Only families actually installed are offered — listing a font the machine
   *  does not have silently selects the fallback, which looks like a bug.
   *
   *  By metrics, not by document.fonts.check(): that answers "can this string
   *  be rendered", which is true for every family name you hand it as long as
   *  *some* fallback exists, so it reported all 25 of these as present. The
   *  only reliable test is to render against each generic family and see
   *  whether the width moves. */
  const measure = (() => {
    const ctx = document.createElement('canvas').getContext('2d');
    const SAMPLE = 'mmmmmmmmmmlliWWW@%80';
    const GENERIC = ['monospace', 'sans-serif', 'serif'];
    const widths = {};
    for (const g of GENERIC) { ctx.font = `72px ${g}`; widths[g] = ctx.measureText(SAMPLE).width; }
    return family => GENERIC.some(g => {
      ctx.font = `72px "${family}", ${g}`;
      return ctx.measureText(SAMPLE).width !== widths[g];
    });
  })();

  const fontInstalled = stack => {
    const first = (stack.split(',')[0] || '').trim().replace(/^["']|["']$/g, '');
    // ui-sans-serif / ui-serif / ui-monospace are CSS generics the engine
    // always resolves (to SF Pro, New York and SF Mono on macOS). They have no
    // family to measure, and measuring them would wrongly drop them.
    if (!first || /^ui-/.test(first)
        || /^(system-ui|sans-serif|serif|monospace)$/.test(first)) return true;
    try { return measure(first); } catch { return true; }
  };
  const avail = list => list.filter(([, , stack]) => !stack || fontInstalled(stack));

  /** True if the family renders every glyph at the same advance width —
   *  used to split a full system scan into the prose and code pickers. */
  const isMono = (() => {
    const ctx = document.createElement('canvas').getContext('2d');
    return family => {
      ctx.font = `48px "${family}", serif`;
      const i = ctx.measureText('i').width, W = ctx.measureText('W').width;
      return i > 0 && Math.abs(i - W) < 0.5;
    };
  })();

  /** Every family macOS exposes, via the Local Font Access API. Needs a user
   *  gesture and a permission grant, so it is behind a button rather than run
   *  at install; the result is cached. Note this can only ever list fonts the
   *  OS exposes to applications — a family bundled inside another app (the
   *  usual reason JetBrains Mono "is installed" but nothing else can see it)
   *  is invisible to Chromium and to every other app on the machine. */
  const LS_FONTS = 'cdt:fonts';
  let scanned = null; // loaded in the state section, where readJSON exists

  async function scanSystemFonts() {
    if (!window.queryLocalFonts) throw new Error('Local Font Access API unavailable');
    const faces = await window.queryLocalFonts();
    const fams = [...new Set(faces.map(f => f.family))].sort((a, b) => a.localeCompare(b));
    scanned = fams;
    writeJSON(LS_FONTS, fams);
    return fams.length;
  }

  const quoteFamily = f => /^[\w-]+$/.test(f) ? f : `"${f.replace(/"/g, '')}"`;

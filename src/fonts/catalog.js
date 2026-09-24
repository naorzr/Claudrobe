/* ───────────────────────────────────────────────────────────────────────────
 * fonts/catalog.js
 *   The curated font stacks offered for each of the three text roles.
 * ─────────────────────────────────────────────────────────────────────────── */


  const FONTS = avail([
    ['', 'App default', ''],
    ['system', 'System UI', 'ui-sans-serif, -apple-system, system-ui, sans-serif'],
    ['inter', 'Inter', '"Inter", ui-sans-serif, sans-serif'],
    ['helvetica', 'Helvetica Neue', '"Helvetica Neue", Helvetica, sans-serif'],
    ['avenir', 'Avenir Next', '"Avenir Next", Avenir, sans-serif'],
    ['optima', 'Optima', 'Optima, Candara, sans-serif'],
    ['verdana', 'Verdana', 'Verdana, Geneva, sans-serif'],
    // macOS ships New York, but not under a name web content can request —
    // ui-serif is how you reach it.
    ['newyork', 'New York (system serif)', 'ui-serif, Georgia, serif'],
    ['georgia', 'Georgia', 'Georgia, serif'],
    ['charter', 'Charter', 'Charter, "Bitstream Charter", Georgia, serif'],
    ['iowan', 'Iowan Old Style', '"Iowan Old Style", Palatino, serif'],
    ['palatino', 'Palatino', 'Palatino, "Palatino Linotype", serif'],
    ['baskerville', 'Baskerville', 'Baskerville, Georgia, serif'],
  ]);

  const MONOS = avail([
    ['', 'App default', ''],
    ['sfmono', 'SF Mono (system)', 'ui-monospace, "SF Mono", monospace'],
    ['menlo', 'Menlo', 'Menlo, monospace'],
    ['monaco', 'Monaco', 'Monaco, monospace'],
    ['andale', 'Andale Mono', '"Andale Mono", monospace'],
    ['courier', 'Courier New', '"Courier New", Courier, monospace'],
    ['jetbrains', 'JetBrains Mono', '"JetBrains Mono", monospace'],
    ['fira', 'Fira Code', '"Fira Code", monospace'],
    ['plex', 'IBM Plex Mono', '"IBM Plex Mono", monospace'],
    ['cascadia', 'Cascadia Code', '"Cascadia Code", monospace'],
    ['hack', 'Hack', 'Hack, monospace'],
    ['source', 'Source Code Pro', '"Source Code Pro", monospace'],
    ['berkeley', 'Berkeley Mono', '"Berkeley Mono", monospace'],
  ]);

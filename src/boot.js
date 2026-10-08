/* ───────────────────────────────────────────────────────────────────────────
 * boot.js — Install: capture, apply, paint, mount.
 * ─────────────────────────────────────────────────────────────────────────── */


  // ── Go ─────────────────────────────────────────────────────────────────────

  baseline = captureBaseline();
  fontBase = captureFonts();
  applyStyle();
  paintAccent();
  mountUI();

  console.log(
    `%cclaude-theme v3%c  ${allThemes().length} themes · ${baseline.size} tokens captured · active: ${current.label}\n` +
    `⌥⇧T or the wheel next to back/forward · session colour: the dot after each pane's title · hover-expand: Panes tab · __cdtUninstall()`,
    'background:' + current.accent + ';color:#000;padding:2px 6px;border-radius:3px;font-weight:600',
    'color:inherit');

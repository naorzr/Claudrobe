/* ───────────────────────────────────────────────────────────────────────────
 * session-palette.js — The named session colours offered in the picker.
 *
 * One colour per family rather than an even sweep of a colour space: names
 * are
 * what a person picks by, and three of them reading as "green" is worse than
 * a slightly uneven ramp.
 * ─────────────────────────────────────────────────────────────────────────── */


  // ── CSS generation ─────────────────────────────────────────────────────────

  /** One colour per named family, in two rows: vivid hues, then neutrals,
   *  earth tones and tints. The earlier generated set was evenly spaced in
   *  OKLab but not in how people name colours — three greens and three
   *  teal-cyans read as duplicates on a 2px line. Each swatch here has a
   *  different name; the closest pair is still 0.114 apart in OKLab (the old
   *  set's was 0.107). Anything else comes from the full picker at the end. */
  const SESSION_COLORS = [
    ['#ff453a', 'Red'], ['#ff9f0a', 'Orange'], ['#ffd60a', 'Yellow'], ['#30d158', 'Green'],
    ['#3fd0e8', 'Cyan'], ['#0a84ff', 'Blue'], ['#bf5af2', 'Purple'], ['#ff6fb5', 'Pink'],
    ['#f5f5f5', 'White'], ['#7c7c84', 'Grey'], ['#a0612f', 'Brown'], ['#a3e635', 'Lime'],
    ['#5b5bd6', 'Indigo'], ['#0f9d8a', 'Teal'], ['#d8b4fe', 'Lavender'], ['#ffc2a8', 'Peach'],
  ];

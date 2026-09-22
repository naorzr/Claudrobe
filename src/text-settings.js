/* ───────────────────────────────────────────────────────────────────────────
 * text-settings.js — Font weights, and the labels the panel shows for them.
 * ─────────────────────────────────────────────────────────────────────────── */


  /** `default` emits no rule at all, which is the only honest "undo": the app
   *  does not use a single weight everywhere, so forcing 400 ("normal") is an
   *  override like any other, not a restoration. It is the initial selection. */
  const WEIGHTS = { default: 0, thin: 300, normal: 400, medium: 500, bold: 600 };
  const WEIGHT_LABELS = { default: 'App', thin: 'Thin', normal: 'Normal',
                          medium: 'Medium', bold: 'Bold' };

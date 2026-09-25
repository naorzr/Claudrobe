/* ───────────────────────────────────────────────────────────────────────────
 * css/helpers.js — Two small pieces the CSS builders share.
 *
 * The sidebar "lick" outline as an SVG mask, and the firstHex scan used to
 * pull a colour out of whatever shape a captured token happens to have.
 * ─────────────────────────────────────────────────────────────────────────── */


  /** Outline of the sidebar lick, as an SVG mask (viewBox 6x40, stretched to
   *  the element box).
   *
   *  Straight for the middle ~60%: the left boundary holds x=1.60 and the
   *  right x=4.02, a constant 2.4-unit bar. Over the last 20% at each end the
   *  left boundary swings right to x=3.50 while the right boundary barely
   *  moves, so the stroke narrows to a point while its centreline drifts
   *  right — the tails curl in under the row's corner radius instead of
   *  stopping square against it.
   *
   *  A first attempt bowed both boundaries outward from the midpoint, which
   *  renders as a leaf rather than a stroke. Only the tails may deviate. */
  const LICK_MASK = "url('data:image/svg+xml;utf8," +
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 40" preserveAspectRatio="none">' +
    '<path d="M3.50 1.0 C2.30 3.2 1.60 5.2 1.60 8.2 L1.60 31.8 ' +
    'C1.60 34.8 2.30 36.8 3.50 39.0 C3.95 36.9 4.02 34.6 4.02 31.8 L4.02 8.2 ' +
    'C4.02 5.4 3.95 3.1 3.50 1.0 Z" fill="%23000"/></svg>\')';

  const firstHex = v => (v.match(/#[0-9a-fA-F]{3,8}\b/) || [])[0];

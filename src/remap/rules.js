/* ───────────────────────────────────────────────────────────────────────────
 * remap/rules.js — When a colour is chrome and when it is meaning.
 *
 * Neutral greys are chrome and get remapped; saturated colours carry meaning
 * (git status, danger, diff highlights) and are mostly left alone. Also the
 * overlay-alpha lift, which only matters in dark mode, and the palette's own
 * hues used in place of the app's.
 * ─────────────────────────────────────────────────────────────────────────── */


  // ── The remap ──────────────────────────────────────────────────────────────

  const NEUTRAL_MAX_SAT = 0.18; // above this a colour is semantic, not chrome

  /** Tokens whose colours are cast *shadow*, not surface. They must be exempt
   *  from the light→dark inversion: a shadow is dark on a white page and dark
   *  on a black one. Inverting them turned --cds-shadow-sm/md/lg/popover and
   *  --cds-panel-shadow — which every panel, sidebar and popover in the app
   *  draws with — into pale halos, which is why unaccented panes glowed. */
  const SHADOWY = /(^|-)(shadow|backdrop|scrim)(-|$)/;

  /** "Foreground on a content-coloured surface" — --cds-button-on-content and
   *  friends, which the app ships as white with alpha. These sit on saturated
   *  fills (brand orange, danger red, the accent), which stay saturated in
   *  both modes, so the label on them stays white in both modes too. Running
   *  them through the ramp turns white into the page colour and the label
   *  disappears into its own button. Left untouched entirely. */
  const ON_CONTENT = /-on-(content|accent|brand|primary|danger)(-|$)/;

  /** Overlay alphas have to grow when the surface under them flips.
   *  The app builds its hover, selected and user-message fills as
   *  `hsl(from #0b0b0b h s l / 5%)` — 5% black on a near-white page. Recolour
   *  the hex and the alpha is unchanged, so on a dark page it becomes 5% of a
   *  pale colour, which is under the noise floor. Dark UIs need roughly twice
   *  the overlay alpha for the same apparent step; this is the same correction
   *  Material's elevation overlays make. */
  const ALPHA_BOOST = 2.0, ALPHA_CEIL = 34;

  /** Only the `hsl(from …)` form, and only where the source is a near-black or
   *  near-white neutral: those are the 61 chrome overlays. The `color-mix()`
   *  tokens all carry real hues (git status, editor highlights) and already
   *  have alphas chosen for visibility. */
  function boostOverlayAlpha(value) {
    return value.replace(
      /hsl\(\s*from\s+(#[0-9a-fA-F]{3,8})([^)]*?)\/\s*([\d.]+)%\s*\)/g,
      (m, hex, mid, pct) => {
        const [, s, l] = hex2hsl(hex);
        if (s > NEUTRAL_MAX_SAT || (l > 0.2 && l < 0.8)) return m;
        const next = Math.min(ALPHA_CEIL,
          Math.round(parseFloat(pct) * ALPHA_BOOST * 10) / 10);
        return `hsl(from ${hex}${mid}/ ${next}%)`;
      });
  }

  /** The palette colour standing in for a saturated app colour of hue `h`.
   *  Families, not nearest-hue: Claude's danger red must land on the
   *  palette's red even when the palette's red sits 20° away. */
  function semanticTarget(sem, h) {
    const fam = h < 15 || h >= 330 ? 'red' : h < 40 ? 'orange' : h < 70 ? 'yellow'
              : h < 165 ? 'green' : h < 195 ? 'teal' : h < 260 ? 'blue' : 'purple';
    return sem[fam] || null;
  }

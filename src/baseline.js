/* ───────────────────────────────────────────────────────────────────────────
 * baseline.js
 *   Capture the app's own colour tokens before anything is overridden.
 *
 * Every custom property that resolves to a colour is collected from the live
 * stylesheet, not just the --cds-* names — whole namespaces such as
 * --_prose-*
 * and --msg-* carry real colours. Remaps are always computed from this
 * snapshot, never from our own output.
 * ─────────────────────────────────────────────────────────────────────────── */


  // ── Baseline capture ───────────────────────────────────────────────────────
  // Snapshot the app's own token values BEFORE we override anything, so remaps
  // are always computed from the real defaults rather than from our own output.

  let baseline = null;

  /** Every custom property that resolves to a colour, not just --cds-*.
   *  Restricting to --cds- missed whole namespaces that carry real colours —
   *  --_prose-* (inline code), --_gray-*, --msg-*, --chat-*, --df-*, --color-* —
   *  which is why inline code spans and some chrome kept their light-mode
   *  values. --tw-* is Tailwind's internal plumbing and --cdt-* is ours; both
   *  are excluded. The hex test below drops anything that is not a colour. */
  const wantProp = p => typeof p === 'string' && p.startsWith('--')
    && !p.startsWith('--tw-') && !p.startsWith('--cdt-');

  function captureBaseline() {
    const names = new Set();
    const addProps = st => { if (!st) return;
      for (let i = 0; i < (st.length || 0); i++) {
        const p = st.item ? st.item(i) : st[i];
        if (wantProp(p)) names.add(p);
      } };
    const walk = rs => { for (const r of rs || []) { try {
      if (wantProp(r.name)) names.add(r.name);
      addProps(r.style);
      if (r.cssRules) walk(r.cssRules);
    } catch {} } };
    for (const s of document.styleSheets) { try { walk(s.cssRules); } catch {} }

    const cs = getComputedStyle(document.documentElement);
    const map = new Map();
    for (const n of names) {
      const v = cs.getPropertyValue(n).trim();
      if (v && /#[0-9a-fA-F]{3,8}\b/.test(v)) map.set(n, v);
    }
    return map;
  }

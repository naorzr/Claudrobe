/* ───────────────────────────────────────────────────────────────────────────
 * status.js — Mirror each pane's status light onto its title.
 *
 * The sidebar draws status as a label on an element inside the row; each pane
 * keeps its own session id, so the sidebar's status and colour can be read
 * off
 * for the pane of the same session and painted onto the title pill.
 * ─────────────────────────────────────────────────────────────────────────── */


  // ── Session status on pane titles ──
  // The sidebar draws each session's status inside
  //   <span role="status"|"img" aria-label="Running" …>
  // (labels: Awaiting input, Awaiting answer, Running, Using the browser,
  // Unread response, Done, Idle). The row component above it carries the
  // session id in its props, so each indicator is matched to a session the
  // same way panes are. The colour is read off the indicator itself, so the
  // title shows exactly what the sidebar shows, under any theme.

  const STATUS_SEL = 'span[role="status"][aria-label], span[role="img"][aria-label]';
  const statusOf = label =>
    /await|input|answer|permission/i.test(label) ? 'awaiting'
    : /running|browser|working/i.test(label) ? 'running'
    : /unread/i.test(label) ? 'ready'
    : /^done$/i.test(label) ? 'done' : null;
  const STATUS_FALLBACK = { awaiting: 'var(--cds-fill-warning, #d4a72c)', ready: 'var(--cds-fill-accent, #d97757)',
                            running: 'var(--cds-text-muted, #8d8b85)', done: 'var(--cds-text-muted, #8d8b85)' };

  /** Any string prop that is a session id, a short way up from the indicator. */
  const anySession = mp => {
    const id = propSession(mp);
    if (id || !mp || typeof mp !== 'object') return id;
    for (const v of Object.values(mp)) if (typeof v === 'string' && SID.test(v)) return v;
    return null;
  };
  const indicatorIds = new WeakMap(); // indicator -> { id, at }
  function indicatorSession(el) {
    const c = indicatorIds.get(el);
    if (c && Date.now() - c.at < 2000) return c.id;
    let id = null;
    try {
      for (let x = fiberOf(el), k = 0; x && k < 30 && !id; x = x.return, k++) id = anySession(x.memoizedProps);
    } catch {}
    if (!id) {
      const m = el.closest('a[href*="/epitaxy/"]')?.getAttribute('href')?.match(/\/epitaxy\/([^/?#]+)/);
      if (m) id = m[1];
    }
    indicatorIds.set(el, { id, at: Date.now() });
    return id;
  }
  /** The colour the indicator is drawn in. The sidebar's dots are
   *  span.status-dot[data-kind] with a background colour, except Claude's
   *  orange "working" dot (data-kind="clay"), which is an image and so has
   *  no colour to read; icons (the awaiting hand) are SVGs drawn in
   *  currentColor. Transparent and "none" are skipped. */
  const solid = v => v && v !== 'none' && !/^rgba\(.*,\s*0\)$|transparent/.test(v);
  const CLAY = '#d97757';
  function indicatorColor(el) {
    const dot = el.querySelector('.status-dot[data-kind]');
    if (dot) {
      if (dot.dataset.kind === 'clay') return CLAY;
      const bg = getComputedStyle(dot).backgroundColor;
      if (solid(bg)) return bg;
    }
    for (const n of [el, ...el.querySelectorAll('*')].slice(0, 12)) {
      const cs = getComputedStyle(n);
      if (solid(cs.backgroundColor)) return cs.backgroundColor;
      if (n instanceof SVGSVGElement) return cs.color;
      // Shapes only otherwise: an <svg> root reports the default black fill.
      if (n instanceof SVGGeometryElement) {
        if (solid(cs.fill) && !/url\(/.test(cs.fill)) return cs.fill;
        if (solid(cs.stroke) && !/url\(/.test(cs.stroke)) return cs.stroke;
      }
    }
    return null;
  }

  /** Console helper: what the title tints are reading, per pane. */
  window.__cdtStatus = () => listPanes().map(p => {
    const id = paneSessionId(p, listPanes());
    const pill = titlePill(p);
    return { id, pill: !!pill, state: pill?.getAttribute('data-cdt-status') || null,
             color: pill?.style.getPropertyValue('--cdt-st') || null };
  });

  /** The pill holding the pane's title and its dropdown chevron. */
  function titlePill(p) {
    const bar = p.querySelector('.epitaxy-titlebar');
    if (!bar) return null;
    const more = bar.querySelector('button[aria-label^="More options"]');
    return more?.parentElement || bar.querySelector('[class~="group/lead"] > span:nth-of-type(2) > div');
  }

  function paintStatus(panes) {
    const want = new Map(); // pill -> [state, colour]
    if (titleStatus && panes.length) {
      const byId = new Map();
      for (const el of document.querySelectorAll(STATUS_SEL)) {
        if (el.closest('.dframe-pane-host') || el.closest(`#${HOST_ID}`)) continue;
        const st = statusOf(el.getAttribute('aria-label') || '');
        if (!st) continue;
        const id = indicatorSession(el);
        if (id && !byId.has(id)) byId.set(id, [st, el]);
      }
      for (const p of panes) {
        const hit = byId.get(paneSessionId(p, panes));
        const pill = hit && titlePill(p);
        if (pill) want.set(pill, [hit[0], indicatorColor(hit[1]) || STATUS_FALLBACK[hit[0]]]);
      }
    }
    for (const el of document.querySelectorAll('[data-cdt-status]')) {
      if (!want.has(el)) { el.removeAttribute('data-cdt-status'); el.style.removeProperty('--cdt-st'); }
    }
    for (const [el, [st, color]] of want) {
      if (el.getAttribute('data-cdt-status') !== st) el.setAttribute('data-cdt-status', st);
      if (el.style.getPropertyValue('--cdt-st') !== color) el.style.setProperty('--cdt-st', color);
    }
  }
  const clearStatus = () => {
    for (const el of document.querySelectorAll('[data-cdt-status]')) {
      el.removeAttribute('data-cdt-status'); el.style.removeProperty('--cdt-st');
    }
  };

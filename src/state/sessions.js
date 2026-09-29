/* ───────────────────────────────────────────────────────────────────────────
 * state/sessions.js — Session ids, and the colour attached to each one.
 * ─────────────────────────────────────────────────────────────────────────── */


  const sessionId = () => {
    const m = location.pathname.match(/\/epitaxy\/([^/?#]+)/);
    return m ? m[1] : null;
  };

  /** Default is NO border. A session only gets one once explicitly assigned. */
  const colorForSession = id => (id && sessionMap[id]) || null;

  function setSessionColor(id, color) {
    if (!id) return;
    if (color) sessionMap[id] = color; else delete sessionMap[id];
    writeJSON(LS_SESSIONS, sessionMap);
    paintAccent();
  }

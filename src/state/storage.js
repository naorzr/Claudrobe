/* ───────────────────────────────────────────────────────────────────────────
 * state/storage.js — localStorage, wrapped so a bad value can never throw.
 * ─────────────────────────────────────────────────────────────────────────── */


  // ── State ──────────────────────────────────────────────────────────────────

  const readJSON = (k, f) => { try { return JSON.parse(localStorage.getItem(k)) ?? f; } catch { return f; } };
  const writeJSON = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

  const themeKey = () => `${LS_THEME}:${appMode()}`;

  // Saved custom themes, and the one unsaved draft per mode. Any edit in the
  // Customize tab turns the selection into the draft ("Custom"); saving gives
  // it a name and a permanent slug.
  const LS_CUSTOM = 'cdt:customThemes';
  const DRAFT = '__custom';
  const draftKey = () => `cdt:draft:${appMode()}`;
  let customThemes = readJSON(LS_CUSTOM, []).filter(t => t && t.slug && t.base && t.mode);
  const allThemes = () => [...THEMES, ...customThemes];
  const readDraft = () => { const d = readJSON(draftKey(), null); return d && d.base ? d : null; };
  const storedTheme = () => {
    const slug = localStorage.getItem(themeKey());
    return slug === DRAFT ? readDraft() : allThemes().find(t => t.slug === slug);
  };

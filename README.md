# Claudrobe

Colour themes and split-view extras for the Claude Desktop app (macOS).

- **Themes:** about 30 palettes (Dracula, Nord, Catppuccin, Tokyo Night, Tiki Love Dark…). Dark palettes appear in dark mode, light palettes in light mode.
- **Customize:** change any colour of a theme, then name it and save it as your own.
- **Text:** font weight, brightness, and separate fonts for the app, the transcript, and code.
- **Session colours:** give each Code session its own colour, shown as a line, a glow, or a tint around its pane.
- **Panes:**
  - **Expand on hover:** in a split, the pane under the pointer grows over the others. Click a pane to keep it large; click outside it to let go.
  - **Status on titles:** each pane's title takes the colour of its status light in the sidebar.

Everything runs inside Claude's own window. It makes no network requests, and settings are saved in the app's local storage.

**Claude.app itself is never modified**, so its signature and automatic updates keep working. The permanent install uses a hook Claude ships for loading React DevTools. That hook isn't documented, so a future Claude update could remove it. If that happens the themes simply stop loading; nothing breaks.

## What's here

| Path | What it is |
|---|---|
| `src/` | The source, split by concern. |
| `build.mjs` | Builds the two files below out of `src/`. |
| `claude-theme.js` | *Generated.* The whole thing as one script. Paste it into DevTools to try it out (option A). |
| `extension/manifest.json`, `extension/theme.js` | The same script packaged as a browser extension, which Claude loads at startup (option B). *`theme.js` is generated*: it is `claude-theme.js` wrapped so it waits for the app to finish loading first. |
| `com.claude-themes.env.plist` | A login item that tells Claude to load that extension (option B). |

All of it is plain text. Read it before you run it.

## How the source is laid out

The files under `src/` are fragments of a single IIFE and share its scope, so they are concatenated in a fixed order rather than imported. The order is load-bearing — palettes before the remap, state before the UI, boot last:

| | |
|---|---|
| Foundations | `constants`, `palettes/*`, `color`, `baseline` |
| The remap | `remap/rules`, `remap/curve`, `remap/value` |
| Type | `session-palette`, `text-settings`, `fonts/*` |
| Stylesheet | `css/helpers`, `css/build`, `css/base`, `css/inject` |
| Saved state | `state/storage`, `state/settings`, `state/sessions` |
| The app's surface | `panes`, `status`, `expand`, `rows`, `apply-theme` |
| The panel | `panel/overlay`, `panel/customize`, `panel/render`, `panel/wire`, `panel/dismiss` |
| Staying installed | `lifecycle/observers`, `lifecycle/windows`, `lifecycle/teardown`, `boot` |

## Building

```bash
node build.mjs
```

Writes `claude-theme.js` and `extension/theme.js`, in that order. Nothing to install; Node only.

The generated files are committed, so a clone works as-is. They are still outputs — edit `src/`, then rebuild.

---

## Option A: try it now (lasts until Claude restarts)

1. **Turn on developer mode** (one time): in Claude's menu bar, choose **Help → Troubleshooting → Enable Developer Mode…** and confirm.
2. **Open DevTools:** press **⌘⌥I**. You can also use **Show Dev Tools** in the menu that developer mode adds.
   - The console has to belong to the claude.ai page. If the page shown is a `file://` page, use **Show All Dev Tools** instead and pick the window whose URL starts with `https://claude.ai`.
3. **Run the script:** click the **Console** tab, paste the full contents of `claude-theme.js`, and press Return.
   - The first time, Chrome blocks pasting. Type `allow pasting`, press Return, then paste again.

A small colour wheel appears next to the back/forward buttons at the top of the sidebar. Click it to open the menu. **⌥⇧T** also opens it.

To remove it, run `__cdtUninstall()` in the same console, or restart Claude.

## Option B: install permanently

These steps run in **Terminal**. Each command block is one command; run them in order.

**1. Quit Claude** (⌘Q).

**2. Check that your Claude version has the hook.** This should print `supported`:

```bash
grep -aq loadReactDevTools /Applications/Claude.app/Contents/Resources/app.asar && echo supported || echo "not supported"
```

If it prints `not supported`, stop here: this Claude version can't load the themes permanently, but option A still works.

**3. Go to this folder** in Terminal. Type `cd `, with a trailing space, drag the `claude-themes` folder onto the Terminal window, and press Return. Or, if the folder is in Downloads:

```bash
cd ~/Downloads/claude-themes
```

**4. Copy the extension into Claude's data folder.** The folder name below is the one Claude looks in; it must match exactly.

```bash
mkdir -p ~/Library/Application\ Support/Claude/extensions/fmkadmapgofadopljbjfkapdkoienihi
```

```bash
cp extension/manifest.json extension/theme.js ~/Library/Application\ Support/Claude/extensions/fmkadmapgofadopljbjfkapdkoienihi/
```

> If that folder already contained something before step 4 (for example the real React DevTools), move it somewhere else first. This extension takes its place.

**5. Install the login item**, so Claude loads the extension every time it starts, however you open it:

```bash
cp com.claude-themes.env.plist ~/Library/LaunchAgents/
```

```bash
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.claude-themes.env.plist
```

**6. Open Claude** as usual. The colour wheel appears next to the back/forward buttons.

> macOS may show a notification that a background item was added. That's the login item from step 5.

### Updating

Quit Claude, copy the new `extension/manifest.json` and `extension/theme.js` over the old ones (step 4's `cp` command), then reopen Claude. Your saved themes and settings are kept.

### Uninstalling

Quit Claude, then run each of these:

```bash
launchctl bootout gui/$(id -u)/com.claude-themes.env
```

```bash
rm ~/Library/LaunchAgents/com.claude-themes.env.plist
```

```bash
launchctl unsetenv REACT_PROFILE
```

```bash
rm -r ~/Library/Application\ Support/Claude/extensions/fmkadmapgofadopljbjfkapdkoienihi
```

Reopen Claude. It's back to normal.

---

## How option B works

Claude Desktop contains a developer hook: when the environment variable `REACT_PROFILE` is `1`, it loads the browser extension found in `~/Library/Application Support/Claude/extensions/fmkadmapgofadopljbjfkapdkoienihi` at startup. That folder is meant for React DevTools.

Step 4 puts this extension there. Step 5 sets the variable at every login, and only while the extension is present. If the folder is ever deleted, the login item clears the variable, so Claude doesn't try to download React DevTools instead.

The extension is one script that runs in the claude.ai page, the same as pasting it into the console.

## Troubleshooting

- **No colour wheel after a permanent install:**
  - Quit Claude fully (⌘Q, not just closing the window) and reopen it.
  - Check that `launchctl getenv REACT_PROFILE` prints `1`. If it doesn't, rerun step 5's `launchctl bootstrap` command.
- **It stopped working after a Claude update:** rerun step 2. If it prints `not supported`, the update removed the hook.
- **Something looks wrong:** open the menu, choose **Claude (app default)** in the Theme tab, and press **Reset text to app defaults** in the Text tab.

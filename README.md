# Claudrobe

Colour themes and split-view extras for Claude Desktop on macOS.

- **Themes:** about 30 dark and light palettes, including Dracula, Nord, Catppuccin, Tokyo Night and Tiki Love Dark.
- **Customize:** edit colours, name a palette and save it as your own.
- **Text:** font weight, brightness, and separate fonts for the app, transcript and code.
- **Session colours:** give each Code session its own line, glow or tint.
- **Panes:** expand on hover, click to keep a pane expanded, and mirror sidebar status lights on pane titles.

## Install

Clone the repository and enter it:

```bash
git clone https://github.com/smansou/Claudrobe.git
cd Claudrobe
```

Then install with one command:

```bash
bash install.sh
```

Alternatively, download **Code → Download ZIP** on GitHub, extract it, and run `bash install.sh` from the extracted folder. Git is not required for the ZIP route.

The installer uses the files in your local checkout—not the latest remote version. It checks your Claude version, installs the extension and its login item, then opens Claude. If Claude is running, it quits gracefully first; it never force-quits. No developer mode, DevTools, Node, `sudo`, or manual copying required.

Look for the colour wheel beside the sidebar's back/forward buttons. **⌥⇧T** also opens the panel. macOS may notify you that a background item was added.

**Update:** run `git pull --ff-only` in your clone, then `bash install.sh` again. For a ZIP installation, download and extract the latest source, then rerun the installer. Saved themes and settings are kept.

Read [install.sh](install.sh) before running it if you want to inspect its actions. Installation and uninstallation make no network requests and include no telemetry. The theme itself makes no network requests.

## Uninstall

From your checkout or extracted folder:

```bash
bash uninstall.sh
```

If you deleted the source folder, a copy of the uninstaller is saved during installation:

```bash
bash "$HOME/Library/Application Support/Claudrobe/uninstall.sh"
```

Neither command needs an internet connection. It removes the extension and login item, clears `REACT_PROFILE`, and reopens Claude if it was running. Saved themes and settings are kept for a future reinstall.

## How it works

**Claude.app itself is never modified**, so its signature and automatic updates keep working. Claude Desktop contains an undocumented React DevTools hook: when `REACT_PROFILE=1`, it loads the extension at `~/Library/Application Support/Claude/extensions/fmkadmapgofadopljbjfkapdkoienihi`.

Claudrobe uses that slot to load its script in the claude.ai view. The login item sets the variable at every login, and clears it if the extension is missing. Settings live in Claude's local storage.

The installer will not overwrite another extension in this slot, such as React DevTools. It can update an existing Claude Themes installation, including one installed with the old manual instructions. A future Claude update could remove the hook; the installer detects whether it is present before changing any files.

## Troubleshooting

- **Unsupported Claude version:** this version lacks the extension-loading hook. The installer stops without changing anything.
- **Another extension occupies the slot:** move that extension elsewhere before installing. Claudrobe leaves it untouched.
- **Claude will not quit:** save your work, quit Claude normally, then rerun the command.
- **No colour wheel:** fully quit Claude (⌘Q), then rerun the install command. If a Claude update removed the hook, the installer will report it.
- **Something looks wrong:** select **Claude (app default)** in the Theme tab and **Reset text to app defaults** in the Text tab.

## Development

The source under `src/` consists of 36 ordered fragments of one IIFE. They share its scope and are concatenated rather than imported. Keep the order in `build.mjs` intact; boot runs last.

| Group | Source |
|---|---|
| Foundations | `constants`, `palettes/*`, `color`, `baseline` |
| Remap | `remap/rules`, `remap/curve`, `remap/value` |
| Type | `session-palette`, `text-settings`, `fonts/*` |
| Stylesheet | `css/helpers`, `css/build`, `css/base`, `css/inject` |
| Saved state | `state/storage`, `state/settings`, `state/sessions` |
| App surface | `panes`, `status`, `expand`, `rows`, `apply-theme` |
| Panel | `panel/overlay`, `panel/customize`, `panel/render`, `panel/wire`, `panel/dismiss` |
| Lifecycle | `lifecycle/observers`, `lifecycle/windows`, `lifecycle/teardown`, `boot` |

Rebuild with Node:

```bash
node build.mjs
```

This writes `claude-theme.js` and `extension/theme.js`. Both generated files are committed so installation needs no build tools. Edit `src/`, not those outputs. `install.sh` and `uninstall.sh` manage the macOS installation; `com.claude-themes.env.plist` defines the login item.

Run the installer tests with Python 3:

```bash
python3 tests/test_install.py
```

These tests simulate macOS commands and isolated home directories. A real macOS/Claude Desktop smoke test is still needed to verify the OS integration.

Palettes adapted from [cctheme](https://github.com/Burzu8/cctheme) (MIT).

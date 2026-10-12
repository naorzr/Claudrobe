#!/bin/bash
set -euo pipefail

fail() { printf 'Claudrobe: %s\n' "$*" >&2; exit 1; }
[ "$(uname -s)" = Darwin ] || fail 'This uninstaller requires macOS.'
[ "$(id -u)" != 0 ] || fail 'Run this as your normal user, without sudo.'

STATE="$HOME/Library/Application Support/Claudrobe"
EXT="$HOME/Library/Application Support/Claude/extensions/fmkadmapgofadopljbjfkapdkoienihi"
PLIST="$HOME/Library/LaunchAgents/com.claude-themes.env.plist"
DOMAIN="gui/$(id -u)"
[ ! -L "$EXT" ] && [ ! -L "$STATE" ] && [ ! -L "$PLIST" ] || fail 'An installation path is a symlink; refusing to remove it.'

if [ ! -f "$STATE/installed" ]; then
  printf 'Claudrobe is not installed by this installer. No changes made.\n'
  exit 0
fi
if [ -e "$EXT" ]; then
  NAME="$(plutil -extract name raw -o - "$EXT/manifest.json" 2>/dev/null || true)"
  [ "$NAME" = 'Claude Themes' ] || fail 'The extension slot now belongs to something else. No changes made.'
fi
if [ -f "$PLIST" ]; then
  grep -q REACT_PROFILE "$PLIST" && grep -q fmkadmapgofadopljbjfkapdkoienihi "$PLIST" || fail 'The login item now belongs to something else. No changes made.'
fi

RUNNING=0
if pgrep -x Claude >/dev/null; then
  RUNNING=1
  printf 'Quitting Claude gracefully. Save any work if Claude asks.\n'
  osascript -e 'tell application "Claude" to quit' >/dev/null
  for ((i=0; i<30; i++)); do
    pgrep -x Claude >/dev/null || break
    sleep 1
  done
  if pgrep -x Claude >/dev/null; then fail 'Claude is still running. Quit it and rerun this command.'; fi
fi

launchctl bootout "$DOMAIN/com.claude-themes.env" >/dev/null 2>&1 || true
launchctl unsetenv REACT_PROFILE
rm -f "$PLIST" "$EXT/manifest.json" "$EXT/theme.js"
if [ -d "$EXT" ]; then rmdir "$EXT" 2>/dev/null || true; fi
rm -f "$STATE/installed" "$STATE/uninstall.sh"
rmdir "$STATE" 2>/dev/null || true
if [ "$RUNNING" = 1 ]; then open -a Claude; fi
printf '\nClaudrobe uninstalled. Your saved themes and settings are kept.\n'

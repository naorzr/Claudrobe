import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
STUB = '''#!/usr/bin/env python3
import json, os, pathlib, shutil, sys
name = pathlib.Path(sys.argv[0]).name
args = sys.argv[1:]
if name == 'uname': print('Darwin')
elif name == 'id': print('501')
elif name == 'pgrep': sys.exit(1)
elif name == 'curl':
    url = next(a for a in args if a.startswith('https://'))
    relative = url.split('/main/', 1)[1]
    shutil.copyfile(pathlib.Path(os.environ['SOURCE']) / relative, args[args.index('-o') + 1])
elif name == 'plutil' and '-extract' in args:
    print(json.loads(pathlib.Path(args[-1]).read_text())['name'])
elif name == 'launchctl':
    with open(os.environ['CALLS'], 'a') as f: f.write(' '.join(args) + '\\n')
'''


class InstallerTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.home = Path(self.temp.name) / 'home'
        self.home.mkdir()
        self.bin = Path(self.temp.name) / 'bin'
        self.bin.mkdir()
        stub = self.bin / 'stub'
        stub.write_text(STUB)
        stub.chmod(0o755)
        for name in ('uname', 'id', 'pgrep', 'curl', 'plutil', 'launchctl', 'open', 'osascript'):
            (self.bin / name).symlink_to(stub)
        self.env = dict(os.environ, HOME=str(self.home), SOURCE=str(ROOT),
                        CALLS=str(Path(self.temp.name) / 'calls'),
                        PATH=str(self.bin) + ':' + os.environ['PATH'])
        self.asar = self.home / 'Applications/Claude.app/Contents/Resources/app.asar'
        self.asar.parent.mkdir(parents=True)
        self.asar.write_text('loadReactDevTools')
        self.ext = self.home / 'Library/Application Support/Claude/extensions/fmkadmapgofadopljbjfkapdkoienihi'
        self.state = self.home / 'Library/Application Support/Claudrobe'
        self.plist = self.home / 'Library/LaunchAgents/com.claude-themes.env.plist'

    def run_script(self, name, success=True):
        result = subprocess.run(['bash', str(ROOT / name)], env=self.env,
                                text=True, capture_output=True)
        self.assertEqual(result.returncode == 0, success, result.stdout + result.stderr)
        return result

    def test_install_update_uninstall(self):
        self.run_script('install.sh')
        self.assertEqual((self.ext / 'theme.js').read_bytes(), (ROOT / 'extension/theme.js').read_bytes())
        self.assertTrue(self.plist.exists())
        self.assertTrue((self.state / 'uninstall.sh').exists())
        self.run_script('install.sh')
        self.run_script('uninstall.sh')
        self.assertFalse(self.ext.exists())
        self.assertFalse(self.plist.exists())
        self.assertFalse(self.state.exists())
        self.run_script('uninstall.sh')

    def test_unsupported_version(self):
        self.asar.write_text('no hook')
        self.run_script('install.sh', False)
        self.assertFalse(self.ext.exists())

    def test_preserve_other_extension(self):
        self.ext.mkdir(parents=True)
        manifest = self.ext / 'manifest.json'
        manifest.write_text(json.dumps({'name': 'React Developer Tools'}))
        self.run_script('install.sh', False)
        self.assertEqual(json.loads(manifest.read_text())['name'], 'React Developer Tools')
        self.assertFalse(self.state.exists())

    def test_migrate_manual_install(self):
        self.ext.mkdir(parents=True)
        (self.ext / 'manifest.json').write_text(json.dumps({'name': 'Claude Themes'}))
        self.run_script('install.sh')
        self.assertTrue((self.state / 'installed').exists())
        self.run_script('uninstall.sh')

    def test_replaced_extension_is_not_deleted(self):
        self.run_script('install.sh')
        (self.ext / 'manifest.json').write_text(json.dumps({'name': 'Other'}))
        self.run_script('uninstall.sh', False)
        self.assertTrue(self.plist.exists())
        self.assertTrue((self.ext / 'manifest.json').exists())

    def test_symlink_refused(self):
        self.ext.parent.mkdir(parents=True)
        self.ext.symlink_to(self.home)
        self.run_script('install.sh', False)
        self.assertFalse(self.state.exists())


if __name__ == '__main__':
    unittest.main()

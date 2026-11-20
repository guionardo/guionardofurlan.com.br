import importlib.util
from pathlib import Path
import tempfile
import unittest

SPEC = importlib.util.spec_from_file_location("release_posts", Path(__file__).resolve().parents[1] / "scripts/release_posts.py")
module = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(module)

RELEASE = {"id": 42, "tag_name": "v1.2.0", "published_at": "2026-10-13T10:00:00Z",
           "html_url": "https://github.com/example/project/releases/tag/v1.2.0", "draft": False, "prerelease": False}

class ReleasePostTests(unittest.TestCase):
    def test_three_drafts_share_key(self):
        keys = []
        for lang in ("pt", "en", "es"):
            key, body = module.render("example/project", RELEASE, lang)
            keys.append(key)
            self.assertIn('draft: true', body)
            self.assertIn(f'lang: "{lang}"', body)
            self.assertIn(RELEASE["html_url"], body)
        self.assertEqual(len(set(keys)), 1)

    def test_disabled_repository_does_not_fetch(self):
        with tempfile.TemporaryDirectory() as directory:
            result = module.generate({"repositories": [{"name": "example/project", "enabled": False}]}, Path(directory))
            self.assertEqual(result, [])

if __name__ == "__main__":
    unittest.main()

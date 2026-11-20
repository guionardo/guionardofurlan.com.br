# Release posts MVP

The scheduled or manual workflow checks explicitly enabled public repositories
in `config/release-sources.json`. Entries default to disabled. Enable only
repositories you have approved for publication.

The generator reads published GitHub releases, excluding prereleases by default.
It creates three localized Markdown announcements with the same translationKey.
All generated posts are drafts. It does not translate arbitrary release notes,
invent claims, merge PRs, or deploy the site.

To test locally:

```sh
python3 -m unittest discover -s tests -p 'test_release_posts.py'
python3 scripts/release_posts.py
npm ci && npm run build
```

To enable PR creation using GITHUB_TOKEN, set GitHub repository Actions settings
to allow GitHub Actions to create pull requests. Workflow permissions are scoped
to contents and pull requests write. Review the generated PR, verify facts and
translations, and change all three drafts to false only when publication is approved.

Limitations: scans the 30 most recent releases per repository, does not update
already generated posts, and relies on repository + GitHub release ID for identity.
Existing draft articles do not appear on the public site.

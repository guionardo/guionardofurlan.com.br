#!/usr/bin/env python3
"""Generate review-only, multilingual release announcements from allowlisted GitHub releases."""
import argparse
import datetime as dt
import json
import os
from pathlib import Path
import re
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
LANG = {
    "pt": ("Nova versão de {repo}: {tag}", "A versão {tag} de {repo} foi publicada.", "Detalhes da versão", "Consulte as notas oficiais da versão no GitHub.", "versão", "lançamento"),
    "en": ("New {repo} release: {tag}", "{repo} version {tag} has been released.", "Release details", "Read the official release notes on GitHub.", "release", "software"),
    "es": ("Nueva versión de {repo}: {tag}", "Se publicó la versión {tag} de {repo}.", "Detalles de la versión", "Consulta las notas oficiales de la versión en GitHub.", "versión", "lanzamiento"),
}

def safe(value):
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")

def fetch_releases(repository, token=None):
    request = urllib.request.Request(
        f"https://api.github.com/repos/{repository}/releases?per_page=30",
        headers={"Accept": "application/vnd.github+json", "User-Agent": "release-posts-mvp",
                 **({"Authorization": f"Bearer {token}"} if token else {})},
    )
    with urllib.request.urlopen(request, timeout=20) as response:
        return json.load(response)

def render(repository, release, language):
    tag = release["tag_name"]
    repo = repository.split("/")[-1]
    title, description, heading, detail, *tags = LANG[language]
    date = release["published_at"][:10]
    key = f"release-{safe(repository)}-{release['id']}"
    slug = safe(f"{repo}-{tag}-{language}")
    url = release["html_url"]
    metadata = {
        "title": title.format(repo=repo, tag=tag),
        "description": description.format(repo=repo, tag=tag),
        "date": date, "slug": slug, "tags": tags, "draft": True,
        "lang": language, "translationKey": key,
    }
    # JSON string literals are valid YAML scalar syntax; avoid external YAML dependencies.
    lines = ["---"]
    for name, value in metadata.items():
        lines.append(f"{name}: {json.dumps(value, ensure_ascii=False)}")
    lines.extend(["---", "", f"## {heading}", "", detail, "",
                  f"[GitHub — {repository} {tag}]({url})", ""])
    return key, "\n".join(lines)

def generate(config, output, token=None, include_prereleases=False):
    written = []
    for entry in config["repositories"]:
        if not entry.get("enabled", False):
            continue
        repository = entry["name"]
        if not re.fullmatch(r"[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+", repository):
            raise ValueError(f"Invalid repository: {repository}")
        for release in fetch_releases(repository, token):
            if release.get("draft") or (release.get("prerelease") and not include_prereleases):
                continue
            if not release.get("published_at") or not release.get("html_url"):
                continue
            for language in LANG:
                key, body = render(repository, release, language)
                destination = output / f"{key}.{language}.md"
                if destination.exists():
                    continue
                destination.parent.mkdir(parents=True, exist_ok=True)
                destination.write_text(body, encoding="utf-8")
                written.append(str(destination))
    return written

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", type=Path, default=ROOT / "config/release-sources.json")
    parser.add_argument("--output", type=Path, default=ROOT / "src/content/blog")
    parser.add_argument("--include-prereleases", action="store_true")
    args = parser.parse_args()
    config = json.loads(args.config.read_text(encoding="utf-8"))
    for filename in generate(config, args.output, os.getenv("GITHUB_TOKEN"), args.include_prereleases):
        print(filename)

if __name__ == "__main__":
    main()

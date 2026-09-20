#!/usr/bin/env python3
"""Import the K3s article series into this Astro site's content collection.

Publication metadata is owned by docs/articles/catalog.json in the source
repository. The importer therefore does not need code changes when the series
grows: add the three source articles and one catalog entry.
"""

from __future__ import annotations

import argparse
import json
import re
from datetime import date
from pathlib import Path

LANGS = ("pt", "en", "es")


def yaml_quote(value: str) -> str:
    return "'" + value.replace("'", "''") + "'"


def load_catalog(source_root: Path) -> dict:
    path = source_root / "docs/articles/catalog.json"
    try:
        catalog = json.loads(path.read_text(encoding="utf-8"))
        entries = catalog["articles"]
        if not entries:
            raise ValueError("catalog has no articles")
        orders = [int(entry["order"]) for entry in entries]
        if len(set(orders)) != len(orders):
            raise ValueError("duplicate article order")
        keys = [entry["translationKey"] for entry in entries]
        if len(set(keys)) != len(keys):
            raise ValueError("duplicate translationKey")
        for entry in entries:
            for field in ("sources", "siteFiles", "slugs", "descriptions", "tags"):
                if set(entry[field]) != set(LANGS):
                    raise ValueError(f"article {entry['order']} field {field} must contain pt/en/es")
        return catalog
    except (OSError, ValueError, KeyError, TypeError, json.JSONDecodeError) as exc:
        raise SystemExit(f"invalid publication catalog {path}: {exc}") from exc


def read_source(source_root: Path, relative: str) -> tuple[str, str]:
    path = source_root / "docs/articles" / relative
    try:
        text = path.read_text(encoding="utf-8")
    except OSError as exc:
        raise SystemExit(f"missing source article: {path}") from exc
    heading = re.match(r"^#\s+(.+?)\n+", text)
    if not heading:
        raise SystemExit(f"missing H1 in source article: {path}")
    return heading.group(1).strip(), text[heading.end():]


def existing_date(text: str | None, fallback: str) -> str:
    if text:
        match = re.search(r"(?m)^date:\s*(\d{4}-\d{2}-\d{2})\s*$", text)
        if match:
            return match.group(1)
    return fallback


def render(entry: dict, lang: str, title: str, body: str, publish_date: str, series_key: str) -> str:
    tags = ", ".join(entry["tags"][lang])
    return f"""---
title: {yaml_quote(title)}
description: {yaml_quote(entry["descriptions"][lang])}
date: {publish_date}
slug: {entry["slugs"][lang]}
tags: [{tags}]
draft: false
lang: {lang}
translationKey: {entry["translationKey"]}
seriesKey: {series_key}
seriesOrder: {entry["order"]}
---

{body}"""


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, required=True, help="local checkout of guiosoft-k3s-lab")
    parser.add_argument("--output", type=Path, default=Path("src/content/blog"))
    parser.add_argument("--date", default=date.today().isoformat(), help="publication date for newly created files")
    parser.add_argument("--check", action="store_true", help="report drift without writing")
    args = parser.parse_args()

    source_root = args.source.resolve()
    catalog = load_catalog(source_root)
    args.output.mkdir(parents=True, exist_ok=True)
    changed: list[Path] = []

    for entry in sorted(catalog["articles"], key=lambda item: int(item["order"])):
        for lang in LANGS:
            title, body = read_source(source_root, entry["sources"][lang])
            target = args.output / entry["siteFiles"][lang]
            existing = target.read_text(encoding="utf-8") if target.exists() else None
            wanted = render(
                entry,
                lang,
                title,
                body,
                existing_date(existing, args.date),
                catalog["seriesKey"],
            )
            if existing != wanted:
                changed.append(target)
                if not args.check:
                    target.write_text(wanted, encoding="utf-8")

    if changed:
        print(("DRIFT" if args.check else "UPDATED") + f": {len(changed)} article(s)")
        for path in changed:
            print(f" - {path}")
        return 1 if args.check else 0

    expected = len(catalog["articles"]) * len(LANGS)
    print(f"PASS: {expected} source articles match Astro content")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

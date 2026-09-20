#!/usr/bin/env python3
"""Import the K3s article series into this Astro site's content collection.

The source repository is expected to be available as a local checkout. This
script never publishes or pushes; it only writes Markdown files under
src/content/blog after validating the complete PT/EN/ES source set.
"""

from __future__ import annotations

import argparse
import re
from dataclasses import dataclass
from datetime import date
from pathlib import Path

LANGS = ("pt", "en", "es")
SOURCE_DIRS = {"pt": Path("docs/articles"), "en": Path("docs/articles/en"), "es": Path("docs/articles/es")}
SOURCE_GLOBS = {"pt": "[0-9][0-9]-*.md", "en": "[0-9][0-9]-*.md", "es": "[0-9][0-9]-*.md"}
SERIES_KEY = "homelab-k3s"

META = {
    1: {
        "translationKey": "homelab-k3s",
        "files": {"pt": "k3s-homelab.pt.md", "en": "k3s-homelab.en.md", "es": "k3s-homelab.es.md"},
        "slugs": {"pt": "k3s-homelab", "en": "k3s-homelab-debian-server", "es": "k3s-homelab-servidor-debian"},
        "descriptions": {
            "pt": "Como um servidor Debian virou um cluster K3s single-node com Traefik, Cloudflare Tunnel, storage e firewall — sem migração big bang.",
            "en": "How a Debian server became a single-node K3s cluster with Traefik, Cloudflare Tunnel, storage, and firewall — without a big-bang migration.",
            "es": "Cómo un servidor Debian se convirtió en un clúster K3s de un solo nodo con Traefik, Cloudflare Tunnel, almacenamiento y firewall — sin una migración tipo big bang.",
        },
        "tags": {"pt": ["kubernetes", "homelab", "infraestrutura"], "en": ["kubernetes", "homelab", "infrastructure"], "es": ["kubernetes", "homelab", "infraestructura"]},
    },
    2: {
        "translationKey": "homelab-observability",
        "files": {"pt": "observability.pt.md", "en": "observability.en.md", "es": "observability.es.md"},
        "slugs": {"pt": "observabilidade", "en": "observability", "es": "observabilidad"},
        "descriptions": {
            "pt": "Métricas, logs e traces em um cluster single-node: a stack Prometheus/Loki/Tempo, correlação por trace_id e o custo real da observabilidade.",
            "en": "Metrics, logs, and traces on a single-node cluster: the Prometheus/Loki/Tempo stack, trace_id correlation, and the real cost of observability.",
            "es": "Métricas, registros y trazas en un clúster de un solo nodo: la pila Prometheus/Loki/Tempo, la correlación por trace_id y el costo real de la observabilidad.",
        },
        "tags": {"pt": ["kubernetes", "homelab", "observabilidade"], "en": ["kubernetes", "homelab", "observability"], "es": ["kubernetes", "homelab", "observabilidad"]},
    },
    3: {
        "translationKey": "homelab-gitops",
        "files": {"pt": "gitops-secrets-iac.pt.md", "en": "gitops-secrets-iac.en.md", "es": "gitops-secrets-iac.es.md"},
        "slugs": {"pt": "gitops-secrets-iac", "en": "gitops-secrets-infrastructure", "es": "gitops-secrets-infraestructura"},
        "descriptions": {
            "pt": "GitOps com Flux, secrets com SOPS + age e infraestrutura reproduzível: como o repositório passou a ser dono de cada estado do cluster.",
            "en": "GitOps with Flux, secrets with SOPS + age, and reproducible infrastructure: how the repository became the owner of each piece of cluster state.",
            "es": "GitOps con Flux, secrets con SOPS + age e infraestructura reproducible: cómo el repositorio pasó a ser dueño de cada estado del clúster.",
        },
        "tags": {lang: ["kubernetes", "homelab", "gitops"] for lang in LANGS},
    },
    4: {
        "translationKey": "homelab-backup-dr",
        "files": {"pt": "backup-nao-e-dr.pt.md", "en": "backup-is-not-dr.en.md", "es": "backup-no-es-dr.es.md"},
        "slugs": {"pt": "backup-nao-e-dr", "en": "backup-is-not-dr", "es": "backup-no-es-dr"},
        "descriptions": {
            "pt": "Backup existente não é Disaster Recovery: o que restores reais revelaram sobre control plane, PersistentVolumes, imagens OCI e recuperação offline.",
            "en": "Having backups is not the same as having Disaster Recovery: what real restores revealed about the control plane, PersistentVolumes, OCI images, and offline recovery.",
            "es": "Tener backups no equivale a tener Disaster Recovery: lo que restores reales revelaron sobre control plane, PersistentVolumes, imágenes OCI y recovery offline.",
        },
        "tags": {lang: ["kubernetes", "homelab", "disaster-recovery"] for lang in LANGS},
    },
    5: {
        "translationKey": "homelab-measuring-dr",
        "files": {"pt": "medindo-disaster-recovery.pt.md", "en": "measuring-disaster-recovery.en.md", "es": "midiendo-disaster-recovery.es.md"},
        "slugs": {"pt": "medindo-disaster-recovery", "en": "measuring-disaster-recovery", "es": "midiendo-disaster-recovery"},
        "descriptions": {
            "pt": "Como rehearsals mensuráveis e automação determinística reduziram o RTO observado do meu cluster K3s de 1h07m09s para 47m03s.",
            "en": "How measurable rehearsals and deterministic automation reduced the observed RTO of my K3s cluster from 1h07m09s to 47m03s.",
            "es": "Cómo rehearsals medibles y automatización determinista redujeron el RTO observado de mi clúster K3s de 1h07m09s a 47m03s.",
        },
        "tags": {lang: ["kubernetes", "homelab", "disaster-recovery"] for lang in LANGS},
    },
    6: {
        "translationKey": "homelab-consistent-backups",
        "files": {"pt": "backups-consistentes.pt.md", "en": "consistent-backups.en.md", "es": "backups-consistentes.es.md"},
        "slugs": {"pt": "backups-consistentes", "en": "consistent-backups", "es": "backups-consistentes"},
        "descriptions": {
            "pt": "Como transformei backups independentes de control plane e PVs em recovery sets com identidade exata e uma janela de consistência medida em 64 segundos.",
            "en": "How independent control-plane and PV backups became recovery sets with exact identity and a measured 64-second consistency window.",
            "es": "Cómo backups independientes de control plane y PVs se convirtieron en recovery sets con identidad exacta y una ventana de consistencia medida en 64 segundos.",
        },
        "tags": {lang: ["kubernetes", "homelab", "backup", "disaster-recovery"] for lang in LANGS},
    },
}


@dataclass(frozen=True)
class Article:
    order: int
    lang: str
    source: Path
    title: str
    body: str


def yaml_quote(value: str) -> str:
    return "'" + value.replace("'", "''") + "'"


def discover(source_root: Path) -> dict[tuple[int, str], Article]:
    found: dict[tuple[int, str], Article] = {}
    for lang in LANGS:
        base = source_root / SOURCE_DIRS[lang]
        if not base.is_dir():
            raise SystemExit(f"missing source directory: {base}")
        for path in sorted(base.glob(SOURCE_GLOBS[lang])):
            match = re.match(r"^(\d{2})-", path.name)
            if not match:
                continue
            order = int(match.group(1))
            if order not in META:
                continue
            text = path.read_text(encoding="utf-8")
            heading = re.match(r"^#\s+(.+?)\n+", text)
            if not heading:
                raise SystemExit(f"missing H1 in source article: {path}")
            found[(order, lang)] = Article(order, lang, path, heading.group(1).strip(), text[heading.end():])
    expected = {(order, lang) for order in META for lang in LANGS}
    missing = sorted(expected - found.keys())
    if missing:
        raise SystemExit("incomplete source series: " + ", ".join(f"{order}/{lang}" for order, lang in missing))
    return found


def render(article: Article, publish_date: str) -> str:
    meta = META[article.order]
    tags = ", ".join(meta["tags"][article.lang])
    return f"""---
title: {yaml_quote(article.title)}
description: {yaml_quote(meta["descriptions"][article.lang])}
date: {publish_date}
slug: {meta["slugs"][article.lang]}
tags: [{tags}]
draft: false
lang: {article.lang}
translationKey: {meta["translationKey"]}
seriesKey: {SERIES_KEY}
seriesOrder: {article.order}
---

{article.body}"""


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, required=True, help="local checkout of guiosoft-k3s-lab")
    parser.add_argument("--output", type=Path, default=Path("src/content/blog"))
    parser.add_argument("--date", default=date.today().isoformat(), help="publication date for newly created files")
    parser.add_argument("--check", action="store_true", help="report drift without writing")
    args = parser.parse_args()

    articles = discover(args.source.resolve())
    args.output.mkdir(parents=True, exist_ok=True)
    changed: list[Path] = []

    for key in sorted(articles):
        article = articles[key]
        target = args.output / META[article.order]["files"][article.lang]
        existing = target.read_text(encoding="utf-8") if target.exists() else None
        publish_date = args.date
        if existing:
            m = re.search(r"(?m)^date:\s*(\d{4}-\d{2}-\d{2})\s*$", existing)
            if m:
                publish_date = m.group(1)
        wanted = render(article, publish_date)
        if existing != wanted:
            changed.append(target)
            if not args.check:
                target.write_text(wanted, encoding="utf-8")

    if changed:
        print(("DRIFT" if args.check else "UPDATED") + f": {len(changed)} article(s)")
        for path in changed:
            print(f" - {path}")
        return 1 if args.check else 0

    print(f"PASS: {len(articles)} source articles match Astro content")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

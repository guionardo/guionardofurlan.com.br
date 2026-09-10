---
title: 'gs-dev: an assistant for working in the terminal'
description: 'How one CLI brings together project navigation, Git information and temporary text sharing.'
date: 2026-09-10
slug: gs-dev-terminal-assistant
tags: [Go, CLI, productivity]
draft: true
lang: en
translationKey: gs-dev-assistente-terminal
---

Switching between repositories involves small, recurring tasks: finding a
folder, opening a remote in the browser or checking changes in the history.
[gs-dev](https://github.com/guionardo/gs-dev) brings these operations together
in a terminal-based development assistant.

## Finding the project is part of the work

The `dev` group organizes access to development folders. The generated CLI
reference lists subcommands for registering roots, synchronizing the inventory,
listing directories and finding projects:

```bash
gs-dev dev --help
```

The README describes manifest-based detection for Go, Python, JavaScript,
Rust, Java, PHP and .NET. This allows navigation to center on projects instead
of relying solely on remembering paths.

## A CLI that talks to the shell

Changing the shell’s directory requires integration beyond running a program.
gs-dev documents shell functions for `dev`, `fav` and `pad`, along with a
mechanism that passes commands to the shell through a temporary file.

Installing these functions modifies the Bash or Zsh profile. It is worth
distinguishing that step from installing the binary: making the executable
available and integrating its commands into the environment are different
operations.

## Git and shared text

The tool also offers commit statistics and access to the remote URL:

```bash
gs-dev git-stats --help
gs-dev url --just-show
```

Another component is the gRPC pad service for temporary text snippets. The
README describes configurable expiration and API key authentication. This is
separate from directory navigation and requires a configured pad server.

## What to explore

The gs-dev project provides an example of bringing small tasks together in a
cohesive tool. A next experiment could compare usual navigation with the
assisted workflow across a real set of repositories. This article contains
no measurements yet: the benefit needs to be observed, not assumed.

## Sources

- [gs-dev README](https://github.com/guionardo/gs-dev/blob/629d4020ceb28abfe276e08dedaa944a50465541/README.md).
- [dev group reference](https://github.com/guionardo/gs-dev/blob/629d4020ceb28abfe276e08dedaa944a50465541/docs/gs-dev_dev.md).

<!-- Editorial review: commands were not executed during this review. Confirm
examples against the chosen version and set the publication date before
publishing both languages. The generated reference uses `gs-dev dev`; the
README contains shortened examples without that level. -->

---
title: 'GoVuln: vulnerability analysis in the development workflow'
description: 'An introduction to the govulncheck wrapper and its pre-commit integration for Go projects.'
date: 2026-09-10
slug: govuln-vulnerability-development-workflow
tags: [Go, security, automation]
draft: true
lang: en
translationKey: govuln-fluxo-desenvolvimento
---

Vulnerability checks need a place in everyday work.
[GoVuln](https://github.com/guionardo/govuln) approaches this integration as a
wrapper around `govulncheck`, adding features to organize execution and
present results.

## Bringing analysis closer to the commit

The repository’s hook manifest defines `go-vulncheck`, with `govuln` as its
entry point and support for the `pre-commit`, `pre-push` and `manual` stages.
It also declares `pass_filenames: false` and `always_run: true`: the hook does
not receive the list of changed files and is configured to run even without
matching files.

This positions the check as a project-level operation. It differs from a
formatter that receives only the files selected for a commit. The stage
actually used depends on the project’s pre-commit configuration.

## The wrapper’s role

According to the README, GoVuln adds caching, internal dependency and
submodule scanning, concurrent execution and table or Markdown reports.
The analysis engine remains `govulncheck`; the wrapper’s purpose is to
organize its use in the development workflow.

Caching introduces an important operational decision: reusing a result
reduces repeated work, but is not equivalent to running a fresh analysis.
The documentation describes a 24-hour duration. Before incorporating that
behavior into a CI policy, it is worth validating cache invalidation and
the conditions that require a fresh run.

## Documentation needs verification too

During the repository review, the README examples contained URLs with a
duplicated `github.com` and differing references for warning mode. The
reviewed manifest declares only the `go-vulncheck` hook.

A reproducible tutorial therefore needs to pin a revision and check its
commands and options, rather than indiscriminately copying examples from
different versions. This article presents the documented structure; it does
not report a tool execution or the results of a scan.

## Next experiment

A useful next step is to test the integration in a controlled Go project,
recording the version used, the result without caching, the behavior with
caching and the hook’s exit code. That experiment can inform the decision
about where to run the analysis and how to handle its results.

## Sources

- [GoVuln README](https://github.com/guionardo/govuln/blob/2d6c89d4ce224449925c8c2c023029624e352217/README.md).
- [Hook manifest](https://github.com/guionardo/govuln/blob/2d6c89d4ce224449925c8c2c023029624e352217/.pre-commit-hooks.yaml).

<!-- Editorial review: validate installation, CLI options and cache behavior
in execution before expanding into a tutorial. Set the publication date and
review the PT/EN pair. Do not modify the external repository in this task. -->

---
title: "TypedHandler: from an HTTP request to a typed contract"
description: "Tags, generics and object reuse in organizing input for a Go API."
date: "2026-09-11"
slug: "typedhandler-http-typed-contract"
tags: ["Go", "APIs", "architecture"]
draft: true
lang: "en"
translationKey: "typedhandler-introduction"
---

## Where does application logic begin?

An HTTP request can distribute its data across the path, query string,
headers and body. Before executing a business rule, the handler needs to
collect and convert those inputs.

TypedHandler proposes describing that contract in Go structs. According to
the README, tags identify data sources and generics connect the parser to
the handler. This makes input organization an explicit part of the API.

## The cost of abstraction

The documentation describes reflection during parser initialization, with
reused metadata, and `sync.Pool` for reusing request objects. It also
presents body parsing strategies and interfaces for customizing errors and
object cleanup.

These choices raise useful questions: does the contract remain easy to read?
How do conversion errors reach the HTTP response? Which state needs to be
cleared before an instance is reused?

## Measure before making promises

The project describes itself as focused on few allocations. Here, that is a
documented goal, not a benchmark result reproduced during this review.

An experimental article could compare an explicit handler with the typed
version, measuring allocations and latency with equivalent inputs. Error
cases and successive requests also matter: speed does not replace correct
isolation of data between executions.

The proposal opens a discussion about small abstractions in Go: how much
repetitive work they remove and which responsibilities remain with the
application. This first draft frames that investigation from the README.

## Source

[README — typedhandler](https://github.com/guionardo/typedhandler/blob/65417d53a0d00e53732ce29390e377361c523fa2/README.md).

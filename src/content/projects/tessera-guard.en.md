---
title: "Tessera Guard: licensing and observability for desktop software"
lang: en
---

## The problem

Shipping desktop software does not end the developer’s work. After
installation, other questions arise: which versions are in use? How is a
license activated or revoked? What happened when an application stopped
working on a customer’s machine?

A license-key check in the installer covers only part of that lifecycle.
Building a dedicated backend gives more control, but also adds
infrastructure and services to maintain.

**Tessera Guard** is a project in development that aims to bring licensing,
execution control and observability together in a managed service.
The first test version is being prepared.

## How the platform is organized

The architecture has two main components:

- **Guardian:** an agent installed on the customer’s machine, responsible for
  validating licenses, launching the application as a child process,
  capturing output and sending telemetry. Its scope includes activation,
  periodic activity signals (heartbeats), revocation and renewal.
- **Tessera Guard Cloud:** a backend and dashboard for managing customers,
  contracts, licenses, releases and users. The architecture calls for
  PostgreSQL, VictoriaMetrics for metrics and VictoriaLogs for logs.

Guardian connects the application to the platform. The intention is to
concentrate part of the integration work in the agent. The effort required
and the limits of this approach need to be validated for each application.

## Features planned for the test version

### Licensing

The scope includes machine-bound licenses, per-user licenses and a dynamic
license pool, along with activation-key generation, revocation and grace
periods.

### Sessions, metrics and logs

The aim is to track sessions and heartbeats, inspect CPU and memory metrics
and connect logs to an application’s execution. The dashboard should allow
investigation of a license and its individual sessions.

### Releases and updates

Release management and update distribution through Guardian are part of the
scope. The goal is to reduce manual steps in keeping track of the versions
installed on customers’ machines.

### Alerts

Planned channels include email, webhooks, in-app notifications and ntfy,
for situations such as approaching license expiration or signs of problems
in monitored executions.

### Security controls

The project calls for protecting Guardian’s configuration with
XChaCha20-Poly1305 and Argon2id key derivation, JWT authentication,
role- and permission-based access control, and audit records. These
mechanisms are part of the technical design; on their own, they do not
guarantee protection against every form of misuse.

## Who it is for

- Desktop and embedded software vendors that need to manage licenses and
  monitor distributed applications.
- Product teams that need to investigate versions, sessions and execution
  conditions on customers’ machines.
- Independent developers who prefer integrating a licensing service to
  maintaining all of that infrastructure.

## Current status and next steps

The test version is in development. The proposed model is a managed
service, with backend operation handled by the platform.

Testing should help validate Guardian integration, the license lifecycle
and the usefulness of telemetry when investigating problems. Compatibility,
availability and operating capacity need to be evaluated at this stage;
no release date is announced here.

The aim is to make it easier to follow what happens to an application after
it leaves the development environment.

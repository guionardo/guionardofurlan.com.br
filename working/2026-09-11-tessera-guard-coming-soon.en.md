# Coming Soon: Tessera Guard — A Hosted Licensing Platform for Desktop Software

If you sell desktop software, you already know the drill: you ship a great product, and then you spend your nights worrying about cracked licenses, unaccounted usage, and customers running outdated builds with no way for you to know.

**Tessera Guard** is a hosted licensing and execution-control platform for software vendors — one Guardian agent on every user machine, one fully managed cloud backend, and a management dashboard that turns "I hope everything is fine" into "I know exactly what's running, where, and how healthy it is."

We're putting the finishing touches on the first test version now, and we want to introduce the platform before we open it up.

## The problem Tessera Guard solves

Most desktop software licensing falls into two painful camps:

- **DIY licensing** — a license-key check buried in your installer. It keeps honest people honest, but it does nothing about actual piracy, tells you nothing about real-world usage, and makes updates a manual, risky process.
- **Self-built licensing backends** — powerful on paper, but now *you* own a second product: servers to run, databases to keep patched, uptime to defend. It quietly becomes a permanent tax on your team.

Tessera Guard is the middle path that actually works: **a licensing platform with enterprise-grade capabilities, delivered as a managed service so you never touch the infrastructure.**

## How it works

Tessera Guard has two pieces:

**Guardian** — a small agent installed on each of your customers' machines. It validates licenses, launches your program as a protected child process, captures its output, and streams telemetry to the platform. It handles the messy lifecycle details — activation, heartbeat, revocation, renewal — so your application code stays clean.

**Tessera Guard Cloud** — the managed backend we operate. It manages your customers, contracts, licenses, releases, and users through a management UI, and stores everything on hardened infrastructure (PostgreSQL, VictoriaMetrics for metrics, VictoriaLogs for logs). **You manage your products; we run the platform.**

Your licensed application talks to the Guardian, the Guardian talks to the cloud — and **nothing about your product's code needs to change** to get full licensing and observability.

## Features the test version will include

### Licensing that fits your business model
Not every product is "one key, one machine." Tessera Guard supports multiple licensing models — machine-bound, per-user, and dynamic pool — so you can sell the way your customers want to buy. Activation keys are generated in-app, and revocation (including grace periods) is handled automatically.

### Live visibility into every deployment
Every licensed machine reports in with heartbeats, session tracking, CPU/memory metrics, and logs. In the dashboard you can see a license's session timeline, drill into per-session metrics, and open raw logs and metrics for any license — down to a single session.

### Remote updates and release management
Manage releases from the dashboard, and keep every deployed customer in sync through the Guardian — no more begging users to install update #14 manually.

### Alerts that find problems before your customers do
Built-in alerting across email, webhooks, in-app, and ntfy — so unusual behavior, expiring licenses, or unhealthy deployments page the right people automatically.

### Security built in from day one
The Guardian protects its own config with XChaCha20-Poly1305 encryption and Argon2id key derivation, authenticates with JWT, and every management action is gated by roles and permissions — with audit logging to match.

### A managed service, not a second product
No servers to provision, no databases to run, no upgrades to schedule. The platform is always current, always available, and scales with your user base.

## Who Tessera Guard is for

- **Desktop and embedded software vendors** who want real licensing without building or running it themselves.
- **Product teams** that need usage and health visibility across thousands of customer machines.
- **Independent developers** who want a professional licensing story — without hiring a platform team.

## What's next

The test version is in active development and we'll be opening it to a first group of users soon. If licensing and deployment visibility for desktop software sounds like a problem you have, get on the list and we'll keep you posted the moment it's ready.

**Join the waitlist** — get early access to the test version, and see your deployments the way your customers experience them.

License your software properly — then get back to building the features that made your product worth protecting in the first place.
---
title: "Reverse-engineering a UPS: from a Debian package to Home Assistant"
description: "How a proprietary Ragtech UPS monitor became an open project with a documented protocol, CLI and NUT integration."
date: 2026-10-26
slug: reverse-engineering-ragtech-ups
tags: [Reverse engineering, Linux, Home Assistant, Projects]
draft: false
lang: en
translationKey: supervise-mon-ups-reverse-engineering
---

My UPS was a black box. A Ragtech Easy PRO, a well-built Brazilian device, came
with a Linux monitoring suite distributed as binaries only. There was no source
code and no protocol documentation: just a `.deb` file containing daemons,
shared libraries, a web interface and one XML file that turned out to be the key
to the whole project.

I wanted three things: live telemetry in Home Assistant, a scriptable CLI and a
protocol that could be implemented in any language. The result became
[`supervise-mon`](https://github.com/guionardo/supervise-mon).

## The map hidden in XML

The proprietary package, Supervise 8.9.2, had ELF binaries with symbols intact
and revealing class names: `SerialHID`, `RagtechDevice`, `DeviceManager` and
`DeviceDetector`. The decisive detail was `devices.xml`: 17 UPS families, each
with memory ranges, register aliases, engineering constants, formulas and
actions.

The XML showed that the software was generic. The bytes carried the values; the
catalog defined their meaning.

## Capture before guessing

Static analysis provided clues, but it was not enough to reconstruct the bytes.
With the real device connected over USB CDC — Microchip `04D8:000A` — I ran the
vendor daemon under `strace` and captured roughly 11 MB of serial I/O. Aligning
requests and responses revealed the grammar:

```text
AA 04 <addrHi> <addrLo> <len> <crc>     crc = (hi + len + lo) & 0xFF
AA 04 00 80 1E 9E   → read 30 bytes at 0x0080
AA 04 00 F3 01 F4   → read 1 byte at 0x00F3
AA 04 FF E0 08 95   → handshake; the UPS replies with 12 34 56 78
```

Six bytes per request, a simple checksum and memory-mapped telemetry. I then
wrote an independent probe and reproduced the driver responses byte for byte.

## Calibration requires measurement

The first profile produced plausible but wrong numbers: input voltage appeared
as 61 V. A voltmeter supplied the reference: 230 V at both input and output
under load.

The device was identified as an **EASY 1200 M2**, model 7, family 10. Corrected
scales produced approximately 226.8–230 V input, 227.6 V output, 26.8 V battery
voltage and 59.9 Hz frequency. The 24 V battery pack reported roughly 100%
charge.

## A real reading

The CLI output is intentionally plain:

```console
$ supervise-mon status
status: OL
  battery.charge: 100.2
  battery.voltage: 26.8
  input.voltage: 226.8
  output.current: 2.48
  output.power: 45
  battery.temperature: 47
  output.frequency: 59.89
  model: 7
  version: 1.2
  output.voltage: 227.6
  capacity.new: 124
  !syncInput
  !superviseOn
  load: 3.8%
```

These values came from real hardware at `/dev/ttyACM0`, with voltage and
frequency checked against the voltmeter. The log also confirms the connection
only after the handshake: `device connected: /dev/ttyACM0 (handshake ok)`.

## From protocol to project

`supervise-mon` separates transport, frames, memory map and normalized snapshot.
The device profile lives in TOML, so another family can be calibrated without
changing the core code. Adapters expose the data through NUT, MQTT with Home
Assistant discovery, Prometheus, REST and a SQLite history store.

The NUT server taught me one final lesson: the first version sent an `OK` banner
as soon as the client connected. Home Assistant replied with “Unexpected
response: OK”, because the protocol says the server must not speak before it
receives a command. Removing that banner fixed the integration.

## What remained

Instrumenting the real driver was more productive than guessing the protocol.
The vendor catalog became documentation, the voltmeter became part of the
reverse-engineering process and NUT protocol compliance mattered as much as
decoding the registers.

The result is an open-source, read-only project that turns a proprietary UPS
into telemetry usable from both a terminal and a home-automation system.

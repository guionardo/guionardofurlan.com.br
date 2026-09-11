---
title: "fan-control: where Go meets server cooling"
description: "A project connecting temperature sensors, serial communication and fan control."
date: "2026-09-11"
slug: "fan-control-go-server-cooling"
tags: ["Go", "electronics", "DIY"]
draft: true
lang: "en"
translationKey: "fan-control-introduction"
---

## A problem spanning software and hardware

The documented goal of fan-control is to reduce server fan noise without
losing responsiveness to CPU demand. The proposal combines an
Arduino Digispark/ATtiny85 controller with a manager written in Go.

The README describes the manager’s role: collect temperatures, calculate
the fan response and communicate with the controller over a serial port.
It is a concrete example of software that needs to interact with the
physical world.

## Two steps, two different kinds of information

In the first planned version, the controller periodically reports the current
PWM value. The manager relates that value to temperatures and sends a new
command when needed. For the second version, the document also proposes
measuring actual fan speed.

That separation raises an interesting question: is sending a command enough
to know that the equipment responded? Measuring rotation adds information
that differs from the control value sent.

## An experiment worth documenting

A practical article could track temperatures, commands and rotation under
a controlled workload, and observe what happens when communication fails.
These are investigation topics, not results already demonstrated here.

The README presents goals and planned versions. This draft does not verify
the hardware assembly, provide wiring instructions or claim a measured noise
reduction. The story lies in the path from the proposal to its validation.

## Source

[README — fan-control](https://github.com/guionardo/fan-control/blob/264a5e584aa6a7c635eb06085e5ca0c58e589d9e/README.md).

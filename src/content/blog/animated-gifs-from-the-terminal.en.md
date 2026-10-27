---
title: 'Creating animated GIFs from the terminal'
description: 'How to record a terminal session with asciinema and render it as an animated GIF using agg.'
date: 2022-08-19
slug: animated-gifs-from-the-terminal
tags: [terminal, gif, linux]
draft: false
lang: en
translationKey: terminal-animated-gifs
---

## The problem

I needed to create short videos to demonstrate console applications. Traditional screen capture is cumbersome and often produces larger files than necessary for this kind of example.

This is a reviewed update of the original article [Creating animated gifs from your terminal](https://dev.to/guionardo/creating-animated-gifs-from-your-terminal-3oo5), published in 2022. The commands were checked against the current `asciinema` and `agg` documentation.

The original article also used this dancing duck as a visual demonstration. This GIF belongs to a third party and is included with attribution to the [USAGIF dancing duck GIF collection](https://usagif.com/dancing-duck-gifs-shuba-duck-and-others/):

![GIF of a dancing duck](/images/gifs-animados-do-terminal/dancing-duck.gif)

## The workflow

The process has two steps:

1. record the terminal session to a `.cast` file with `asciinema`;
2. render the recording as a GIF with `agg`.

The `.cast` file records terminal events instead of capturing every screen pixel. This usually produces a lightweight recording and lets the renderer choose the font, theme, and size later.

## Installing asciinema

`asciinema` is available in Debian and Ubuntu repositories:

```bash
sudo apt update
sudo apt install asciinema
```

Official binaries and other installation options are also available in the [asciinema documentation](https://docs.asciinema.org/manual/cli/).

Check the installation:

```bash
asciinema --version
```

## Recording a session

Start a recording into a local file:

```bash
asciinema rec first.cast
```

Run the commands you want to demonstrate normally. To finish, press `Ctrl+D` or run `exit`.

Review the recording before sharing it. Anything displayed in the terminal can be captured, including typed passwords, tokens, private paths, hostnames, and configuration data.

## Installing agg

`agg` is the asciinema project's GIF generator. The simplest option is to download a compatible binary from the [agg releases page](https://github.com/asciinema/agg/releases), make it executable, and place it in a directory on your `PATH`.

If you already use Rust, you can build and install the current version directly from the repository:

```bash
cargo install --git https://github.com/asciinema/agg
```

This requires Rust and Cargo compatible with the current project version. Then check it:

```bash
agg --version
```

The project also publishes an official OCI image for Docker or Podman. It is useful when you do not want to install the Rust toolchain on the host; examples are available in the [agg installation documentation](https://docs.asciinema.org/manual/agg/installation/).

## Generating the GIF

With `first.cast` and `agg` available on `PATH`:

```bash
agg first.cast first.gif
```

Here is an example of a GIF rendered from a recorded session:

![Animated GIF of a terminal session rendered with agg](/images/gifs-animados-do-terminal/first.gif)

To choose an installed font and an additional font directory:

```bash
agg --font-dir ./fonts --font-family 'JetBrains Mono' first.cast first.gif
```

Current `agg` versions also support themes, font-size changes, playback speed, and rendering only part of a recording. See `agg --help` or the [agg usage documentation](https://docs.asciinema.org/manual/agg/usage/) for these options.

You can also convert a published recording directly from a URL:

```bash
agg https://asciinema.org/a/569727 demo.gif
```

## Keeping the cast file

The recording file remains useful as an editable and reproducible source. Keep the `.cast` file with the project when you may want to regenerate the GIF with another font, theme, or speed.

For a public demonstration, however, the simplest workflow is to share the generated GIF or the asciinema recording, depending on the purpose of the material.

## Format limits

GIF is convenient for embedding in pages and issues, but it is not an efficient format for long videos. Its color palette is limited, and the file can grow considerably when the session has many visual changes.

For long recordings or content with audio, a regular video format may be more appropriate. For short command examples, the `.cast` + GIF pair is usually enough.

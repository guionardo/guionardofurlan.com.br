---
title: 'Fast folder iteration in Python'
description: 'A practical comparison of glob, iglob, os.walk, os.scandir, and pathlib for traversing large directory trees.'
date: 2022-01-21
slug: fast-folder-iteration-in-python
tags: [python, performance]
draft: false
lang: en
translationKey: fast-folder-iteration-python
heroImage: /images/fast-folder-iteration-in-python/header.jpg
heroImageAlt: 'Organized archival boxes on shelves, a visual metaphor for traversing many files.'
---

## The problem

Walking a folder looks simple until it contains hundreds of thousands of files. At that point, the API affects time to the first result, total traversal time, and memory usage.

This article compares five Python standard-library approaches:

- `glob.glob`
- `glob.iglob`
- `os.walk`
- `os.scandir`
- `pathlib.Path.rglob`

The comparison code is available in [`guionardo/python-folder-iteration`](https://github.com/guionardo/python-folder-iteration).

## The implementations

The glob-based approaches walk the tree with the recursive `**` pattern:

```python
import glob
import os

def iterate(folder):
    for path in glob.glob(os.path.join(folder, '**', '*'), recursive=True):
        if os.path.isfile(path):
            yield path
```

`iglob` performs the same search, but returns an iterator instead of materializing every result at once:

```python
def iterate(folder):
    for path in glob.iglob(os.path.join(folder, '**', '*'), recursive=True):
        if os.path.isfile(path):
            yield path
```

With `os.walk`, the root folder is traversed directly:

```python
import os

def iterate(folder):
    for root, _, files in os.walk(folder):
        for filename in files:
            yield os.path.join(root, filename)
```

`os.scandir` visits each directory entry and can reuse information from the `DirEntry` object:

```python
import os

def iterate(folder):
    with os.scandir(folder) as entries:
        for entry in entries:
            if entry.is_file():
                yield entry.path
            else:
                yield from iterate(entry.path)
```

Finally, `pathlib` provides an object-oriented interface:

```python
from pathlib import Path

def iterate(folder):
    for path in Path(folder).rglob('*'):
        if path.is_file():
            yield str(path)
```

## The first benchmark

The original benchmark created 933,120 files in a six-level tree and compared the iterators on Ubuntu 20.04. Its original results were:

| Iterator | Total time |
| --- | ---: |
| `os.scandir` | 1.32 s |
| `os.walk` | 2.50 s |
| `pathlib` | 10.46 s |
| `iglob` | 14.36 s |
| `glob` | 15.31 s |

These numbers are historical: they represent that machine, file system, and Python version.

## Re-running it in 2026

While reviewing the repository, I fixed a logging-path error (`start_time` instead of `self.start_time`). Before the fix, the three generator tests passed but all five iterator tests failed. After the fix, all eight tests passed.

I also ran the benchmark again with Python 3.14.7 on macOS 27 and Apple Silicon, using the same tree of 933,120 files:

| Iterator | Total time | Time to first file |
| --- | ---: | ---: |
| `os.scandir` | 1.60 s | 0.000284 s |
| `os.walk` | 2.05 s | 0.000539 s |
| `pathlib` | 8.48 s | 0.001690 s |
| `iglob` | 9.19 s | 0.000803 s |
| `glob` | 9.49 s | 3.545491 s |

The result supports the general conclusion: `os.scandir` was fastest, followed by `os.walk`. This is not a direct comparison with the original benchmark, though: the operating system, file system, hardware, and Python version are different.

To obtain these timings, CPU-frequency collection and the `DATA` memory metric were temporarily disabled because those values are unavailable through `psutil` on this macOS/Python combination. I therefore do not present a new memory table.

## What should you choose?

My practical rule of thumb is:

- use `os.scandir` when traversal time matters or when you also need entry metadata;
- use `os.walk` when you want a straightforward directory and file traversal API;
- use `glob.iglob` when the search pattern is central and you want to consume results incrementally;
- use `pathlib` when the clarity of its object-oriented API is worth the extra cost;
- use `glob.glob` when simplicity and a complete result list are enough.

There is no universal winner. The cost depends on the operating system, file system, folder structure, and what the program does with each path.

## Sources

- [`os` documentation](https://docs.python.org/3/library/os.html)
- [`glob` documentation](https://docs.python.org/3/library/glob.html)
- [`pathlib` documentation](https://docs.python.org/3/library/pathlib.html)
- [International Committee of the Red Cross archives image](https://en.wikipedia.org/wiki/International_Committee_of_the_Red_Cross_archives), used in the original article
- [Benchmark repository](https://github.com/guionardo/python-folder-iteration)

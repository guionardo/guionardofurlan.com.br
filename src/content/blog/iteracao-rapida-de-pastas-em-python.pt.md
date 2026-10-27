---
title: 'Iteração rápida de pastas em Python'
description: 'Uma comparação prática entre glob, iglob, os.walk, os.scandir e pathlib para percorrer muitos arquivos.'
date: 2022-01-21
slug: iteracao-rapida-de-pastas-em-python
tags: [python, performance]
draft: false
lang: pt
translationKey: fast-folder-iteration-python
heroImage: /images/fast-folder-iteration-in-python/header.jpg
heroImageAlt: 'Caixas de arquivo organizadas em uma estante, uma metáfora visual para percorrer muitos arquivos.'
---

## O problema

Percorrer uma pasta parece simples até que ela contenha centenas de milhares de arquivos. Nesse ponto, a escolha da API afeta o tempo até o primeiro resultado, o tempo total e o consumo de memória.

Este artigo compara cinco abordagens da biblioteca padrão do Python:

- `glob.glob`
- `glob.iglob`
- `os.walk`
- `os.scandir`
- `pathlib.Path.rglob`

O código usado na comparação está no repositório [`guionardo/python-folder-iteration`](https://github.com/guionardo/python-folder-iteration).

## As implementações

As abordagens baseadas em glob percorrem a árvore usando o padrão recursivo `**`:

```python
import glob
import os

def iterate(folder):
    for path in glob.glob(os.path.join(folder, '**', '*'), recursive=True):
        if os.path.isfile(path):
            yield path
```

`iglob` usa a mesma busca, mas retorna um iterador e não materializa todos os resultados de uma vez:

```python
def iterate(folder):
    for path in glob.iglob(os.path.join(folder, '**', '*'), recursive=True):
        if os.path.isfile(path):
            yield path
```

Com `os.walk`, a pasta raiz é percorrida diretamente:

```python
import os

def iterate(folder):
    for root, _, files in os.walk(folder):
        for filename in files:
            yield os.path.join(root, filename)
```

`os.scandir` permite visitar as entradas de cada diretório e reutilizar informações do próprio `DirEntry`:

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

Por fim, `pathlib` oferece uma interface orientada a objetos:

```python
from pathlib import Path

def iterate(folder):
    for path in Path(folder).rglob('*'):
        if path.is_file():
            yield str(path)
```

## O primeiro benchmark

O benchmark original criou 933.120 arquivos em uma árvore com seis níveis e comparou os iteradores em Ubuntu 20.04. Os resultados originais foram:

| Iterador | Tempo total |
| --- | ---: |
| `os.scandir` | 1,32 s |
| `os.walk` | 2,50 s |
| `pathlib` | 10,46 s |
| `iglob` | 14,36 s |
| `glob` | 15,31 s |

Esses números são históricos: representam aquela máquina, aquele sistema de arquivos e aquela versão do Python.

## Repetição em 2026

Ao revisar o repositório, corrigi um erro no caminho de logging (`start_time` em vez de `self.start_time`). Antes da correção, os três testes dos geradores passavam, mas os cinco testes dos iteradores falhavam. Depois da correção, os oito testes passaram.

Também executei novamente o benchmark com Python 3.14.7 em macOS 27, Apple Silicon, usando a mesma árvore de 933.120 arquivos:

| Iterador | Tempo total | Até o primeiro arquivo |
| --- | ---: | ---: |
| `os.scandir` | 1,60 s | 0,000284 s |
| `os.walk` | 2,05 s | 0,000539 s |
| `pathlib` | 8,48 s | 0,001690 s |
| `iglob` | 9,19 s | 0,000803 s |
| `glob` | 9,49 s | 3,545491 s |

O resultado reforça a conclusão geral: `os.scandir` foi o mais rápido, seguido por `os.walk`. Mas não é uma comparação direta com o benchmark original: o sistema operacional, o sistema de arquivos, o hardware e a versão do Python são diferentes.

Para obter esses tempos, a coleta de frequência da CPU e da métrica `DATA` de memória foi desabilitada temporariamente, porque essas informações não estão disponíveis pelo `psutil` nessa combinação de macOS e Python. Por isso, não apresento uma nova tabela de memória.

## O que escolher

Minha regra prática é:

- use `os.scandir` quando o tempo de varredura for importante ou quando você também precisar de metadados das entradas;
- use `os.walk` quando quiser uma API simples para percorrer diretórios e arquivos;
- use `glob.iglob` quando o padrão de busca for a parte mais importante e você quiser consumir os resultados de forma incremental;
- use `pathlib` quando a clareza da API orientada a objetos justificar o custo adicional;
- use `glob.glob` quando a simplicidade e a lista completa de resultados forem suficientes.

Não existe um vencedor universal. O custo depende do sistema operacional, do sistema de arquivos, da estrutura das pastas e do que o programa faz com cada caminho.

## Fontes

- [Documentação de `os`](https://docs.python.org/3/library/os.html)
- [Documentação de `glob`](https://docs.python.org/3/library/glob.html)
- [Documentação de `pathlib`](https://docs.python.org/3/library/pathlib.html)
- [Imagem de arquivo do International Committee of the Red Cross](https://en.wikipedia.org/wiki/International_Committee_of_the_Red_Cross_archives), usada no artigo original
- [Repositório do benchmark](https://github.com/guionardo/python-folder-iteration)

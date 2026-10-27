---
title: 'Iteración rápida de carpetas en Python'
description: 'Una comparación práctica entre glob, iglob, os.walk, os.scandir y pathlib para recorrer árboles de directorios grandes.'
date: 2022-01-21
slug: iteracion-rapida-de-carpetas-en-python
tags: [python, rendimiento]
draft: false
lang: es
translationKey: fast-folder-iteration-python
---

## El problema

Recorrer una carpeta parece sencillo hasta que contiene cientos de miles de archivos. En ese momento, la API elegida afecta al tiempo hasta el primer resultado, al tiempo total y al uso de memoria.

Este artículo compara cinco alternativas de la biblioteca estándar de Python:

- `glob.glob`
- `glob.iglob`
- `os.walk`
- `os.scandir`
- `pathlib.Path.rglob`

El código de la comparación está disponible en [`guionardo/python-folder-iteration`](https://github.com/guionardo/python-folder-iteration).

## Las implementaciones

Las alternativas basadas en glob recorren el árbol usando el patrón recursivo `**`:

```python
import glob
import os

def iterate(folder):
    for path in glob.glob(os.path.join(folder, '**', '*'), recursive=True):
        if os.path.isfile(path):
            yield path
```

`iglob` realiza la misma búsqueda, pero devuelve un iterador y no materializa todos los resultados de una vez:

```python
def iterate(folder):
    for path in glob.iglob(os.path.join(folder, '**', '*'), recursive=True):
        if os.path.isfile(path):
            yield path
```

Con `os.walk`, la carpeta raíz se recorre directamente:

```python
import os

def iterate(folder):
    for root, _, files in os.walk(folder):
        for filename in files:
            yield os.path.join(root, filename)
```

`os.scandir` visita cada entrada del directorio y puede reutilizar información del objeto `DirEntry`:

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

Por último, `pathlib` proporciona una interfaz orientada a objetos:

```python
from pathlib import Path

def iterate(folder):
    for path in Path(folder).rglob('*'):
        if path.is_file():
            yield str(path)
```

## El primer benchmark

El benchmark original creó 933.120 archivos en un árbol de seis niveles y comparó los iteradores en Ubuntu 20.04. Sus resultados originales fueron:

| Iterador | Tiempo total |
| --- | ---: |
| `os.scandir` | 1,32 s |
| `os.walk` | 2,50 s |
| `pathlib` | 10,46 s |
| `iglob` | 14,36 s |
| `glob` | 15,31 s |

Estos números son históricos: representan aquella máquina, aquel sistema de archivos y aquella versión de Python.

## Repetición en 2026

Al revisar el repositorio, corregí un error en el camino de logging (`start_time` en lugar de `self.start_time`). Antes de la corrección, las tres pruebas de los generadores pasaban, pero las cinco pruebas de los iteradores fallaban. Después de la corrección, las ocho pruebas pasaron.

También ejecuté nuevamente el benchmark con Python 3.14.7 en macOS 27 y Apple Silicon, usando el mismo árbol de 933.120 archivos:

| Iterador | Tiempo total | Hasta el primer archivo |
| --- | ---: | ---: |
| `os.scandir` | 1,60 s | 0,000284 s |
| `os.walk` | 2,05 s | 0,000539 s |
| `pathlib` | 8,48 s | 0,001690 s |
| `iglob` | 9,19 s | 0,000803 s |
| `glob` | 9,49 s | 3,545491 s |

El resultado refuerza la conclusión general: `os.scandir` fue el más rápido, seguido por `os.walk`. Sin embargo, no es una comparación directa con el benchmark original: el sistema operativo, el sistema de archivos, el hardware y la versión de Python son diferentes.

Para obtener estos tiempos, deshabilité temporalmente la recopilación de la frecuencia de la CPU y de la métrica de memoria `DATA`, porque esos datos no están disponibles mediante `psutil` en esta combinación de macOS y Python. Por eso no presento una nueva tabla de memoria.

## Qué elegir

Mi regla práctica es:

- usa `os.scandir` cuando el tiempo de recorrido sea importante o también necesites metadatos de las entradas;
- usa `os.walk` cuando quieras una API sencilla para recorrer directorios y archivos;
- usa `glob.iglob` cuando el patrón de búsqueda sea lo más importante y quieras consumir los resultados de forma incremental;
- usa `pathlib` cuando la claridad de su API orientada a objetos justifique el coste adicional;
- usa `glob.glob` cuando la simplicidad y la lista completa de resultados sean suficientes.

No existe un ganador universal. El coste depende del sistema operativo, del sistema de archivos, de la estructura de las carpetas y de lo que el programa haga con cada ruta.

## Fuentes

- [Documentación de `os`](https://docs.python.org/3/library/os.html)
- [Documentación de `glob`](https://docs.python.org/3/library/glob.html)
- [Documentación de `pathlib`](https://docs.python.org/3/library/pathlib.html)
- [Repositorio del benchmark](https://github.com/guionardo/python-folder-iteration)

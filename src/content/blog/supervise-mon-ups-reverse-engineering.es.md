---
title: "Ingeniería inversa de un UPS: del paquete Debian a Home Assistant"
description: "Cómo un monitor propietario de un UPS Ragtech se convirtió en un proyecto abierto con protocolo documentado, CLI e integración NUT."
date: 2026-10-26
slug: ingenieria-inversa-ups-ragtech
tags: [Ingeniería inversa, Linux, Home Assistant, Proyectos]
draft: false
lang: es
translationKey: supervise-mon-ups-reverse-engineering
---

Mi UPS era una caja negra. Un Ragtech Easy PRO, un equipo brasileño bien
construido, venía con una suite de monitorización para Linux distribuida solo
como binarios. No había código fuente ni documentación del protocolo: solo un
archivo `.deb` con daemons, bibliotecas compartidas, una interfaz web y un XML
que terminó siendo la clave de todo el proyecto.

Quería tres cosas: telemetría en vivo en Home Assistant, una CLI que pudiera
automatizar y un protocolo que pudiera implementarse en cualquier lenguaje. El
resultado fue [`supervise-mon`](https://github.com/guionardo/supervise-mon).

## El mapa escondido en el XML

El paquete propietario, Supervise 8.9.2, tenía binarios ELF con símbolos
intactos y nombres de clases reveladores: `SerialHID`, `RagtechDevice`,
`DeviceManager` y `DeviceDetector`. El detalle decisivo estaba en
`devices.xml`: 17 familias de UPS, cada una con rangos de memoria, alias de
registros, constantes de ingeniería, fórmulas y acciones.

El XML mostró que el software era genérico. Los bytes transportaban los valores;
el catálogo definía su significado.

## Capturar antes de adivinar

El análisis estático dio pistas, pero no bastaba para reconstruir los bytes. Con
el equipo real conectado por USB CDC —Microchip `04D8:000A`— ejecuté el daemon
del fabricante bajo `strace` y capturé aproximadamente 11 MB de I/O serial.
Al alinear las solicitudes y respuestas apareció la gramática completa:

```text
AA 04 <addrHi> <addrLo> <len> <crc>     crc = (hi + len + lo) & 0xFF
AA 04 00 80 1E 9E   → lee 30 bytes en 0x0080
AA 04 00 F3 01 F4   → lee 1 byte en 0x00F3
AA 04 FF E0 08 95   → handshake; el UPS responde con 12 34 56 78
```

Seis bytes por solicitud, un checksum sencillo y telemetría organizada como
memoria mapeada. Después escribí un probe independiente y reproduje las
respuestas del driver byte por byte.

## Calibrar exige medir

El primer perfil producía números plausibles, pero incorrectos: la tensión de
entrada aparecía como 61 V. Un voltímetro proporcionó la referencia: 230 V en
la entrada y en la salida, bajo carga.

El equipo fue identificado como **EASY 1200 M2**, modelo 7, familia 10. Las
escalas corregidas produjeron aproximadamente 226,8–230 V en la entrada,
227,6 V en la salida, 26,8 V en la batería y 59,9 Hz de frecuencia. El paquete
de baterías de 24 V indicó aproximadamente un 100% de carga.

## Una lectura real

La salida de la CLI es deliberadamente sencilla:

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

Estos valores proceden de hardware real en `/dev/ttyACM0`, con la tensión y la
frecuencia comparadas con el voltímetro. El log también confirma la conexión
solo después del handshake: `device connected: /dev/ttyACM0 (handshake ok)`.

## Del protocolo al proyecto

`supervise-mon` separa transporte, frames, mapa de memoria y snapshot
normalizado. El perfil del dispositivo vive en TOML, de modo que otra familia
pueda calibrarse sin modificar el código principal. Los adaptadores exponen los
datos mediante NUT, MQTT con descubrimiento de Home Assistant, Prometheus, REST
y un historial SQLite.

El servidor NUT enseñó una última lección: la primera versión enviaba un banner
`OK` en cuanto el cliente se conectaba. Home Assistant respondía con “Unexpected
response: OK”, porque el protocolo indica que el servidor no debe hablar antes
de recibir un comando. Eliminar ese banner resolvió la integración.

## Lo que quedó

Instrumentar el driver real fue más productivo que adivinar el protocolo. El
catálogo del fabricante se convirtió en documentación, el voltímetro pasó a ser
parte de la ingeniería inversa y el cumplimiento del protocolo NUT fue tan
importante como decodificar los registros.

El resultado es un proyecto abierto y de solo lectura que transforma un UPS
propietario en una fuente de telemetría utilizable desde el terminal y desde la
automatización del hogar.

---
title: "Reverse engineering de um no-break: do pacote Debian ao Home Assistant"
description: "Como transformei um monitor proprietário de no-break Ragtech em um projeto aberto, com protocolo documentado, CLI e integração NUT."
date: 2026-10-26
slug: reverse-engineering-no-break-ragtech
tags: [Engenharia reversa, Linux, Home Assistant, Projetos]
draft: false
lang: pt
translationKey: supervise-mon-ups-reverse-engineering
---

Meu no-break era uma caixa-preta. Um Ragtech Easy PRO, um equipamento brasileiro
bem construído, vinha acompanhado de uma suíte de monitoramento para Linux
distribuída apenas como binários. Não havia código-fonte nem documentação do
protocolo: apenas um arquivo `.deb` com daemons, bibliotecas compartilhadas,
uma interface web e um XML que acabou sendo a chave para todo o projeto.

Eu queria três coisas: telemetria ao vivo no Home Assistant, uma CLI que pudesse
ser automatizada e um protocolo que pudesse ser implementado em qualquer
linguagem. O resultado foi o [`supervise-mon`](https://github.com/guionardo/supervise-mon).

## O mapa escondido no XML

O pacote proprietário, Supervise 8.9.2, tinha símbolos preservados nos binários
ELF e nomes de classes bastante reveladores: `SerialHID`, `RagtechDevice`,
`DeviceManager` e `DeviceDetector`. Mas o detalhe decisivo estava em
`devices.xml`: 17 famílias de no-breaks, cada uma com ranges de memória,
apelidos de registradores, constantes de engenharia, fórmulas e ações.

O XML mostrou que o software era genérico. Os bytes carregavam os valores; o
catálogo definia o significado.

## Capturar antes de adivinhar

A análise estática forneceu pistas, mas não era suficiente para reconstruir os
bytes. Com o equipamento real conectado por USB CDC — Microchip `04D8:000A` —
executei o daemon do fabricante sob `strace` e capturei cerca de 11 MB de I/O
serial. Alinhar requisições e respostas revelou a gramática inteira:

```text
AA 04 <addrHi> <addrLo> <len> <crc>     crc = (hi + lo + len) & 0xFF
AA 04 00 80 1E 9E   → lê 30 bytes em 0x0080
AA 04 00 F3 01 F4   → lê 1 byte em 0x00F3
AA 04 FF E0 08 95   → handshake; o UPS responde com 12 34 56 78
```

Seis bytes por requisição, um checksum simples e telemetria organizada como
memória mapeada. Depois escrevi um probe independente e reproduzi as respostas
do driver byte a byte.

## Calibrar exige medir

O primeiro perfil produzia números plausíveis, mas errados: a tensão de entrada
aparecia como 61 V. Um voltímetro forneceu a referência: 230 V na entrada e na
saída, sob carga.

O equipamento foi identificado como **EASY 1200 M2**, modelo 7, família 10.
As escalas corrigidas produziram aproximadamente 226,8–230 V na entrada,
227,6 V na saída, 26,8 V na bateria e 59,9 Hz na frequência. A bateria de 24 V
aparecia carregada, com cerca de 100%.

## Uma leitura real

O resultado da CLI ficou deliberadamente simples:

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

Esses valores vieram de um equipamento real em `/dev/ttyACM0`, com tensão e
frequência comparadas ao voltímetro. O log também confirma a conexão somente
depois do handshake: `device connected: /dev/ttyACM0 (handshake ok)`.

## Do protocolo ao projeto

O `supervise-mon` separa transporte, frames, mapa de memória e snapshot
normalizado. O perfil do dispositivo fica em TOML, para que outra família possa
ser calibrada sem alterar o código principal. Adaptadores expõem os dados por
NUT, MQTT com descoberta do Home Assistant, Prometheus, REST e histórico SQLite.

O servidor NUT ensinou uma última lição: a primeira versão enviava um `OK` assim
que o cliente conectava. O Home Assistant respondia com “Unexpected response:
OK”, porque o protocolo determina que o servidor só deve falar depois de receber
um comando. Remover aquele banner resolveu a integração.

## O que ficou

Instrumentar o driver real foi mais produtivo do que adivinhar o protocolo.
O catálogo do fabricante funcionou como documentação, o voltímetro foi parte da
engenharia reversa e a conformidade com o protocolo NUT foi tão importante
quanto decodificar os registradores.

O resultado é um projeto aberto, somente leitura, que transforma um no-break
proprietário em uma fonte de telemetria utilizável no terminal e na automação
residencial.

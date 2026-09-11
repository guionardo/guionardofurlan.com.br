---
title: "git-sync-status: o que significa estar sincronizado?"
description: "Branches, commits e alterações locais são dimensões diferentes do estado de um repositório."
date: "2026-09-11"
slug: "git-sync-status-repositorio-sincronizado"
tags: ["Git", "Go", "ferramentas"]
draft: true
lang: "pt"
translationKey: "git-sync-status-introduction"
---

## Uma pergunta com mais de uma resposta

Ao alternar entre ambientes de desenvolvimento, dizer que um repositório
está “sincronizado” pode esconder situações distintas. A branch pode apontar
para o mesmo commit do remoto e ainda conter arquivos modificados localmente.

O git-sync-status organiza essa pergunta em estados de sincronização e
sinalizadores da árvore de trabalho. Seu escopo documentado cobre a branch
atual e, opcionalmente, outras branches locais que acompanham remotos.

## Commits e arquivos não contam a mesma história

O README distingue branch adiantada (`SYNC_PENDING`), atrasada (`LATE`) e
divergente (`DIVERGED`). Para `SYNCED`, exige tanto ausência de commits
exclusivos de cada lado quanto uma árvore de trabalho limpa.

Também trata separadamente a falta de remoto, a falta de upstream e estados
como `DETACHED_HEAD` ou `REMOTE_UNREACHABLE`. Falhar ao consultar o remoto
não deve ser confundido com confirmar que está tudo atualizado.

## Uma saída para pessoas e automações

A documentação apresenta uma interface de terminal, saída em texto e JSON.
Mostrar caminho, branch, upstream, contagens e sinalizadores permite entender
por que o diagnóstico foi produzido, em vez de depender apenas de uma cor.

Um exemplo didático para aprofundar o tema seria criar repositórios temporários
com alterações locais, commits pendentes e divergência. Os estados poderiam
ser comparados sem arriscar um projeto de trabalho.

Este texto se baseia no contrato descrito no README. Os cenários ainda precisam
ser executados para transformar a apresentação em um tutorial verificado.

## Fonte

[README — git-sync-status](https://github.com/guionardo/git-sync-status/blob/49c0c8d8dcae78646e9e15ec046a0c9fa6c6984c/README.md).

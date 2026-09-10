---
title: 'gs-dev: um assistente para o trabalho no terminal'
description: 'Como uma CLI reúne navegação entre projetos, informações Git e compartilhamento temporário de texto.'
date: 2026-09-10
slug: gs-dev-assistente-terminal
tags: [Go, CLI, produtividade]
draft: true
lang: pt
translationKey: gs-dev-assistente-terminal
---

Alternar entre repositórios envolve pequenas tarefas recorrentes: encontrar uma
pasta, abrir o remoto no navegador ou consultar mudanças no histórico. O
[gs-dev](https://github.com/guionardo/gs-dev) reúne essas operações em um
assistente de desenvolvimento no terminal.

## Encontrar o projeto é parte do trabalho

O grupo `dev` organiza o acesso às pastas de desenvolvimento. A documentação
gerada da CLI apresenta subcomandos para cadastrar raízes, sincronizar o
inventário, listar diretórios e procurar projetos:

```bash
gs-dev dev --help
```

O README descreve detecção por arquivos de manifesto para Go, Python,
JavaScript, Rust, Java, PHP e .NET. Isso permite organizar a navegação em torno
dos projetos, em vez de depender apenas da memória dos caminhos.

## Uma CLI que conversa com o shell

Mudar o diretório do shell exige integração além de executar um programa.
O gs-dev documenta funções de shell para `dev`, `fav` e `pad`, além de um
mecanismo que entrega comandos ao shell por um arquivo temporário.

A instalação dessas funções altera o perfil de Bash ou Zsh. Vale distinguir
esse passo da instalação do binário: disponibilizar o executável e integrar
seus comandos ao ambiente são operações diferentes.

## Git e texto compartilhado

A ferramenta também oferece estatísticas de commits e acesso à URL do remoto:

```bash
gs-dev git-stats --help
gs-dev url --just-show
```

Outro componente é o serviço pad via gRPC, destinado a trechos de texto
temporários. O README descreve expiração configurável e autenticação por chave
de API. É uma capacidade separada da navegação de diretórios e depende de
um servidor pad configurado.

## O que vale explorar

O gs-dev oferece um exemplo de como reunir tarefas pequenas em uma ferramenta
coesa. Um próximo experimento pode comparar a navegação habitual com o fluxo
assistido em um conjunto real de repositórios. Ainda não há medições neste
artigo: o ganho precisa ser observado, não presumido.

## Fontes

- [README do gs-dev](https://github.com/guionardo/gs-dev/blob/629d4020ceb28abfe276e08dedaa944a50465541/README.md).
- [Referência do grupo dev](https://github.com/guionardo/gs-dev/blob/629d4020ceb28abfe276e08dedaa944a50465541/docs/gs-dev_dev.md).

<!-- Revisão editorial: comandos não executados neste levantamento. Confirmar
exemplos na versão escolhida e definir a data de publicação antes de publicar
ambos os idiomas. A referência gerada usa `gs-dev dev`; o README contém
exemplos abreviados sem esse nível. -->

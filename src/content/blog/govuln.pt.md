---
title: 'GoVuln: análise de vulnerabilidades no fluxo de desenvolvimento'
description: 'Uma introdução ao wrapper de govulncheck e à sua integração com pre-commit em projetos Go.'
date: 2026-09-10
slug: govuln-vulnerabilidades-fluxo-desenvolvimento
tags: [Go, segurança, automação]
draft: true
lang: pt
translationKey: govuln-fluxo-desenvolvimento
---

Uma verificação de vulnerabilidades precisa encontrar espaço no trabalho
cotidiano. O [GoVuln](https://github.com/guionardo/govuln) aborda essa integração
como um wrapper do `govulncheck`, acrescentando recursos de organização da
execução e apresentação dos resultados.

## Aproximar a análise do commit

O manifesto de hooks do repositório define `go-vulncheck`, com entrada `govuln`
e suporte aos estágios `pre-commit`, `pre-push` e `manual`.
Ele também declara `pass_filenames: false` e `always_run: true`: o hook não
recebe a lista de arquivos modificados e está configurado para rodar mesmo
sem arquivos correspondentes.

Isso posiciona a verificação como uma operação sobre o projeto. É diferente
de um formatador que recebe apenas os arquivos selecionados para o commit.
O estágio efetivamente usado depende da configuração do pre-commit no projeto.

## O papel do wrapper

Segundo o README, o GoVuln adiciona cache, análise de dependências internas e
submódulos, execução concorrente e relatórios em tabela ou Markdown. O motor
de análise continua sendo o `govulncheck`; a proposta do wrapper é organizar
seu uso no fluxo de desenvolvimento.

O cache traz uma decisão operacional importante: reutilizar um resultado
reduz trabalho repetido, mas não equivale a realizar uma análise nova.
A documentação descreve uma duração de 24 horas. Antes de incorporar esse
comportamento a uma política de CI, convém validar a invalidação do cache e
as condições que exigem uma execução atualizada.

## Documentação também precisa ser verificada

Na revisão do repositório, os exemplos do README apresentam URLs com
`github.com` duplicado e referências diferentes para o modo de aviso. O
manifesto consultado declara apenas o hook `go-vulncheck`.

Por isso, um tutorial reproduzível precisa fixar uma revisão e conferir seus
comandos e opções, em vez de copiar indiscriminadamente exemplos de versões
diferentes. Este artigo apresenta a estrutura documentada; não relata uma
execução da ferramenta nem resultados de uma varredura.

## Próximo experimento

Um passo útil é testar a integração em um projeto Go controlado, registrando
a versão utilizada, o resultado sem cache, o comportamento com cache e o
código de saída do hook. Esse experimento pode fundamentar a decisão de onde
executar a análise e como tratar seus resultados.

## Fontes

- [README do GoVuln](https://github.com/guionardo/govuln/blob/2d6c89d4ce224449925c8c2c023029624e352217/README.md).
- [Manifesto de hooks](https://github.com/guionardo/govuln/blob/2d6c89d4ce224449925c8c2c023029624e352217/.pre-commit-hooks.yaml).

<!-- Revisão editorial: validar instalação, opções de CLI e comportamento do
cache em execução antes de ampliar para tutorial. Definir data de publicação
e revisar o par PT/EN. Não modificar o repositório externo nesta tarefa. -->

---
title: 'Criando GIFs animados a partir do terminal'
description: 'Como gravar uma sessão de terminal com asciinema e convertê-la em um GIF animado usando agg.'
date: 2022-08-19
slug: gifs-animados-do-terminal
tags: [terminal, gif, linux]
draft: false
lang: pt
translationKey: terminal-animated-gifs
---

## O problema

Eu precisava gerar vídeos curtos para demonstrar aplicações de console. Uma captura de tela tradicional é trabalhosa e costuma gerar arquivos maiores do que o necessário para esse tipo de exemplo.

Este texto é uma atualização revisada do artigo original [Creating animated gifs from your terminal](https://dev.to/guionardo/creating-animated-gifs-from-your-terminal-3oo5), publicado em 2022. Os comandos foram conferidos com a documentação atual do `asciinema` e do `agg`.

O artigo original também usava este pato dançante como uma demonstração visual. O GIF é de terceiros e está incluído com atribuição à [coleção de GIFs de patos dançantes do USAGIF](https://usagif.com/dancing-duck-gifs-shuba-duck-and-others/):

![GIF de um pato dançando](/images/gifs-animados-do-terminal/dancing-duck.gif)

## O fluxo

O processo tem duas etapas:

1. gravar a sessão do terminal em um arquivo `.cast` com `asciinema`;
2. renderizar a gravação como GIF com `agg`.

O arquivo `.cast` registra eventos do terminal, em vez de capturar cada pixel da tela. Isso costuma produzir uma gravação leve e permite que o renderizador escolha fonte, tema e tamanho depois.

## Instalando o asciinema

O `asciinema` está disponível nos repositórios de Debian e Ubuntu:

```bash
sudo apt update
sudo apt install asciinema
```

Também existem binários oficiais e outras opções de instalação na [documentação do asciinema](https://docs.asciinema.org/manual/cli/).

Confira a instalação:

```bash
asciinema --version
```

## Gravando uma sessão

Inicie a gravação em um arquivo local:

```bash
asciinema rec first.cast
```

Execute os comandos que deseja demonstrar normalmente. Para terminar, pressione `Ctrl+D` ou execute `exit`.

Antes de compartilhar o arquivo, revise a gravação. Tudo que aparecer no terminal pode ser capturado, incluindo senhas digitadas, tokens, caminhos privados, nomes de hosts e dados de configuração.

## Instalando o agg

`agg` é o gerador de GIFs do projeto asciinema. A opção mais simples é baixar um binário compatível na [página de releases do agg](https://github.com/asciinema/agg/releases), torná-lo executável e colocá-lo em um diretório do `PATH`.

Quem já usa Rust pode compilar e instalar a versão atual diretamente do repositório:

```bash
cargo install --git https://github.com/asciinema/agg
```

Esse caminho requer Rust e Cargo compatíveis com a versão atual do projeto. Depois, confirme:

```bash
agg --version
```

O projeto também publica uma imagem OCI oficial para uso com Docker ou Podman. Ela é útil quando você não quer instalar o toolchain Rust no host; os exemplos estão na [documentação de instalação do agg](https://docs.asciinema.org/manual/agg/installation/).

## Gerando o GIF

Com `first.cast` e `agg` disponíveis no `PATH`:

```bash
agg first.cast first.gif
```

Este é um exemplo de GIF gerado a partir de uma sessão gravada:

![GIF animado de uma sessão do terminal convertida com agg](/images/gifs-animados-do-terminal/first.gif)

Para escolher uma fonte instalada e um diretório adicional de fontes:

```bash
agg --font-dir ./fonts --font-family 'JetBrains Mono' first.cast first.gif
```

O `agg` atual também permite selecionar temas, controlar o tamanho da fonte, ajustar a velocidade e renderizar somente um trecho. Consulte `agg --help` ou a [documentação de uso do agg](https://docs.asciinema.org/manual/agg/usage/) para essas opções.

Também é possível converter uma gravação publicada diretamente a partir de uma URL:

```bash
agg https://asciinema.org/a/569727 demo.gif
```

## Alternativa sem baixar o cast manualmente

O arquivo de gravação continua sendo útil como fonte editável e reprodutível. Guarde o `.cast` junto do projeto quando quiser regenerar o GIF com outra fonte, tema ou velocidade.

Para uma demonstração pública, porém, o fluxo mais simples é compartilhar o GIF gerado ou a gravação do asciinema, conforme a finalidade do material.

## Limites do formato

GIF é conveniente para incorporar em páginas e issues, mas não é um formato eficiente para vídeos longos. A paleta de cores é limitada e o arquivo pode crescer bastante quando a sessão tem muitas mudanças visuais.

Para gravações extensas ou com áudio, um vídeo tradicional pode ser mais apropriado. Para exemplos curtos de comandos, o par `.cast` + GIF costuma ser suficiente.

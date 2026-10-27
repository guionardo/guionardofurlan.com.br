---
title: 'Usando e-mail local como ferramenta de notificação'
description: 'Como usar o e-mail local do Linux para guardar notificações de cron e scripts sem depender de uma interface gráfica.'
date: 2022-05-04
slug: email-local-como-notificacao
tags: [linux, terminal, notificacoes]
draft: false
lang: pt
translationKey: local-mail-notifications
---

## O problema

Eu executo comandos e desenvolvo no terminal Linux, além de manter tarefas agendadas em segundo plano. Nem sempre preciso de uma notificação gráfica; muitas vezes só quero saber que um processo terminou ou que uma tarefa encontrou um erro.

Uma alternativa simples é usar a caixa de e-mail local do próprio sistema como repositório dessas mensagens.

Este texto é uma atualização revisada do artigo original [Using local mail as notification tool](https://dev.to/guionardo/using-local-mail-as-notification-tool-47k2), publicado em 2022. Os exemplos foram comparados com um setup real em Debian 13.

## O que continua válido

Quando um job do cron produz saída e não define `MAILTO` vazio, o cron pode enviar essa saída para o proprietário da crontab ou para o destinatário configurado em `MAILTO`.

Esse comportamento é diferente de enviar mensagens pela Internet. Aqui, o Postfix entrega a mensagem localmente, em uma caixa mbox como `/var/mail/<usuário>`, e o Mutt funciona como leitor no terminal.

Este guia foi validado em Debian 13. O mesmo modelo também se aplica ao Ubuntu, mas os nomes dos pacotes e os comandos de `mail` podem variar entre distribuições.

## Instalação

No ambiente de referência, uso o `bsd-mailx` para enviar mensagens, o Postfix como MTA local e o Mutt para ler a caixa:

```bash
sudo apt update
sudo apt install postfix bsd-mailx mutt
```

Durante a configuração do Postfix, escolha o modo local quando ele estiver disponível. O objetivo é aceitar e entregar mensagens no próprio host, não transformar a máquina em servidor de e-mail público.

Confira os comandos disponíveis:

```bash
command -v mail mailx mutt
```

Implementações diferentes de `mail` e `mailx` não aceitam exatamente as mesmas opções. No exemplo abaixo uso a sintaxe curta `-s`, compatível com o `bsd-mailx` instalado no servidor.

No Debian 13, o Mutt pode usar `/var/tmp` para seus arquivos temporários. Se esse diretório estiver restrito ao `root`, o Mutt abre a caixa, mas falha ao exibir uma mensagem com `Não foi possível criar um arquivo temporário!`. Nesse caso, use um diretório temporário gravável pelo usuário:

```bash
export TMPDIR=/tmp
mutt -D | grep '^tmpdir='
```

O comando deve mostrar `tmpdir="/tmp"`. Para tornar a configuração permanente apenas para o usuário atual, também é possível adicionar `set tmpdir="/tmp"` ao `~/.muttrc`.

## Testando a caixa local

Envie uma mensagem para o usuário atual:

```bash
printf '%s\n' 'This is a test' | mail -s 'Test email' "$USER@localhost"
```

Depois, abra o leitor:

```bash
mutt
```

## Mostrando mensagens não lidas no prompt

No Bash, um pequeno hook pode consultar a caixa periodicamente e mostrar um aviso no prompt. O exemplo usa a saída do `bsd-mailx`, que marca mensagens novas ou não lidas com `N` ou `U`:

```bash
MAIL_CHECK_TIME=0

mail_prompt() {
    local mail_interval=${MAILCHECK:-60}
    local elapsed=$((SECONDS - MAIL_CHECK_TIME))

    if [[ "$MAIL_CHECK_TIME" -eq 0 || "$elapsed" -gt "$mail_interval" ]]; then
        local count
        count=$(printf 'q\n' | mail -u "$USER" 2>/dev/null \
            | awk '/^[[:space:]]*[NU][[:space:]]+[0-9]+/ { count++ } END { print count + 0 }')

        if [[ "$count" -gt 0 ]]; then
            local word='message'
            [[ "$count" -gt 1 ]] && word='messages'
            echo "$count unread $word. Run mutt"
        fi

        MAIL_CHECK_TIME=$SECONDS
    fi
}

if command -v mail >/dev/null 2>&1; then
    PROMPT_COMMAND="mail_prompt${PROMPT_COMMAND:+;$PROMPT_COMMAND}"
fi
```

Salve o trecho, por exemplo, em `~/.mail_prompt`, e carregue-o no `~/.bashrc`:

```bash
source "$HOME/.mail_prompt"
```

Esse contador é deliberadamente específico para `bsd-mailx` e Bash. Outras implementações de `mail` podem formatar os headers de outra maneira; nesse caso, a regra do `awk` precisa ser testada novamente.

O Postfix entrega a mensagem na caixa local, normalmente em `/var/mail/$USER`. O caminho pode ser confirmado com:

```bash
postconf mail_spool_directory
```

No ambiente que usei, a caixa pertence diretamente ao usuário e não é necessário adicioná-lo ao grupo `mail`.

## Usando com cron

Uma crontab pode enviar a saída de uma tarefa para a caixa local:

```text
MAILTO=guionardo

*/15 * * * * /home/guionardo/bin/check-backups
```

Se o comando escrever no `stdout` ou no `stderr`, o cron encaminha essa saída como mensagem. Para testar sem esperar o agendamento:

```bash
/home/guionardo/bin/check-backups
```

Depois, abra o Mutt e confira a nova mensagem.

Se a tarefa for executada por um script próprio, também é possível enviar uma mensagem explicitamente:

```bash
if ! /home/guionardo/bin/check-backups; then
    printf '%s\n' 'A verificação de backups falhou.' \
        | mail -s 'Falha no backup' "$USER@localhost"
fi
```

## Configuração local e segurança

Para uma caixa local, verifique se o Postfix está limitado ao loopback e se a rede autorizada contém apenas o próprio host:

```bash
postconf inet_interfaces mynetworks mydestination relayhost
```

Uma configuração local típica inclui `loopback-only` em `inet_interfaces`, endereços de loopback em `mynetworks`, o próprio host em `mydestination` e nenhum `relayhost` externo.

Não copie uma configuração de servidor de e-mail completo para este caso. Um Postfix exposto ou configurado para aceitar relay de outras redes pode transformar uma ferramenta local em um problema de abuso de e-mail.

## Diagnóstico

Quando uma mensagem não aparece, confira:

```bash
postfix check
journalctl -u postfix --since '10 minutes ago'
ls -l /var/mail/"$USER"
mutt -D | grep '^tmpdir='
```

Também vale lembrar que uma tarefa silenciosa não gera uma mensagem automática do cron. Se não houver saída, use uma chamada explícita a `mail` ou registre uma mensagem de erro.

## Limites desta abordagem

O e-mail local é ótimo para notificações de uma máquina: tarefas de backup, scripts de manutenção e processos demorados. Ele não substitui um serviço de alertas quando a máquina pode ficar indisponível, nem oferece histórico centralizado, entrega para celular ou garantia de recebimento externo.

As regras de `MAILTO` do cron estão documentadas no [manual do crontab do Ubuntu](https://manpages.ubuntu.com/manpages/noble/man5/crontab.5.html). O [manual básico do Postfix](https://www.postfix.org/BASIC_CONFIGURATION_README.html) explica as decisões de relay e entrega local, e o [manual do GNU Mailutils](https://mailutils.org/manual/html_section/mail.html) documenta outra implementação do comando `mail`.

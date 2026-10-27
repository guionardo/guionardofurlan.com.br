---
title: 'Using local mail as a notification tool'
description: 'How to use a Linux host local mailbox to keep cron and script notifications without depending on a graphical interface.'
date: 2022-05-04
slug: local-mail-as-notification
tags: [linux, terminal, notifications]
draft: false
lang: en
translationKey: local-mail-notifications
---

## The problem

I run commands and develop in a Linux terminal, and I also have scheduled tasks running in the background. I do not always need a graphical notification; often I only need to know that a process finished or that a task found an error.

A simple alternative is to use the host's local mailbox as a repository for those messages.

This is a reviewed update of the original article [Using local mail as notification tool](https://dev.to/guionardo/using-local-mail-as-notification-tool-47k2), published in 2022. The examples were compared with a real Debian 13 setup.

## What still holds

When a cron job produces output and does not set `MAILTO` to an empty value, cron can send that output to the crontab owner or to the recipient configured in `MAILTO`.

This is different from sending messages over the Internet. Here, Postfix delivers the message locally, into an mbox such as `/var/mail/<user>`, and Mutt works as a terminal mail reader.

This guide was validated on Debian 13. The same model also applies to Ubuntu, but package names and `mail` command options can differ between distributions.

## Installation

In the reference environment, I use `bsd-mailx` to send messages, Postfix as the local MTA, and Mutt to read the mailbox:

```bash
sudo apt update
sudo apt install postfix bsd-mailx mutt
```

During Postfix setup, choose the local-only mode when it is available. The goal is to accept and deliver messages on the host itself, not to turn the machine into a public mail server.

Check which commands are available:

```bash
command -v mail mailx mutt
```

Different `mail` and `mailx` implementations do not accept exactly the same options. The example below uses the short `-s` form, which works with the `bsd-mailx` installed on the server.

On Debian 13, Mutt may use `/var/tmp` for its temporary files. If that directory is restricted to `root`, Mutt can open the mailbox but fail when displaying a message with `Could not create temporary file!`. In that case, use a temporary directory writable by the user:

```bash
export TMPDIR=/tmp
mutt -D | grep '^tmpdir='
```

The command should show `tmpdir="/tmp"`. To make this permanent for the current user, you can also add `set tmpdir="/tmp"` to `~/.muttrc`.

## Testing the local mailbox

Send a message to the current user:

```bash
printf '%s\n' 'This is a test' | mail -s 'Test email' "$USER@localhost"
```

Then open the reader:

```bash
mutt
```

## Showing unread messages in the prompt

In Bash, a small hook can check the mailbox periodically and show a warning in the prompt. This example uses `bsd-mailx` output, which marks new or unread messages with `N` or `U`:

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

Save the snippet, for example, as `~/.mail_prompt`, and load it from `~/.bashrc`:

```bash
source "$HOME/.mail_prompt"
```

This counter is deliberately specific to `bsd-mailx` and Bash. Other `mail` implementations may format headers differently; in that case, test the `awk` rule again.

Postfix delivers the message to the local mailbox, usually `/var/mail/$USER`. You can confirm the path with:

```bash
postconf mail_spool_directory
```

In the environment I used, the mailbox belongs directly to the user, so adding the user to the `mail` group is not necessary.

## Using it with cron

A crontab can send a task's output to the local mailbox:

```text
MAILTO=guionardo

*/15 * * * * /home/guionardo/bin/check-backups
```

If the command writes to `stdout` or `stderr`, cron forwards that output as a message. To test without waiting for the schedule:

```bash
/home/guionardo/bin/check-backups
```

Then open Mutt and check for the new message.

If a task is run by a custom script, it can also send a message explicitly:

```bash
if ! /home/guionardo/bin/check-backups; then
    printf '%s\n' 'The backup check failed.' \
        | mail -s 'Backup failure' "$USER@localhost"
fi
```

## Local configuration and security

For a local mailbox, check that Postfix is limited to loopback and that the authorized network contains only the host itself:

```bash
postconf inet_interfaces mynetworks mydestination relayhost
```

A typical local configuration uses `loopback-only` for `inet_interfaces`, loopback addresses in `mynetworks`, the host itself in `mydestination`, and no external `relayhost`.

Do not copy a full mail-server configuration into this use case. An exposed Postfix instance, or one configured to relay for other networks, can turn a local tool into an email abuse problem.

## Troubleshooting

When a message does not appear, check:

```bash
postfix check
journalctl -u postfix --since '10 minutes ago'
ls -l /var/mail/"$USER"
mutt -D | grep '^tmpdir='
```

Also remember that a silent task does not generate an automatic cron message. If there is no output, use an explicit `mail` call or log an error message.

## Limits of this approach

Local mail is useful for notifications on one machine: backup jobs, maintenance scripts, and long-running processes. It does not replace an alerting service when the machine may be unavailable, nor does it provide centralized history, mobile delivery, or guaranteed external receipt.

The cron `MAILTO` rules are documented in the [Ubuntu crontab manual](https://manpages.ubuntu.com/manpages/noble/man5/crontab.5.html). The [Postfix basic configuration guide](https://www.postfix.org/BASIC_CONFIGURATION_README.html) explains relay and local-delivery decisions, and the [GNU Mailutils manual](https://mailutils.org/manual/html_section/mail.html) documents another implementation of the `mail` command.

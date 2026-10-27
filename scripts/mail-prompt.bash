#!/usr/bin/env bash

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

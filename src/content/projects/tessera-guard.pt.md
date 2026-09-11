---
title: "Tessera Guard: licenciamento e observabilidade para software de desktop"
lang: pt
---

## O problema

Distribuir um software de desktop não encerra o trabalho de quem o desenvolve.
Depois da instalação, surgem outras perguntas: quais versões estão em uso?
Como uma licença é ativada ou revogada? O que aconteceu quando uma aplicação
parou de funcionar na máquina de um cliente?

Uma verificação de chave no instalador cobre apenas parte desse ciclo.
Construir um backend próprio amplia o controle, mas também acrescenta
infraestrutura e serviços para manter.

O **Tessera Guard** é um projeto em desenvolvimento que propõe reunir
licenciamento, controle de execução e observabilidade em um serviço gerenciado.
A primeira versão de teste está sendo preparada.

## Como a plataforma está organizada

A arquitetura tem dois componentes principais:

- **Guardian:** agente instalado na máquina do cliente, responsável pela
  validação de licenças, inicialização da aplicação como processo filho,
  captura da saída e envio de telemetria. Seu escopo inclui ativação,
  sinais periódicos de atividade (heartbeats), revogação e renovação.
- **Tessera Guard Cloud:** backend e painel para administrar clientes,
  contratos, licenças, versões e usuários. A arquitetura prevê PostgreSQL,
  VictoriaMetrics para métricas e VictoriaLogs para logs.

O Guardian faz a ponte entre a aplicação e a plataforma. A intenção é
concentrar nele parte do trabalho de integração. O esforço necessário e os
limites dessa abordagem precisam ser validados para cada aplicação.

## Recursos previstos para a versão de teste

### Licenciamento

O escopo inclui licenças vinculadas à máquina, licenças por usuário e um pool
dinâmico de licenças, além de geração de chaves de ativação, revogação e
períodos de graça.

### Sessões, métricas e logs

A proposta é acompanhar sessões e heartbeats, consultar métricas de CPU e
memória e relacionar logs à execução de uma aplicação. O painel deve permitir
investigar uma licença e detalhar suas sessões.

### Versões e atualizações

A gestão de releases e a distribuição de atualizações pelo Guardian fazem
parte do escopo. O objetivo é reduzir etapas manuais no acompanhamento das
versões instaladas nos clientes.

### Alertas

Estão previstos canais por e-mail, webhooks, notificações no aplicativo e
ntfy, para situações como licenças próximas do vencimento ou sinais de
problemas nas execuções monitoradas.

### Controles de segurança

O projeto prevê proteção da configuração do Guardian com XChaCha20-Poly1305
e derivação de chave com Argon2id, autenticação com JWT, controle de acesso
por papéis e permissões e registros de auditoria. Esses mecanismos fazem
parte do desenho técnico; não representam, por si só, garantia de proteção
contra qualquer forma de uso indevido.

## Para quem

- Fornecedores de software de desktop e embarcado que precisam administrar
  licenças e acompanhar aplicações distribuídas.
- Equipes de produto que precisam investigar versões, sessões e condições
  de execução nas máquinas dos clientes.
- Desenvolvedores independentes que preferem integrar um serviço de
  licenciamento a manter toda essa infraestrutura.

## Estado atual e próximos passos

A versão de teste está em desenvolvimento. O modelo proposto é de serviço
gerenciado, com a operação do backend concentrada na plataforma.

Os testes devem ajudar a validar a integração do Guardian, o ciclo de vida
das licenças e a utilidade da telemetria na investigação de problemas.
Compatibilidade, disponibilidade e capacidade de operação precisam ser
avaliadas nessa etapa; não há uma data de lançamento anunciada aqui.

A proposta é tornar mais simples acompanhar o que acontece com uma aplicação
depois que ela sai do ambiente de desenvolvimento.

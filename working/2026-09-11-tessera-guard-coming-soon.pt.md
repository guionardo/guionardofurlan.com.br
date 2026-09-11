# Em breve: Tessera Guard — uma plataforma hospedada de licenciamento para software de desktop

Se você vende software de desktop, já conhece a rotina: você entrega um ótimo produto e, depois, passa noites se preocupando com licenças quebradas, uso não contabilizado e clientes rodando versões desatualizadas sem que você fique sabendo.

**Tessera Guard** é uma plataforma hospedada de licenciamento e controle de execução para fornecedores de software — um agente Guardian em cada máquina do usuário, um backend em nuvem totalmente gerenciado e um painel de gestão que transforma o "espero que esteja tudo certo" em "sei exatamente o que está rodando, onde e quão saudável está".

Estamos nos últimos ajustes da primeira versão de teste agora e queremos apresentar a plataforma antes de abri-la ao público.

## O problema que o Tessera Guard resolve

A maior parte do licenciamento de software de desktop cai em dois grupos dolorosos:

- **Licenciamento "faça você mesmo"** — uma verificação de chave de licença escondida no instalador. Isso mantém as pessoas honestas, mas não faz nada contra a pirataria de verdade, não diz nada sobre o uso no mundo real e torna as atualizações um processo manual e arriscado.
- **Backends de licenciamento construídos internamente** — poderosos no papel, mas agora *você* é dono de um segundo produto: servidores para operar, bancos de dados para manter atualizados, disponibilidade para defender. Isso vira, silenciosamente, um imposto permanente sobre a sua equipe.

O Tessera Guard é o caminho do meio que funciona de verdade: **uma plataforma de licenciamento com recursos de nível empresarial, entregue como serviço gerenciado, para você nunca precisar tocar na infraestrutura.**

## Como funciona

O Tessera Guard tem duas partes:

**Guardian** — um pequeno agente instalado nas máquinas dos seus clientes. Ele valida licenças, inicia o seu programa como processo filho protegido, captura a saída e envia telemetria para a plataforma. Ele cuida dos detalhes trabalhosos do ciclo de vida — ativação, heartbeat, revogação, renovação — para que o seu código de aplicação continue limpo.

**Tessera Guard Cloud** — o backend gerenciado que operamos. Ele gerencia seus clientes, contratos, licenças, versões e usuários por meio de um painel de gestão, e armazena tudo em infraestrutura reforçada (PostgreSQL, VictoriaMetrics para métricas, VictoriaLogs para logs). **Você gerencia seus produtos; nós operamos a plataforma.**

Seu aplicativo licenciado conversa com o Guardian, o Guardian conversa com a nuvem — e **nada no código do seu produto precisa mudar** para ter licenciamento e observabilidade completos.

## Recursos que a versão de teste vai incluir

### Licenciamento que se adapta ao seu modelo de negócio
Nem todo produto é "uma chave, uma máquina". O Tessera Guard suporta vários modelos de licenciamento — vinculado à máquina, por usuário e pool dinâmico — para você vender do jeito que seus clientes querem comprar. As chaves de ativação são geradas no próprio sistema, e a revogação (inclusive com períodos de graça) é tratada automaticamente.

### Visibilidade ao vivo de cada implantação
Toda máquina licenciada envia heartbeats, rastreamento de sessões, métricas de CPU/memória e logs. No painel, você vê a linha do tempo de sessões de uma licença, analisa métricas por sessão e abre logs e métricas brutos de qualquer licença — até o nível de uma única sessão.

### Atualizações remotas e gestão de versões
Gerencie versões pelo painel e mantenha cada cliente implantado em sincronia por meio do Guardian — chega de implorar para o usuário instalar a atualização #14 manualmente.

### Alertas que encontram problemas antes dos seus clientes
Alertas integrados por e-mail, webhooks, no aplicativo e ntfy — para que comportamento incomum, licenças prestes a expirar ou implantações não saudáveis acionem as pessoas certas automaticamente.

### Segurança incorporada desde o primeiro dia
O Guardian protege a própria configuração com criptografia XChaCha20-Poly1305 e derivação de chave Argon2id, autentica com JWT, e toda ação de gestão é controlada por papéis e permissões — com log de auditoria à altura.

### Um serviço gerenciado, não um segundo produto
Sem servidores para provisionar, sem bancos de dados para operar, sem upgrades para agendar. A plataforma está sempre atualizada, sempre disponível e escala com a sua base de usuários.

## Para quem é o Tessera Guard

- **Fornecedores de software de desktop e embarcado** que querem licenciamento de verdade sem precisar construir ou operar a própria solução.
- **Equipes de produto** que precisam de visibilidade de uso e saúde em milhares de máquinas de clientes.
- **Desenvolvedores independentes** que querem uma história profissional de licenciamento — sem contratar uma equipe de plataforma.

## O que vem a seguir

A versão de teste está em desenvolvimento ativo e vamos abri-la para um primeiro grupo de usuários em breve. Se licenciamento e visibilidade de implantação para software de desktop soa como um problema que você tem, entre na lista e avisaremos assim que estiver pronto.

**Entre na lista de espera** — tenha acesso antecipado à versão de teste e veja suas implantações do jeito que seus clientes as experimentam.

Licencie seu software direito — e volte a construir os recursos que tornaram seu produto digno de ser protegido.
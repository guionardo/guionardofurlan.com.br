# Próximamente: Tessera Guard — una plataforma de licenciamiento alojada para software de escritorio

Si vendes software de escritorio, ya conoces la rutina: entregas un gran producto y luego pasas las noches preocupándote por licencias pirateadas, usos sin contabilizar y clientes que ejecutan versiones desactualizadas sin que te enteres.

**Tessera Guard** es una plataforma de licenciamiento y control de ejecución alojada para proveedores de software: un agente Guardian en cada máquina del usuario, un backend en la nube totalmente gestionado y un panel de administración que convierte el "espero que todo esté bien" en "sé exactamente qué se está ejecutando, dónde y qué tan saludable está".

Estamos terminando los últimos ajustes de la primera versión de prueba y queremos presentar la plataforma antes de abrirla al público.

## El problema que resuelve Tessera Guard

La mayor parte del licenciamiento de software de escritorio cae en dos bandos dolorosos:

- **Licenciamiento "hágalo usted mismo"** — una verificación de clave de licencia escondida en el instalador. Mantiene honesta a la gente honesta, pero no hace nada contra la piratería real, no dice nada sobre el uso en el mundo real y convierte las actualizaciones en un proceso manual y arriesgado.
- **Backends de licenciamiento propios** — poderosos en el papel, pero ahora *tú* eres dueño de un segundo producto: servidores que operar, bases de datos que mantener actualizadas, disponibilidad que defender. Se convierte, silenciosamente, en un impuesto permanente para tu equipo.

Tessera Guard es el camino intermedio que sí funciona: **una plataforma de licenciamiento con capacidades de nivel empresarial, entregada como servicio gestionado para que nunca tengas que tocar la infraestructura.**

## Cómo funciona

Tessera Guard tiene dos partes:

**Guardian** — un pequeño agente instalado en las máquinas de tus clientes. Valida licencias, inicia tu programa como proceso hijo protegido, captura su salida y envía telemetría a la plataforma. Se encarga de los detalles tediosos del ciclo de vida — activación, heartbeat, revocación, renovación — para que tu código de aplicación se mantenga limpio.

**Tessera Guard Cloud** — el backend gestionado que operamos. Administra tus clientes, contratos, licencias, versiones y usuarios a través de un panel de administración, y almacena todo en infraestructura reforzada (PostgreSQL, VictoriaMetrics para métricas, VictoriaLogs para logs). **Tú gestionas tus productos; nosotros operamos la plataforma.**

Tu aplicación licenciada habla con el Guardian, el Guardian habla con la nube — y **nada en el código de tu producto necesita cambiar** para tener licenciamiento y observabilidad completos.

## Funciones que incluirá la versión de prueba

### Licenciamiento que se adapta a tu modelo de negocio
No todos los productos son "una clave, una máquina". Tessera Guard admite varios modelos de licenciamiento — vinculado a la máquina, por usuario y pool dinámico — para que vendas de la manera en que tus clientes quieren comprar. Las claves de activación se generan dentro de la aplicación, y la revocación (incluidos los períodos de gracia) se gestiona automáticamente.

### Visibilidad en vivo de cada implementación
Cada máquina licenciada informa con heartbeats, seguimiento de sesiones, métricas de CPU/memoria y logs. En el panel puedes ver la línea de tiempo de sesiones de una licencia, profundizar en las métricas por sesión y abrir logs y métricas sin procesar de cualquier licencia — hasta el nivel de una sola sesión.

### Actualizaciones remotas y gestión de versiones
Gestiona las versiones desde el panel y mantén sincronizados a todos tus clientes a través del Guardian — se acabó rogarle al usuario que instale la actualización #14 manualmente.

### Alertas que encuentran problemas antes que tus clientes
Alertas integradas por correo electrónico, webhooks, dentro de la aplicación y ntfy — para que los comportamientos inusuales, las licencias por expirar o las implementaciones poco saludables avisen automáticamente a las personas adecuadas.

### Seguridad incorporada desde el primer día
El Guardian protege su propia configuración con cifrado XChaCha20-Poly1305 y derivación de clave Argon2id, se autentica con JWT, y cada acción de administración está controlada por roles y permisos — con un registro de auditoría a la altura.

### Un servicio gestionado, no un segundo producto
Sin servidores que aprovisionar, sin bases de datos que operar, sin actualizaciones que programar. La plataforma está siempre actualizada, siempre disponible y escala con tu base de usuarios.

## Para quién es Tessera Guard

- **Proveedores de software de escritorio y embebido** que quieren licenciamiento real sin tener que construirlo u operarlo ellos mismos.
- **Equipos de producto** que necesitan visibilidad de uso y salud en miles de máquinas de clientes.
- **Desarrolladores independientes** que quieren una historia profesional de licenciamiento — sin contratar un equipo de plataforma.

## Qué sigue

La versión de prueba está en desarrollo activo y pronto la abriremos a un primer grupo de usuarios. Si el licenciamiento y la visibilidad de implementación para software de escritorio te suenan a un problema que tienes, únete a la lista y te avisaremos en cuanto esté lista.

**Únete a la lista de espera** — obtén acceso anticipado a la versión de prueba y ve tus implementaciones de la manera en que tus clientes las experimentan.

Licencia tu software correctamente — y vuelve a construir las funciones que hicieron que tu producto valga la pena proteger.
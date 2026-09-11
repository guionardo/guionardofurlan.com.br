---
title: "Tessera Guard: licenciamiento y observabilidad para software de escritorio"
lang: es
---

## El problema

Distribuir software de escritorio no termina el trabajo de quien lo
desarrolla. Después de la instalación surgen otras preguntas: ¿qué versiones
están en uso? ¿Cómo se activa o revoca una licencia? ¿Qué ocurrió cuando una
aplicación dejó de funcionar en la máquina de un cliente?

Una comprobación de clave en el instalador cubre solo parte de ese ciclo.
Construir un backend propio amplía el control, pero también añade
infraestructura y servicios que mantener.

**Tessera Guard** es un proyecto en desarrollo que propone reunir
licenciamiento, control de ejecución y observabilidad en un servicio
gestionado. Se está preparando la primera versión de prueba.

## Cómo está organizada la plataforma

La arquitectura tiene dos componentes principales:

- **Guardian:** agente instalado en la máquina del cliente, responsable de
  validar licencias, iniciar la aplicación como proceso hijo, capturar su
  salida y enviar telemetría. Su alcance incluye activación, señales
  periódicas de actividad (heartbeats), revocación y renovación.
- **Tessera Guard Cloud:** backend y panel para administrar clientes,
  contratos, licencias, versiones y usuarios. La arquitectura contempla
  PostgreSQL, VictoriaMetrics para métricas y VictoriaLogs para logs.

Guardian conecta la aplicación con la plataforma. La intención es
concentrar en el agente parte del trabajo de integración. El esfuerzo
necesario y los límites de este enfoque deben validarse para cada aplicación.

## Funciones previstas para la versión de prueba

### Licenciamiento

El alcance incluye licencias vinculadas a la máquina, licencias por usuario
y un pool dinámico de licencias, además de generación de claves de
activación, revocación y períodos de gracia.

### Sesiones, métricas y logs

La propuesta es hacer un seguimiento de sesiones y heartbeats, consultar
métricas de CPU y memoria y relacionar los logs con la ejecución de una
aplicación. El panel debería permitir investigar una licencia y sus sesiones.

### Versiones y actualizaciones

La gestión de versiones y la distribución de actualizaciones mediante
Guardian forman parte del alcance. El objetivo es reducir los pasos
manuales para conocer las versiones instaladas en los clientes.

### Alertas

Están previstos canales por correo electrónico, webhooks, notificaciones
en la aplicación y ntfy para situaciones como licencias próximas a vencer
o señales de problemas en las ejecuciones supervisadas.

### Controles de seguridad

El proyecto contempla proteger la configuración de Guardian con
XChaCha20-Poly1305 y derivación de claves con Argon2id, autenticación con
JWT, control de acceso por roles y permisos y registros de auditoría.
Estos mecanismos forman parte del diseño técnico; por sí solos, no
garantizan protección frente a cualquier forma de uso indebido.

## Para quién

- Proveedores de software de escritorio y embebido que necesitan administrar
  licencias y supervisar aplicaciones distribuidas.
- Equipos de producto que necesitan investigar versiones, sesiones y
  condiciones de ejecución en las máquinas de los clientes.
- Desarrolladores independientes que prefieren integrar un servicio de
  licenciamiento a mantener toda esa infraestructura.

## Estado actual y próximos pasos

La versión de prueba está en desarrollo. El modelo propuesto es un servicio
gestionado, con la operación del backend concentrada en la plataforma.

Las pruebas deberían ayudar a validar la integración de Guardian, el ciclo
de vida de las licencias y la utilidad de la telemetría para investigar
problemas. La compatibilidad, la disponibilidad y la capacidad operativa
deben evaluarse en esta etapa; aquí no se anuncia una fecha de lanzamiento.

La propuesta es facilitar el seguimiento de lo que ocurre con una
aplicación después de que sale del entorno de desarrollo.

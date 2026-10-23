---
title: Inicio y revisiones
sidebar_position: 1
---

# Inicio y revisiones

## Inicio

Al entrar, el equipo ve primero **lo que requiere acción hoy**:

- inscripciones que esperan revisión,
- tus tareas vencidas,
- establecimientos que no han enviado el reporte mensual.

Debajo están el **embudo de formalización** (cuántos prestadores hay en cada etapa), el cumplimiento del reporte
mensual, las inscripciones por mes y la distribución por categoría.

![Inicio del equipo](/img/capturas/crm-inicio.png)

## Revisiones

La pantalla **Revisiones** agrupa todo lo que hay que revisar:

1. **Inscripciones nuevas**: prestadores en estado pendiente, las más antiguas primero.
2. **Establecimientos de prestadores ya revisados**: sedes nuevas o correcciones después de un rechazo.
3. **Esperando corrección del prestador**: rechazos abiertos, con su motivo.

![Cola de revisiones](/img/capturas/crm-revisiones.png)

## Aprobar o rechazar

:::info[Solo administradores]
Aprobar, rechazar y publicar es exclusivo del rol **Administrador**. Los gestores ven el estado pero no pueden cambiarlo.
:::

En la ficha del prestador aparece el panel de revisión:

![Panel de revisión en la ficha](/img/capturas/crm-ficha-revision.png)

- **Aprobar**: marca al titular como aprobado. Con la casilla «Aprobar también sus establecimientos pendientes» se aprueban y
  **publican** sus establecimientos pendientes en el mismo paso. Si alguno tiene RNT, el prestador pasa a la etapa
  **Formalizado**.
- **Rechazar**: pide el **motivo**, que le llega por correo al prestador. Sé específico: qué falta y cómo enviarlo.
  Rechazar retira de la web todo lo publicado de ese prestador.
- **Revocar aprobación**: disponible en prestadores aprobados (por ejemplo, si cerró el negocio).

Cuando el prestador corrige algo rechazado y guarda, vuelve **solo** a la cola de revisión.

## Reglas de publicación

Un establecimiento aparece en visitatenjo.com solo si:

1. el **establecimiento** está aprobado,
2. su **prestador** está aprobado, y
3. está marcado como **publicado** (se marca solo al aprobar; se puede retirar con «Retirar de la web»).

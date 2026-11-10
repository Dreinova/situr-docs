---
title: Encuestas
sidebar_position: 6
---

# Encuestas

Las encuestas sirven para preguntar algo a los prestadores (satisfacción con una capacitación, ocupación en un
puente festivo…) o a los visitantes. Se responden en una **página pública**, sin cuenta; las respuestas llegan al CRM
y, cuando se sabe quién respondió, quedan **asociadas** a su establecimiento, empresa o contacto.

## La lista

**Encuestas** agrupa en pestañas las **Abiertas**, **Programadas**, **Borradores** y **Cerradas**, con su periodo y
número de respuestas. **Crear encuesta** abre una nueva en borrador.

## Preparar una encuesta

La ficha de la encuesta tiene cinco pestañas:

| Pestaña | Qué se hace |
|---|---|
| **Preguntas** | Agregar, editar, reordenar y quitar preguntas. Se guardan juntas. |
| **Respuestas** | El resumen por pregunta y las respuestas individuales. |
| **Destinatarios** | A quién se envía, con un enlace personal para cada uno. |
| **Configuración** | Nombre, descripción, fechas, datos de quien responde, mensaje final y responsable. |
| **Historial** | Quién creó o cambió la encuesta y cuándo. |

### Tipos de pregunta

Texto corto, párrafo, correo, teléfono, número (con mínimo y máximo), fecha, una opción, varias opciones, escala (con
textos en los extremos) y sí/no. Cada pregunta puede ser obligatoria o no.

:::caution[Quitar una pregunta borra sus respuestas]
Si la encuesta ya tiene respuestas, el editor lo advierte antes de guardar.
:::

### Configuración

- **Apertura y cierre**: solo se reciben respuestas entre esas fechas.
- **Datos de quien responde**: anónima, o con nombre y correo opcionales u obligatorios. Si el correo coincide con un
  contacto del CRM, la respuesta queda asociada a él.
- **Una respuesta por correo**, si no quieres que la misma persona responda dos veces.
- **Mensaje al terminar**: lo que ve quien responde al enviar.

**Vista previa** muestra la encuesta tal como la verán; ahí no se guarda nada.

## Publicar

**Publicar** exige al menos una pregunta guardada y las fechas de apertura y cierre. Al publicar:

- si la apertura es futura, queda **Programada**; si no, **Abierta**,
- se activa el **enlace público** (la dirección termina en `/encuesta/<nombre>`), que puedes copiar y compartir.

Las preguntas se pueden seguir editando después de publicar. **Cerrar ahora** deja de recibir respuestas; **Reabrir**
y **Volver a borrador** deshacen el cierre o la publicación.

## Destinatarios y enlaces personales

En **Destinatarios → Agregar destinatarios** eliges establecimientos, empresas o contactos, o **Todos los aprobados de
la categoría…**. Cada destinatario recibe un **enlace personal**: su respuesta queda asociada a ese registro aunque
sea anónima.

- **Copiar enlace** copia el de un destinatario.
- **Copiar todos los enlaces** copia una línea por destinatario (nombre y enlace), lista para pegar en un correo o en
  WhatsApp.
- La lista marca quién está **Sin responder**.

Sin destinatarios, la encuesta se responde solo con el enlace general.

## Resultados

En **Respuestas**: barras por opción, promedios en números y escalas, y cada respuesta individual. Desde ahí se puede
cambiar el registro asociado a una respuesta, eliminarla o **exportar CSV** (requiere el permiso «Exportar datos»).

Cada respuesta asociada deja una nota en la cronología del registro, y las fichas de establecimientos, empresas y
contactos tienen la caja **Encuestas** con lo que han respondido.

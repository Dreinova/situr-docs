---
title: visitatenjo.com
sidebar_position: 4
---

# Integración con visitatenjo.com

:::danger[Pendiente]
El CRM **todavía no tiene una API pública** para que el WordPress de visitatenjo.com lea los establecimientos
aprobados. La API que se diseñó en `crm-tenjo` (`/api/publico/establecimientos`, Laravel) **no se migró** al CRM, y la
API genérica del CRM (`crm-api`) no expone establecimientos.

Mientras no exista, **no se debe apagar `api-situr`** si el sitio sigue leyendo de ella, aunque el formulario nuevo ya
esté publicado. Los datos nuevos (inscripciones y aprobaciones hechas en el CRM) no llegarán al sitio hasta que esta
integración esté lista.
:::

## Qué debe cumplir la nueva API

Los requisitos que ya estaban definidos para la API de `crm-tenjo` siguen vigentes:

- **Solo lectura** y solo establecimientos **aprobados** (`establishments.status = 'approved'`) de la cuenta del IMCTT.
- **Nunca** datos personales del titular: documento, correo o teléfono de la empresa o del contacto.
- Filtros por **categoría** (principal o complementaria), **subcategoría**, **tipo de turismo**, **vereda** y texto,
  con paginación en el servidor (el sitio no debe descargar todo y filtrar en PHP).
- Detalle con todas las **fotos**. Hoy las fotos están en el bucket **privado** `record-attachments`: la API debe
  servirlas con URLs firmadas o publicar copias en un bucket público.
- Autenticación con una llave guardada en `wp-config.php`, nunca en código de navegador.

## Decisiones abiertas

| Tema | Opciones |
|---|---|
| **Dónde vive** | Una ruta de lectura en la Edge Function `situr` (por ejemplo `GET /situr/publico/establecimientos`) o una función de Postgres expuesta a `anon` con una vista que solo muestre columnas públicas. |
| **Publicar ≠ aprobar** | El SITUR anterior y `crm-tenjo` separaban «aprobado» de «publicado en la web» (para retirar un establecimiento sin rechazarlo). El CRM solo tiene el estado de revisión; si se necesita, agregarlo como campo personalizado o como estado. |
| **Tipos de turismo** | En el CRM son una pregunta de selección múltiple (categorías complementarias), no una tabla. La API debe exponerlos con un identificador estable (`external_key` de la opción). |
| **Veredas** | Son opciones de un campo del establecimiento; mismo caso que los tipos de turismo. |

Cuando la API exista, esta página debe documentar las rutas, los filtros, el formato de respuesta y el ejemplo para el
tema de WordPress.

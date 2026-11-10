---
title: Formulario público
sidebar_position: 3
---

# Formulario público de inscripción

La inscripción es una página pública del CRM, **`/inscripcion/situr`**, sin sesión. Cada inscripción se guarda como
**empresa**, **contacto** y **establecimientos** (pendientes de revisión), asociados entre sí, en una sola
transacción.

```text
/inscripcion/situr ──► Edge Function situr ──► public_form_intake (una transacción)
 (página del CRM)       valida con las mismas      empresa (por NIT o cédula)
 esquema del CRM        reglas del navegador        contacto (por correo)
 borrador local         fotos y documentos          establecimientos + valores + indicadores
                        enlace por correo
```

## Piezas

| Pieza | Dónde | Qué hace |
|---|---|---|
| Migraciones | `20261203090000_public_form_intake.sql`, `20261205090000_public_form_schema.sql` | Dominio de empresa opcional, `external_key` en campos y categorías, `public_forms` (con `settings`), `public_form_tokens` y las funciones `public_form_*` (solo `service_role`). |
| Reglas | `supabase/functions/_shared/publicForm.ts` | Qué campos aplican, validación y documento para `public_form_intake`. Lo usan el navegador y la función. |
| Edge Function | `supabase/functions/situr/` | Rutas (`index.ts`), correos de revisión (`emails.ts`), traducción del formato del SITUR anterior (`translate.ts`, `situr-fields.json`). |
| Página | `src/pages/PublicRegistration.tsx`, `src/components/registration/`, `src/lib/publicFormApi.ts` | Pasos, borrador en el navegador, fotos y documentos, edición con enlace. |
| Catálogo | `scripts/imctt/seed-situr.mjs`, `situr-form-settings.json` | SQL con categorías, campos (`external_key` = id de SITUR), indicadores, el formulario `situr` y los módulos. |

## Rutas de la Edge Function `situr`

`verify_jwt = false`: la función decide qué exige cada ruta.

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/situr/esquema` | Categorías, grupos, campos e indicadores del formulario (`public_form_schema`) y sus `settings`. |
| POST | `/situr/inscripcion` | `{ registration, token? }`: valida y crea o actualiza. Responde los errores por campo. |
| GET | `/situr/inscripcion?token=…` | La inscripción guardada, para corregir con el enlace. |
| POST | `/situr/enlace` | `{ email }`: envía el enlace de edición. Responde lo mismo exista o no el correo. |
| POST | `/situr/revision` | `{ establishment_id }`, **con la sesión de un administrador del CRM**: avisa al prestador la aprobación o el rechazo. |
| POST | `/situr/archivos` | `multipart`: `token`, `establishment_id`, `field_key?`, `file` (máx. 10 MB). |
| DELETE | `/situr/archivos/:id?token=…` | Quita un archivo propio. |

Secretos: `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` (del entorno), `SITUR_FORM_SLUG` (por defecto `situr`),
`SITUR_EDIT_URL` (la página del formulario en el CRM) y los `SMTP_*` del mailer compartido. Por convención, la función
se llama igual que el `slug` del formulario.

## Reglas

- **Sin cuentas de prestador.** Al inscribirse se envía un enlace con un token de **7 días**; en la base solo queda su
  hash.
- **Empresa:** se busca por NIT (jurídica) o cédula (natural); si no existe, por el dominio del correo corporativo; si
  no, se crea. La empresa automática por dominio del CRM no aplica a estas inscripciones.
- **Contacto:** por correo. El mismo correo en dos inscripciones deja un solo contacto.
- **Establecimientos** nuevos quedan *pendientes*; si el prestador corrige uno rechazado, vuelve a pendiente.
- **Indicadores:** las preguntas numéricas con frecuencia van al reporte del **último periodo cerrado**; si ya existe
  ese reporte, se actualiza.
- **Validación igual en el navegador y en el servidor** (`validateRegistration`): tipos, opciones, obligatorios,
  documento, correo y coordenadas.
- **Archivos:** se suben después de guardar la inscripción, ya con el id de cada establecimiento. Si alguno falla, la
  inscripción queda guardada y la página dice cuál.
- **Con el enlace** no se pueden borrar establecimientos ni cambiar el correo.
- **Aviso de revisión:** se envía a cada contacto del establecimiento, queda en `email_messages` (con el límite por
  hora de los demás correos) y en la cronología. Si falla, el cambio de estado se conserva.

## Textos y reglas del formulario

Están en `public_forms.settings`. Se editan en `scripts/imctt/situr-form-settings.json` y se cargan volviendo a correr
el seed.

| Clave | Qué controla |
|---|---|
| `headline`, `intro`, `success`, `consent`, `footer` | Textos de la página, mensaje final y autorización de datos. |
| `steps` | Títulos de los pasos. |
| `person` | Tipo de persona: el campo, la opción jurídica, el documento que identifica a la empresa en cada opción y los campos que solo aplican a una. |
| `conditions` | Campos que dependen de otro (número de RNT si «¿Tiene RNT?» es «Sí»; vereda si la zona es «Rural»). |
| `defaults` | Valores iniciales (país, departamento, municipio). |
| `required_fields` | Obligatorias **solo en el formulario**; en el CRM siguen opcionales. |
| `hidden_fields` | Campos internos que el formulario no muestra (`situr_id`). |

El orden y los nombres de las secciones salen de los **grupos de campos** del CRM.

## Encuestas públicas

Las encuestas no pasan por una Edge Function: la página `/encuesta/:slug` llama directamente a `survey_public` y
`survey_submit`, funciones de Postgres permitidas al rol `anon`. Solo aceptan respuestas con la encuesta publicada y
dentro de su periodo, y validan cada respuesta por tipo. El enlace personal de un destinatario (`?r=<token>`) asocia la
respuesta a su registro.

## API del CRM

La API REST genérica del CRM (`crm-api`, llaves por cuenta en Configuración → Webhooks y API) cubre contactos, negocios,
facturas y cotizaciones. **No** expone establecimientos, reportes ni encuestas. Mira [visitatenjo.com](/tecnico/visitatenjo).

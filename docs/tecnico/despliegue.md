---
title: Despliegue
sidebar_position: 6
---

# Despliegue

El CRM es una **aplicación estática**: `npm run build` genera `dist/` y Apache (cPanel) la sirve. Todo lo de servidor
(base de datos, autenticación, archivos, correos y el formulario público) vive en el **proyecto de Supabase del
IMCTT**.

## Puesta en marcha (una vez)

1. **Migraciones** en el proyecto de Supabase del cliente: `supabase db push` (o `supabase db query --linked --file …`
   por archivo, en orden).
2. **Cuenta y catálogo**:
   ```bash
   npm run account:create                                   # cuenta del IMCTT; el fundador queda superadmin
   node scripts/imctt/seed-situr.mjs --nit <NIT del IMCTT> > situr.sql
   supabase db query --linked --file situr.sql
   ```
   El seed activa los módulos (`establishments`, `reports`, `surveys`), carga el catálogo y crea el formulario
   `situr`. Repetirlo es seguro.
3. **Edge Function del formulario**:
   ```bash
   supabase secrets set --project-ref <ref> \
     "SITUR_EDIT_URL=https://crm.tenjoculturayturismo.gov.co/inscripcion/situr" \
     SMTP_SERVER=… SMTP_PORT=… SMTP_USER=… SMTP_PASSWORD=… SMTP_FROM=…
   supabase functions deploy situr
   ```
   Supabase bloquea los puertos 25 y 587 en las Edge Functions: el SMTP debe usar **465** o **2525**.
4. **Marca de los correos**: secreto `EMAIL_BRAND` desde `brands/imctt/email-brand.json` (mira
   [Marca](/tecnico/marca#correos)).
5. **Auth** (panel de Supabase → Authentication → URL Configuration): *Site URL* con el dominio del CRM y, en
   *Redirect URLs*, `/welcome`, `/reset-password` y `/join` de ese dominio. Secretos `APP_URL` y `APP_ORIGINS` para los
   correos de tareas y Google Calendar.
6. **Histórico**: correr la [migración](/tecnico/migracion).

## Frontend

Al hacer **push a `main`** en `oblicuaDev/imctt-crm`, GitHub Actions (`deploy.yml`) instala, revisa, compila, sube
`dist/` por FTPS y verifica el sitio. `a-dev` no se publica.

En el repositorio (Settings → Secrets and variables → Actions):

| Nombre | Tipo | Valor |
|---|---|---|
| `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, `FTP_SERVER_DIR` | Secret | Cuenta FTP limitada a la carpeta del subdominio (`FTP_SERVER_DIR = ./`). |
| `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` | Secret | Los del proyecto del IMCTT (la clave pública, **nunca** la de servicio). |
| `BRAND` | Variable | `imctt` |
| `DEPLOY_URL` | Variable | `https://crm.tenjoculturayturismo.gov.co` |

`public/.htaccess` fuerza HTTPS y manda todas las rutas de la SPA (incluidas `/inscripcion/situr` y `/encuesta/…`) a
`index.html`.

Para volver a una versión anterior: `git revert <commit>` en `main` y push. Las migraciones de base de datos **no** se
revierten con esto.

## Documentación

Se publica sola en **https://situr-docs.oblicua.co** (GitHub Pages) con cada push a `main`, mediante
`.github/workflows/deploy.yml` de este repositorio (`Dreinova/situr-docs`).

Para cambiar de dominio:

1. Actualizar `static/CNAME` y el valor por defecto de `url` en `docusaurus.config.ts`.
2. Apuntar el DNS (registro `CNAME` hacia `dreinova.github.io`) y cambiar el dominio en Settings → Pages.

## Día del cambio

1. Poner el SITUR anterior en solo lectura (o en mantenimiento).
2. Exportar la base y `uploads/` y ejecutar la [migración](/tecnico/migracion) (se puede repetir).
3. Redirigir la dirección anterior del formulario a la nueva, por ejemplo `registro.visitatenjo.com` →
   `https://crm.tenjoculturayturismo.gov.co/inscripcion/situr`.
4. Avisar a los prestadores: **ya no hay contraseña**; entran con «Actualizar mi inscripción» y su correo.
5. **No apagar `api-situr`** mientras visitatenjo.com lea de ella: la [API para el sitio](/tecnico/visitatenjo) aún no está publicada (ver su puesta en marcha).
6. Probar el envío real de correos (inscripción, enlace y revisión) con el SMTP del cliente.

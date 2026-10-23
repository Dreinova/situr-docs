---
title: Despliegue
sidebar_position: 6
---

# Despliegue

Pensado para el mismo hosting compartido del SITUR anterior (cPanel, PHP 8.2+, MySQL/MariaDB).

## API

1. Subir `backend/` **con** `vendor/` (en el hosting no suele haber Composer).
2. Apuntar el subdominio (p. ej. `apicrm.visitatenjo.com`) a `backend/public`.
3. Crear el `.env` de producción:
   ```ini
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://apicrm.visitatenjo.com
   FRONTEND_URL=https://situr.visitatenjo.com
   CORS_ALLOWED_ORIGINS=https://situr.visitatenjo.com
   PUBLIC_API_KEY=una-llave-larga-y-aleatoria
   DB_CONNECTION=mysql
   DB_HOST=localhost
   DB_DATABASE=…
   DB_USERNAME=…
   DB_PASSWORD=…
   MAIL_MAILER=smtp
   MAIL_HOST=…
   MAIL_FROM_ADDRESS=no-reply@visitatenjo.com
   ```
4. Desde la terminal de cPanel:
   ```bash
   php artisan key:generate
   php artisan migrate --force --seed
   php artisan storage:link
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

:::danger[Antes de salir a producción]
- `APP_DEBUG=false`: con `true` los errores muestran rutas y variables del servidor.
- Cambiar la contraseña del superadministrador inicial.
- No subir el dump de SITUR ni `storage/app/situr/` al servidor del CRM.
:::

## Frontend

```powershell
cd frontend
$env:VITE_API_URL="https://apicrm.visitatenjo.com"; npm run build
```

Subir el contenido de `frontend/dist/` al subdominio del CRM (p. ej. `situr.visitatenjo.com`). Incluye un `.htaccess`
para que Apache sirva `index.html` en cualquier ruta de la SPA.

## Documentación

```powershell
cd tenjo-docs
npm run build
```

Subir `tenjo-docs/build/` a su subdominio, o publicarla en GitHub Pages / Vercel. Ajustar `url` en
`docusaurus.config.ts`.

## Día del cambio

1. Poner el SITUR anterior en solo lectura (o en mantenimiento).
2. Exportar la base y `uploads/` y ejecutar la [migración](/tecnico/migracion).
3. Cambiar en WordPress las llamadas a la [API pública](/tecnico/api-publica).
4. Redirigir `situr.visitatenjo.com` al nuevo frontend.
5. Informar a los prestadores: **mismo correo y misma contraseña**.

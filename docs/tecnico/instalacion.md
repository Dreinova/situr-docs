---
title: Instalación local
sidebar_position: 2
---

# Instalación local

## Con Docker (recomendado)

Requisitos: Docker Desktop y Node 20 o superior.

```powershell
cd crm-tenjo
copy backend\.env.example backend\.env
docker compose up -d --build
docker compose exec api php artisan key:generate
docker compose exec api php artisan migrate --seed
docker compose exec api php artisan storage:link

cd frontend
npm install
npm run dev
```

| Servicio | URL |
|---|---|
| Aplicación | http://localhost:5173 |
| API | http://localhost:8090/api/salud |
| phpMyAdmin | http://localhost:8091 (usuario `crm` / `crm_local`) |
| Mailpit (correos enviados) | http://localhost:8025 |

Los puertos evitan chocar con XAMPP (80 y 3306). El `migrate --seed` crea los catálogos y el **superadministrador**
con `ADMIN_EMAIL`; si `ADMIN_PASSWORD` está vacío, genera una contraseña y la imprime en la consola.

### Datos de demostración

```powershell
docker compose exec api php artisan db:seed --class=DemoSeeder
```

Crea 30 prestadores ficticios y las cuentas `admin@demo.test`, `gestor@demo.test` y `prestador@demo.test`
(contraseña `password`). **No ejecutar en producción.**

## Con XAMPP

El backend corre sin cambios con el PHP 8.2 de XAMPP:

1. En `backend/.env` apunta a la base:
   - MySQL de Docker: `DB_PORT=3307`, usuario `crm` / `crm_local`.
   - MariaDB de XAMPP: `DB_PORT=3306`, `DB_USERNAME=root`, `DB_PASSWORD=` y crea la base `crm_tenjo` (utf8mb4).
2. `C:\xampp\php\php.exe artisan migrate --seed` y `C:\xampp\php\php.exe artisan serve` → http://localhost:8000
3. Frontend: `$env:VITE_API_PROXY="http://localhost:8000"; npm run dev`
4. Si antes usaste Docker, borra `backend/public/storage` (es un enlace de Linux) y ejecuta
   `php artisan storage:link` en una consola de administrador.

:::caution[Composer]
`composer.json` fija `platform.php = 8.2.12` para que las dependencias sigan siendo compatibles con XAMPP y con el
hosting. Usa un `composer.phar` reciente con el PHP de XAMPP; la imagen `composer:2.2` genera un autoload incompleto.
:::

## Variables de entorno principales

| Variable | Para qué |
|---|---|
| `FRONTEND_URL` | Enlaces de los correos y CORS. |
| `CORS_ALLOWED_ORIGINS` | Orígenes permitidos, separados por coma. |
| `PUBLIC_API_KEY` | Si se define, `/api/publico/*` exige `X-Api-Key`. |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Superadministrador inicial. |
| `DB_*` | Base de datos del CRM. |
| `LEGACY_DB_*` | Base del SITUR anterior (solo para importar). |
| `MAIL_*` | SMTP. En local, Mailpit (`127.0.0.1:1025`). |

## Documentación

```powershell
cd tenjo-docs
npm install
npm start          # http://localhost:3000
npm run build      # genera build/ para publicar
```

---
title: Instalación local
sidebar_position: 2
---

# Instalación local

## Requisitos

- **Node.js 22.12+** y npm (para las pruebas con eliminación de tipos, **22.18+**).
- **Supabase CLI** (`npx supabase …` sirve) y Docker, para la base local.

## CRM

```bash
git clone https://github.com/oblicuaDev/imctt-crm.git
cd imctt-crm
npm ci
# Solo si no existe: copiar .env.example a .env.local y completar.
BRAND=imctt npm run dev          # PowerShell: $env:BRAND='imctt'; npm run dev
```

La app queda en http://localhost:5173 con la marca del IMCTT. Sin `BRAND` se compila con la marca de Oblicua.

En `.env.local` (excluido de Git), **sin** prefijo `VITE_`:

```ini
SUPABASE_URL=https://<proyecto>.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_…
```

Solo esos dos valores públicos llegan al navegador.

:::danger[Nunca en el cliente]
No pongas una clave `service_role` ni `sb_secret_…` en variables del cliente. La Edge Function `situr` y los scripts
de `scripts/imctt/` usan la de servicio, pero desde el servidor o la consola.
:::

## Base local con Supabase

```bash
supabase start                 # Postgres, Auth, Storage, Inbucket (correos) y Edge Functions
supabase db reset              # aplica supabase/migrations/ en orden
npm run test:db                # pruebas SQL de supabase/tests/
```

Para tener la cuenta del IMCTT con su catálogo:

```bash
npm run account:create                                   # invita al fundador; crea la cuenta
node scripts/imctt/seed-situr.mjs --nit <NIT> > situr.sql
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -f situr.sql   # catálogo, formulario y módulos
supabase functions serve situr                           # el formulario en /inscripcion/situr
```

Repetir el seed es seguro.

:::caution[Correos en local]
Los correos quedan en **Inbucket** (http://localhost:54324). Inbucket no ofrece STARTTLS, así que el envío real con el
SMTP del cliente solo se prueba contra el proyecto remoto.
:::

## Comandos útiles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo. |
| `npm run build` | `tsc -b` + `vite build` → `dist/`. |
| `npm run lint` | oxlint. |
| `npm test` | Pruebas unitarias. |
| `npm run test:situr` | Formulario público, traducción e histórico del SITUR. |
| `npm run test:surveys` | Lógica de encuestas. |
| `npm run test:db` | Pruebas SQL contra la base local. |

## Documentación

```bash
cd tenjo-docs
npm install
npm start          # http://localhost:3000
npm run build      # genera build/ para publicar
```

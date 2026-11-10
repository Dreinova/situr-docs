---
title: Marca y sistema visual
sidebar_position: 8
---

# Marca y sistema visual

El CRM es **marca blanca**: el mismo código sirve a varios clientes y la piel de cada uno está en `brands/<id>/`. La
del IMCTT está en **`brands/imctt/`** y se elige al compilar con `BRAND=imctt` (variable de GitHub del repositorio; en
local `BRAND=imctt npm run dev`). Sin `BRAND` se usa la marca de Oblicua.

| Archivo | Uso |
|---|---|
| `brand.json` | Nombre («CRM Turismo Tenjo»), descripción, tipografías y colores. |
| `email-brand.json` | Marca de los correos (ver abajo). |
| `logo-menu.webp`, `logo-login.webp` | Logo del menú lateral y de las pantallas de acceso. |
| `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `pwa-*.png` | Íconos de la pestaña y de la app instalable. |
| `og-image.png` | Vista previa al compartir un enlace (1200×630). |
| `fuente/` | Los vectores de Visita Tenjo (`logo.svg`, `glifo.svg`) y `generar.mjs`, que produce todas las imágenes. |

La guía completa para crear o ajustar una marca está en `docs/marca-blanca.md` del repositorio del CRM.

## Color

Toda la paleta se deriva del rojo de Visita Tenjo **`#F70017`**.

| Token del CRM | Hex | Uso |
|---|---|---|
| `sidebar`, `header` | `#400000` (vino) | Menú lateral y barra superior. |
| `sidebar-hover`, `header-hover` | `#5A0A0C` | Fondo al pasar el mouse. |
| `primary`, `sidebar-active`, `accent-500`, `link-500` | `#D90E18` | Botones, sección activa, pestaña activa y enlaces. |
| `primary-hover`, `link-600` | `#B7000E` | Hover de botones y enlaces. |
| `accent-50` | `#FFE6E3` | Resaltados suaves. |
| `navy-700` | `#2A1B19` (tinta) | Texto principal. |
| `navy-500` | `#4B3734` | Texto secundario. |
| `surface`, `auth` | `#FBF8F7` (papel) | Fondo del área de trabajo y del acceso. |
| `border` | `#EBE2E1` | Bordes. |

:::caution[¿Por qué no usar `#F70017` en los botones?]
Con texto blanco tiene contraste **4,23**, por debajo del mínimo **4,5** de WCAG AA para texto normal. Por eso los
botones usan `#D90E18` (5,22) y `#F70017` queda para acentos sin texto pequeño, como la franja de los correos.
:::

El **modo oscuro** (botón sol/luna de la barra superior) usa `darkColors` de `brand.json`, con enlaces en `#FF8A80` y
`#FFB3AB` para que se lean sobre fondo oscuro. Los colores de estado (éxito, error, aviso) y los de las gráficas no
cambian por marca: están elegidos para distinguirse con daltonismo.

Los mismos tonos están en esta documentación (`tenjo-docs/src/css/custom.css`).

## Tipografía

| Rol | Fuente |
|---|---|
| Títulos destacados | Bricolage Grotesque |
| Texto de toda la interfaz | Public Sans |

## Correos

La plantilla de los correos (`supabase/functions/_shared/emailTemplate.ts`) no depende del build: su marca se define
con el secreto **`EMAIL_BRAND`** de las Edge Functions del proyecto del IMCTT. Sin él, los correos salen con la marca
de Oblicua.

```bash
supabase secrets set EMAIL_BRAND="$(node -e "process.stdout.write(JSON.stringify(require('./brands/imctt/email-brand.json')))")"
```

| Clave | Valor del IMCTT |
|---|---|
| `product`, `fromName` | CRM Turismo Tenjo |
| `wordmark`, `tagline` | Visita Tenjo · IMCTT |
| `header`, `accent`, `button` | `#400000`, `#F70017`, `#D90E18` |
| `signature` | Instituto Municipal de Cultura y Turismo de Tenjo · visitatenjo.com |
| `logoUrl` | Vacío: el encabezado usa texto. Con una imagen `https://` del logo, se reemplaza. |

## Logo

- Los íconos y logos salen de los vectores oficiales con `node brands/imctt/fuente/generar.mjs` y luego Inkscape (las
  instrucciones están al inicio del script).
- El **glifo** muisca del logo es el ícono de la app y el favicon, en blanco sobre el rojo `#D90E18`.

## Firma visual

Las **curvas de nivel** del cerro Juaica aparecen en la portada de esta documentación.

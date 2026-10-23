---
title: Marca y sistema visual
sidebar_position: 8
---

# Marca y sistema visual

## Color

Toda la paleta se deriva del rojo de Visita Tenjo **`#F70017`**, en el espacio de color OKLCH con el mismo matiz
(27,6°), para que tonos claros y oscuros se sientan de la misma familia.

| Token | Hex | Contraste sobre blanco | Uso |
|---|---|---|---|
| `marca-vivo` | `#F70017` | 4,23 | Superficies de marca, acentos, indicador activo. **No para texto normal.** |
| `marca` | `#D90E18` | 5,22 ✓ | Botones, enlaces, estados activos. |
| `marca-oscuro` | `#B7000E` | 6,95 ✓ | Hover de botones. |
| `marca-300` | `#FFA69A` | | Barras secundarias de gráficas. |
| `marca-claro` | `#FFE6E3` | | Fondos de selección. |
| `vino` | `#400000` | 17,2 ✓ | Barra lateral del CRM, pie de la documentación. |
| `tinta` | `#2A1B19` | 16,5 ✓ | Texto principal. |
| `niebla` | `#766866` | 5,33 ✓ | Texto secundario. |
| `papel` | `#FBF8F7` | | Fondo general. |
| `linea` | `#EBE2E1` | | Bordes. |

:::caution[¿Por qué no usar `#F70017` en los botones?]
Con texto blanco tiene contraste **4,23**, por debajo del mínimo **4,5** de WCAG AA para texto normal. Por eso los
botones usan `#D90E18` (5,22) y `#F70017` queda para superficies grandes y acentos sin texto pequeño.
:::

Los **estados** no usan el rojo de marca para no confundirse con acciones:

| Estado | Color |
|---|---|
| Aprobado | `#1E7A4C` sobre `#E2F2E8` |
| Pendiente | `#7A4D00` sobre `#FDF0D9` |
| Rechazado | `#B7000E` sobre `#FFE6E3` |
| Información | `#2F6F9F` sobre `#E1ECF5` |

Los tokens están en `frontend/src/index.css` (Tailwind 4, bloque `@theme`) y en `tenjo-docs/src/css/custom.css`.

## Logo

El logo de Visita Tenjo es un PNG blanco de 161×92 px (`frontend/public/marca/visita-tenjo-blanco.png`).

- En la interfaz se usa como **máscara CSS** (`mask-image`), así toma el color del texto: blanco sobre el rojo o el
  vino, rojo sobre fondos claros.
- Junto a él va el sello **SITUR** (Bricolage Grotesque Bold) separado por una línea fina.
- El **glifo** muisca del logo, recortado, es el favicon (`favicon.png`, `apple-touch-icon.png`).

:::note[Pendiente]
El PNG es de baja resolución: no usarlo a más de ~90 px de alto. Con el logo en **SVG** o en alta resolución se
pueden mejorar el favicon, la tarjeta para redes y los correos.
:::

## Tipografía

| Rol | Fuente |
|---|---|
| Títulos y cifras | Bricolage Grotesque |
| Texto | Public Sans |
| Datos (RNT, documentos, periodos) | IBM Plex Mono |

## Firma visual

Las **curvas de nivel** del cerro Juaica aparecen solo en el panel rojo del ingreso, la barra lateral y la portada de
esta documentación. El resto de la interfaz es sobrio para no competir con los datos.

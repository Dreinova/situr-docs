---
title: API pública (visitatenjo.com)
sidebar_position: 3
---

# API pública para visitatenjo.com

API de solo lectura para el WordPress de visitatenjo.com. Devuelve **solo** establecimientos aprobados y publicados,
y **nunca** datos personales del titular (documento, correo o teléfono del titular).

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/publico/establecimientos` | Lista paginada. |
| GET | `/api/publico/establecimientos/{slug}` | Detalle con todas las fotos. |
| GET | `/api/publico/categorias` | Categorías y subcategorías con el número de publicados. |
| GET | `/api/publico/tipos-turismo` | Tipos de turismo con el número de publicados. |

## Filtros del listado

| Parámetro | Ejemplo | Nota |
|---|---|---|
| `categoria` | `restaurantes` | Coincide con la categoría principal **o** una complementaria. |
| `subcategoria` | `glamping` | |
| `tipo_turismo` | `senderismo` | Reemplaza el filtro por `field_1766013834262` del SITUR anterior. |
| `vereda` | `juaica` | |
| `q` | `finca` | Busca en el nombre. |
| `por_pagina` | `200` | Máximo 200 (antes había un `LIMIT 50` fijo). |
| `page` | `2` | |

## Autenticación

Si el servidor define `PUBLIC_API_KEY`, se exige el header `X-Api-Key`. Guarda la llave en `wp-config.php`, **nunca**
en código de navegador:

```php title="wp-config.php"
define('CRM_TENJO_API_KEY', 'la-llave-del-servidor');
```

## Ejemplo en el tema de WordPress

Así quedaría `single-pantalla-donde-dormir-en-tenjo.php`: el filtro lo hace el servidor en lugar de descargar todo y
filtrar en PHP.

```php
$res = wp_remote_get('https://apicrm.visitatenjo.com/api/publico/establecimientos?tipo_turismo=alojamiento&por_pagina=200', [
    'headers' => ['X-Api-Key' => CRM_TENJO_API_KEY, 'Accept' => 'application/json'],
    'timeout' => 15,
]);

if (! is_wp_error($res) && wp_remote_retrieve_response_code($res) === 200) {
    $lista = json_decode(wp_remote_retrieve_body($res), true)['data'] ?? [];
    foreach ($lista as $est) {
        echo esc_html($est['nombre']);
        echo esc_url($est['portada']['url'] ?? '');
    }
}
```

:::tip[Caché]
Guarda la respuesta con `set_transient('situr_alojamiento', $lista, 15 * MINUTE_IN_SECONDS)` para no consultar la
API en cada visita.
:::

## Respuesta

```json title="GET /api/publico/establecimientos?tipo_turismo=senderismo"
{
  "current_page": 1,
  "last_page": 1,
  "total": 4,
  "data": [
    {
      "id": 12,
      "nombre": "Finca El Mirador",
      "slug": "finca-el-mirador",
      "descripcion": "Glamping con vista a la Peña de Juaica.",
      "direccion": "Vereda Juaica, km 3",
      "municipio": "Tenjo",
      "zona": "rural",
      "latitud": 4.889,
      "longitud": -74.162,
      "telefono": "3001234567",
      "pagina_web": "https://fincaelmirador.co",
      "redes_sociales": [{"red": "instagram", "url": "https://instagram.com/fincaelmirador"}],
      "metodos_pago": ["efectivo", "nequi"],
      "tiene_rnt": true,
      "rnt": "123456",
      "prestador": "Finca El Mirador SAS",
      "categoria": {"id": 2, "slug": "alojamiento", "nombre": "Establecimientos de alojamiento turístico"},
      "subcategoria": {"id": 6, "slug": "glamping", "nombre": "Glamping"},
      "categorias_adicionales": [],
      "tipos_turismo": [{"id": 4, "slug": "senderismo", "nombre": "Senderismo"}],
      "vereda": {"id": 11, "slug": "juaica", "nombre": "Juaica"},
      "portada": {"id": 40, "url": "https://apicrm.visitatenjo.com/storage/establecimientos/12/foto.jpg", "es_portada": true, "orden": 0}
    }
  ]
}
```

La descripción es **texto plano** (con saltos de línea); conviértela con `wpautop(esc_html($est['descripcion']))`.

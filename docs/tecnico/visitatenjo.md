---
title: visitatenjo.com
sidebar_position: 4
---

# Integración con visitatenjo.com

:::warning[Falta cambiar el tema]
Las rutas de establecimientos de la API del CRM **están publicadas** desde el 9/11/2026, pero el WordPress todavía lee
de `apisitur.visitatenjo.com` (el `api-situr` anterior). **No se debe apagar `api-situr`** hasta cambiar el tema a la
API nueva (ver [Puesta en marcha](#puesta-en-marcha)).
:::

## Qué usa hoy el WordPress

El tema `visita-tenjo` llama a `api-situr` con una llave fija en el código (header `X-API-KEY`) desde cinco plantillas:

| Plantilla | Ruta de `api-situr` | Qué hace con la respuesta |
|---|---|---|
| `single-tipo-turismo.php` | `GET /establecimientos/publico` | Filtra en PHP por tipo de turismo (`field_1766013834262`). |
| `single-tipo-turismo-gastronomico.php` | `GET /establecimientos/publico` | Tipo «turismo gastronómico» o categoría restaurantes/bares. |
| `single-pantalla-donde-comer-en-tenjo.php` | `GET /establecimientos/publico` | Categoría `restaurantes` o `bares`. |
| `single-pantalla-donde-dormir-en-tenjo.php` | `GET /establecimientos/publico` | Categoría `alojamiento` o `viviendas`. |
| `template-establecimiento.php` | `GET /establecimientos/publico/{id}` | La ficha en `visitatenjo.com/establecimiento/{id}`. |

:::warning[Problemas de la integración actual]
- `GET /establecimientos/publico` devuelve **todos** los establecimientos, aprobados o no, con un `LIMIT 50` fijo; y la
  ficha por id tampoco revisa el estado.
- La llave está escrita en el código del tema.
- El sitio descarga todo y filtra en PHP en cada visita.
:::

## La API nueva

Es parte de la API del CRM (`crm-api`): llaves por cuenta (`Authorization: Bearer ocrm_…`) creadas en
**Configuración → Webhooks y API**, con permisos y registro de cada petición. El WordPress usa una llave que solo
tiene el permiso **`establishments:read`** («Leer establecimientos y categorías»), que solo se ofrece si la cuenta tiene
el módulo de establecimientos.

URL base: `https://<proyecto>.supabase.co/functions/v1/crm-api/v1`. La referencia completa está en
`docs/webhooks-api.md` del repositorio del CRM.

| Ruta | Qué devuelve |
|---|---|
| `GET /establishments?status=&category=&subcategory=&type=&q=&limit=&offset=` | Lista ordenada por nombre, paginada en la base: `{ data, meta: { limit, offset, total } }`. |
| `GET /establishments/:id` | Un establecimiento. `:id` acepta el uuid, el **id del SITUR anterior** o el slug, así que los enlaces `visitatenjo.com/establecimiento/{id}` ya publicados siguen sirviendo. |
| `GET /establishment-categories` | Categorías y subcategorías con su `key`, nombre y número de aprobados. |

### Filtros

| Parámetro | Ejemplo | Nota |
|---|---|---|
| `status` | `approved` | Por defecto `approved`. También `pending`, `rejected`, `inactive`. Lo mismo en la ficha: si no tiene ese estado, 404. |
| `category`, `subcategory` | `alojamiento`, `glamping` | Por la `key` de la categoría (la del SITUR). |
| `type` | `senderismo` | Tipo de turismo, por su slug. |
| `q` | `finca` | Busca en el nombre, sin tildes ni mayúsculas. |
| `limit`, `offset` | `100`, `0` | Paginación. |

### Qué trae cada establecimiento

```json
{
  "id": "5fa99706-…", "situr_id": "77", "name": "Glamping Mirador del Juaica", "slug": "glamping-mirador-del-juaica-5fa99706",
  "category": { "key": "alojamiento", "name": "Establecimientos de alojamiento turístico" },
  "subcategory": { "key": "glamping", "name": "Glamping" },
  "address": "Vereda Juaica, km 3", "latitude": 4.8891, "longitude": -74.162,
  "phone": "3105550101", "email": "reservas@glamping.example", "website": "https://glamping.example",
  "status": "approved", "created_at": "…", "updated_at": "…",
  "tourism_types": [{ "slug": "senderismo", "name": "Senderismo" }],
  "custom_fields": { "situr_id": "77", "field_1766259143120": "Viernes a domingo, 9:00 a. m. – 6:00 p. m." },
  "photos": [{ "id": "…", "file_name": "fachada.jpg", "mime_type": "image/jpeg", "url": "https://…/sign/…", "url_expires_at": "…" }]
}
```

- **Sin datos personales**: nunca salen la empresa titular, los contactos, las notas, las actividades, el responsable ni
  el motivo de un rechazo. Tampoco los campos «solo administradores» ni los de tipo archivo.
- **Campos personalizados** por su clave (la del SITUR cuando existe); los de selección múltiple salen como lista.
- **Fotos**: las imágenes adjuntas al establecimiento, con URLs firmadas que **vencen a las 24 horas**.
- **Tipos de turismo**: salen de la pregunta que la cuenta tenga configurada para eso
  (`organizations.api_settings.tourism_types_field`; en el IMCTT, «categorías complementarias», que deja el seed).
  El slug se deriva de la etiqueta: «Turismo Gastronómico» → `turismo_gastronomico`.
- **Slug**: el nombre con guiones más los 8 primeros caracteres del id. Cambia si cambia el nombre; para enlaces
  permanentes conviene usar el id o el `situr_id`.

## Cambios en el WordPress

1. Guardar la URL y la llave en `wp-config.php` (`OBLICUA_CRM_API`, `OBLICUA_CRM_KEY`), nunca en el tema.
2. Cambiar las cinco plantillas a las rutas nuevas, con los filtros en la consulta (`category=alojamiento`,
   `type=senderismo`…), en vez de descargar todo y filtrar en PHP.
3. Ajustar los nombres de campo: `nombre` → `name`, `categoria_rnt` → `category.key`, `descripcion`, horarios y
   teléfono → `custom_fields`, `fotos` → `photos[].url`, coordenadas → `latitude`/`longitude`.
4. Los tipos de turismo: el tema hoy compara con `turismo_gastronómico` (con tilde); la API usa
   `turismo_gastronomico`. Ajustar los valores de relación en WordPress.
5. Guardar la respuesta en caché (`set_transient`) **menos de 24 horas**, porque las URLs de las fotos vencen.

```php
$res = wp_remote_get(OBLICUA_CRM_API . '/establishments?category=alojamiento&limit=100', [
    'headers' => ['Authorization' => 'Bearer ' . OBLICUA_CRM_KEY, 'Accept' => 'application/json'],
    'timeout' => 15,
]);
```

La app móvil **Visita Tenjo** (`tenjo-app`) también debe cambiar: su script `importar-contenido.py` toma los
establecimientos de la API de `crm-tenjo` (`/api/publico/establecimientos`), que ya no existe.

## Puesta en marcha

| Paso | Estado |
|---|---|
| Unir `feat/api-establecimientos` en `main` del CRM | Hecho (9/11/2026) |
| Aplicar la migración `20261206090000_api_establishments.sql` en el proyecto del IMCTT | Hecho |
| Desplegar `crm-api` (`supabase functions deploy crm-api --no-verify-jwt --use-api`) | Hecho |
| Configurar `api_settings.tourism_types_field = 'field_1766013834262'` en la cuenta del IMCTT | Hecho |
| Crear la llave con «Leer establecimientos y categorías» en Configuración → Webhooks y API | Pendiente |
| Cambiar las plantillas del tema de WordPress | Pendiente |
| Apagar `api-situr` cuando el sitio ya lea de la API nueva | Pendiente |

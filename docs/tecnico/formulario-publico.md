---
title: API interna
sidebar_position: 4
---

# API interna

Todas las rutas están en `backend/routes/api.php` y responden JSON. Las privadas usan
`Authorization: Bearer <token>` (Sanctum), que se obtiene en `POST /api/auth/login`.

## Errores

| Código | Significado | Cuerpo |
|---|---|---|
| 401 | Sin sesión o token vencido | `{"message": "Unauthenticated."}` |
| 403 | Sin permiso para esa acción o ese registro | `{"message": "…"}` |
| 404 | No existe | `{"message": "Recurso no encontrado."}` |
| 422 | Validación | `{"message": "…", "errors": {"campo": ["mensaje"]}}` |
| 429 | Demasiados intentos (login, registro: 10 por minuto) | |

## Públicas

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/salud` | Verificación de funcionamiento. |
| GET | `/api/meta` | Catálogos, campos personalizados y listas de valores (enums). |
| POST | `/api/auth/login` | `{email, password}` → `{token, user}` |
| POST | `/api/auth/olvide-contrasena` | Envía el enlace (respuesta idéntica exista o no el correo). |
| POST | `/api/auth/restablecer-contrasena` | `{token, email, password, password_confirmation}` |
| POST | `/api/registro` | Inscripción completa en una transacción. |

## Prestadores y equipo (con autorización por dueño)

| Método | Ruta |
|---|---|
| GET / POST | `/api/auth/me`, `/api/auth/logout`, `/api/auth/cambiar-contrasena` |
| GET / PUT | `/api/portal`, `/api/portal/caracterizacion` |
| GET / PUT | `/api/actores/{id}` |
| POST / PUT / DELETE | `/api/actores/{id}/contactos`, `/api/contactos/{id}` |
| POST / GET / PUT / DELETE | `/api/actores/{id}/establecimientos`, `/api/establecimientos/{id}` |
| POST / PATCH / DELETE | `/api/establecimientos/{id}/imagenes`, `/api/imagenes/{id}` |
| POST / GET / DELETE | `/api/{actores\|establecimientos}/{id}/documentos`, `/api/documentos/{id}/descargar` |
| GET / POST | `/api/establecimientos/{id}/reportes/pendientes`, `/api/establecimientos/{id}/reportes` |

## Solo equipo (gestor, administrador)

| Método | Ruta |
|---|---|
| GET | `/api/dashboard` |
| GET / POST / DELETE | `/api/actores`, `/api/actores/{id}` |
| POST | `/api/actores/{id}/revision` *(administradores)* |
| PUT / GET | `/api/actores/{id}/etiquetas`, `/api/actores/{id}/timeline` |
| GET | `/api/establecimientos` |
| POST / PUT | `/api/establecimientos/{id}/revision`, `/api/establecimientos/{id}/publicacion` *(administradores)* |
| GET / POST / PUT / DELETE | `/api/interacciones`, `/api/actores/{id}/interacciones`, `/api/interacciones/{id}` |
| GET / POST / PUT / DELETE | `/api/tareas` |
| GET | `/api/reportes-resumen?frecuencia=&periodo=&categoria_id=` |
| GET | `/api/exportes/{actores\|establecimientos\|reportes}` (CSV UTF-8 con BOM, separador `;`) |
| GET | `/api/equipo`, `/api/catalogos/{tipo}` |
| POST / PUT / DELETE | `/api/catalogos/{tipo}/{id}` *(administradores)* |
| GET / POST / PUT | `/api/usuarios` *(administradores)* |

`{tipo}` de catálogo: `categorias`, `subcategorias`, `campos`, `indicadores`, `tipos-turismo`, `veredas`, `etiquetas`.

## Ejemplo: inscripción

```json title="POST /api/registro"
{
  "cuenta": {"email": "finca@ejemplo.com", "password": "clave-segura", "password_confirmation": "clave-segura"},
  "acepta_tratamiento_datos": true,
  "actor": {"tipo_persona": "natural", "nombre": "Ana Rodríguez", "tipo_documento": "cc", "numero_documento": "52123456"},
  "contacto": {"nombre": "Ana Rodríguez", "celular": "3001234567"},
  "caracterizacion": {"total_ingresos": 50000000, "empleo_permanente_mujeres": 2},
  "establecimientos": [{
    "nombre": "Finca El Mirador",
    "categoria_id": 2,
    "tipos_turismo": [4],
    "tiene_rnt": true, "rnt": "123456",
    "zona": "rural", "vereda_id": 11,
    "latitud": 4.889, "longitud": -74.162,
    "datos_extra": {"horario_atencion": "Viernes a domingo"}
  }]
}
```

Respuesta `201` con `token`, `user`, `actor_id` y los `establecimientos` creados (para subir fotos después).

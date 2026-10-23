---
title: Seguridad
sidebar_position: 7
---

# Seguridad

## Acciones pendientes sobre el SITUR anterior

:::danger[Contraseñas en texto plano]
El SITUR anterior guardaba la contraseña de 52 prestadores **en texto plano** dentro de `situr_registros.datos`.
Mientras siga en línea, ejecutar en producción:

```sql
UPDATE situr_registros SET datos = JSON_REMOVE(datos, '$.password');
```

Tratar cualquier respaldo de esa base como **confidencial** y recomendar a los prestadores cambiar la contraseña si la
reutilizan en otros servicios.
:::

- Cambiar la contraseña de la base de datos y la API key, que estaban en el código fuente.
- Borrar `api-situr/ini.php` (expone `phpinfo()`).
- Retirar `api-situr` cuando WordPress use la nueva API.

## Hallazgos del SITUR y cómo se resolvieron

| Problema en SITUR | En el CRM |
|---|---|
| Cualquiera podía crearse una cuenta de superadministrador (`POST /usuarios`, `/usuarios/asignar-rol` sin sesión). | Usuarios solo los crean administradores; un admin no puede crear superadmins. |
| Listar, editar y borrar registros, imágenes y configuración sin sesión. | Todas las rutas privadas exigen token y permisos por rol y por dueño. |
| Inyección SQL con nombres de columna tomados del cuerpo de la petición. | Solo campos validados y declarados; nada del cuerpo se concatena en SQL. |
| Un prestador podía ver y editar datos de otros. | *Policies* por dueño, con pruebas automáticas. |
| Secretos en el repositorio (BD, JWT, API key, un token válido en el frontend). | Todo en `.env`; la llave pública vive solo en WordPress. |
| Subida de archivos sin validar. | Tipo y tamaño validados, nombre aleatorio, documentos en disco privado. |
| La recuperación de contraseña revelaba qué correos existen. | Respuesta idéntica en ambos casos; enlace con vencimiento. |
| Sin límite de intentos en el ingreso. | 10 intentos por minuto por IP. |

## Controles del CRM

- **Contraseñas**: bcrypt, mínimo 8 caracteres. Cambiarlas cierra las otras sesiones.
- **Tokens**: se revocan al cerrar sesión, al desactivar al usuario o al cambiarle la contraseña o el rol.
- **API pública**: no expone documento, correo ni teléfono del titular (hay prueba que lo verifica).
- **Bitácora**: cada cambio de actores, establecimientos, contactos y reportes queda con usuario, fecha y antes/después.
- **Datos personales**: la inscripción exige aceptar la política de tratamiento (Ley 1581 de 2012).

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

- Rotar la contraseña de la base de datos y la API key, que estaban en el código fuente.
- Borrar `api-situr/ini.php` (expone `phpinfo()`).
- Apagar el frontend `situr/` cuando el formulario nuevo esté publicado.
- Retirar `api-situr` cuando visitatenjo.com use la [nueva API](/tecnico/visitatenjo).

## Hallazgos del SITUR y cómo quedaron

| Problema en SITUR | En el CRM |
|---|---|
| Cualquiera podía crearse una cuenta de superadministrador. | Sin registro público (`enable_signup = false`); solo por invitación. El rol lo asigna el servidor. |
| Listar, editar y borrar registros, imágenes y configuración sin sesión. | RLS en todas las tablas; lo público pasa por funciones acotadas (`public_form_*` vía la Edge Function, `survey_public`/`survey_submit`). |
| Inyección SQL con nombres de columna tomados de la petición. | Funciones de Postgres con parámetros; los campos se resuelven por `external_key` contra la configuración. |
| Un prestador podía ver y editar datos de otros. | Sin cuentas de prestador: cada enlace solo abre su inscripción, con un token de 7 días guardado como hash. |
| Secretos en el repositorio. | En el navegador solo la clave pública; la de servicio vive en los secretos de las Edge Functions. |
| Subida de archivos sin validar. | Tipo y tamaño validados en la función, el bucket y la tabla; bucket **privado** con URLs firmadas. |
| La recuperación revelaba qué correos existen. | «Pedir enlace» responde lo mismo exista o no el correo. |

## Controles del CRM

- **Autorización en la base**: RLS por cuenta y por rol (matriz de permisos). Cambiar el estado de revisión lo impide
  un trigger a quien no sea administrador.
- **Formulario público**: la Edge Function valida todo con las mismas reglas que el navegador antes de llamar a
  `public_form_intake`, que es una sola transacción. Ningún dato llega a la base sin validar.
- **Correos**: quedan en `email_messages`, con un límite por hora.
- **Historial**: `record_changes` guarda cada cambio con usuario, fecha, antes y después; el cliente no puede
  escribirlo. Los campos «solo administradores» no se muestran a los demás en el historial.
- **Encuestas**: solo aceptan respuestas con la encuesta publicada y dentro de su periodo.
- **Datos personales**: la inscripción exige aceptar la política de tratamiento (Ley 1581 de 2012).
- **Buscadores**: el CRM lleva `noindex` en la página y en la cabecera `X-Robots-Tag`.

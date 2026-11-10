---
title: Configuración
sidebar_position: 1
---

# Configuración

En **Configuración** se define **qué se pregunta** en el formulario de inscripción, en las fichas y en los reportes.
Las preguntas no están escritas en el código: si cambias una aquí, el formulario público la muestra así de inmediato,
sin publicar nada.

| Pestaña | Para qué sirve | Quién |
|---|---|---|
| **Categorías** | Las categorías de establecimientos y sus subcategorías (tipos), en dos niveles. | Administradores |
| **Campos** | Las preguntas de empresas, contactos, establecimientos y los **indicadores** de los reportes, organizadas en grupos. | Superadministrador (crear y archivar) |
| **Equipo** y **Permisos** | Quién entra al CRM y qué puede hacer. Mira [Usuarios y roles](/administracion/usuarios-y-roles). | Administradores |
| **Marca** | Logo y color de la cuenta. | Administradores |
| **Auditoría** | Registro de los cambios de configuración. | Administradores |

## Categorías

**Configuración → Categorías** lista las categorías de establecimientos (las del RNT más categorías locales como
Artesanías) y, debajo de cada una, sus subcategorías. Se agregan y se renombran desde ahí.

![Configuración → Categorías](/img/capturas/crm-config-categorias.png)

## Campos

Cada campo tiene una **etiqueta** (la pregunta), una **clave** y un **tipo**:

| Tipo | Validación |
|---|---|
| Texto, texto multilínea | — |
| Número | Solo números. Los indicadores son campos numéricos del objeto «Reporte». |
| Solo dígitos | Documentos y códigos; conserva los ceros a la izquierda. |
| Fecha | Fecha válida. |
| Lista desplegable | Una de las opciones definidas. |
| Selección múltiple | Varias de las opciones definidas. |
| Casilla | Sí / no. |
| Archivos | Documentos del registro (RUT, RNT…). No pueden ser obligatorios. |

La base de datos valida el tipo y las opciones **cada vez que se guarda**, venga el dato del formulario público, del
CRM o de una importación.

**Solo administradores**: un campo marcado así solo lo ven el superadministrador y los administradores.

### Grupos por categoría y frecuencia

Los campos se organizan en **grupos**, que son las cajas de la ficha y las secciones del formulario. En
establecimientos y reportes, un grupo puede **limitarse a categorías** («Aplica a estas categorías»; ninguna marcada =
todas). Así, un restaurante ve las preguntas de restaurantes y un hotel las de alojamiento.

![Configuración → Campos → Establecimientos: grupos y la categoría a la que aplica cada uno](/img/capturas/crm-config-campos.png)

En reportes, el grupo también tiene una **frecuencia de los indicadores** (mensual, trimestral, semestral o anual):
sus indicadores se piden en los reportes de esa frecuencia.

El orden y los nombres de los grupos son los que ve el prestador. Por ejemplo, la sección «Datos generales SITUR» del
formulario se renombra aquí.

:::caution[Cambiar o borrar]
- **No cambies la clave** de un campo que ya tiene datos: el formulario público la usa para guardar las respuestas, y
  el histórico del SITUR anterior se importó por esas claves.
- En lugar de eliminar, **archiva**: el campo deja de aparecer en el formulario y en las fichas, pero se conservan las
  respuestas.
:::

## Lo que no se cambia desde aquí

Los **textos del formulario público** (título, introducción, mensaje final, autorización de datos), los títulos de los
pasos, las preguntas que solo aplican a persona natural o jurídica, las que dependen de otra (por ejemplo, el número de
RNT solo si «¿Tiene RNT?» es «Sí») y las que son obligatorias **solo en el formulario** están en la configuración del
formulario. Para cambiarlos, pídeselo al equipo técnico (mira
[Formulario público](/tecnico/formulario-publico#textos-y-reglas-del-formulario)).

:::info[Origen de las preguntas]
El catálogo actual (22 categorías, 32 subcategorías, los campos y 47 indicadores) se cargó desde la configuración real
del formulario del SITUR anterior.
:::

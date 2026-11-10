---
title: Usuarios y roles
sidebar_position: 2
---

# Usuarios y roles

Solo el **equipo del IMCTT** tiene usuario en el CRM. Los prestadores **no** tienen cuenta: usan el formulario público
y su [enlace por correo](/prestadores/actualizar).

## Roles

| Rol | En pocas palabras |
|---|---|
| **Superadministrador** | Quien abrió la cuenta. Todo, incluidos los campos, los roles y los permisos. |
| **Administrador** | Revisa establecimientos (aprobar, rechazar, inactivar), invita al equipo y configura categorías, marca e integraciones. |
| **Gerente** | Ve, crea y edita todos los registros; no elimina. |
| **Ventas** | Por defecto, solo consulta establecimientos, reportes y encuestas. |

Los nombres «Gerente» y «Ventas» vienen del CRM sobre el que funciona el SITUR. Lo que cada rol puede hacer lo
define la matriz de permisos (abajo), que se puede ajustar.

:::info[Revisión de establecimientos]
Aprobar, rechazar e inactivar es **siempre** exclusivo del superadministrador y los administradores, sin importar los
permisos: lo exige la base de datos.
:::

## Permisos

**Configuración → Permisos** tiene una matriz por rol. Para cada objeto (contactos, empresas, establecimientos,
reportes, encuestas…):

| Acción | Valores |
|---|---|
| **Ver** | Sin acceso · Solo los propios · Todos |
| **Crear** | Sí / No |
| **Editar** | Sin acceso · Solo los propios · Todos |
| **Eliminar** | Sin acceso · Solo los propios · Todos |

«Propios» son los registros de los que la persona es **responsable**. Además están los permisos generales
**Gestionar equipo** y **Exportar datos** (necesario, por ejemplo, para exportar las respuestas de una encuesta).

Valores iniciales para los módulos del SITUR:

| | Administrador | Gerente | Ventas |
|---|---|---|---|
| **Establecimientos** | Todo | Ver, crear y editar todos | Ver todos |
| **Reportes** | Todo | Ver, crear y editar todos | Ver todos |
| **Encuestas** | Todo | Ver, crear y editar todas | Ver todas |

Solo el superadministrador modifica la matriz. En **Equipo**, el panel de permisos de una persona permite darle
accesos **personalizados**, distintos a los de su rol.

## Invitar a alguien

1. **Configuración → Equipo → Invitar nuevo miembro**.
2. Correo, nombre, apellidos y rol (Administrador, Gerente o Ventas).
3. La persona recibe un correo para completar su perfil y crear su contraseña. Mientras no lo haga, aparece como
   **pendiente**.

## Cambiar el rol o desactivar

Solo el **superadministrador** cambia roles y desactiva o reactiva miembros, y nunca a sí mismo.

- **Desactivar** quita el acceso de inmediato, aunque la persona tenga la sesión abierta. Sus registros, notas y
  tareas se conservan.
- **Reactivar** devuelve el acceso con el mismo rol.

Cada cambio queda en **Configuración → Auditoría**.

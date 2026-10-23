---
title: Usuarios y roles
sidebar_position: 2
---

# Usuarios y roles

![Usuarios](/img/capturas/crm-usuarios.png)

## Roles

| Permiso | Prestador | Gestor | Administrador | Superadministrador |
|---|:---:|:---:|:---:|:---:|
| Ver y editar **sus** datos, establecimientos y reportes | ✓ | | | |
| Ver y editar **todos** los prestadores | | ✓ | ✓ | ✓ |
| Interacciones, tareas, etiquetas, notas internas | | ✓ | ✓ | ✓ |
| Reportes y exportes | | ✓ | ✓ | ✓ |
| Aprobar, rechazar y publicar en la web | | | ✓ | ✓ |
| Configuración (categorías, preguntas, indicadores…) | | | ✓ | ✓ |
| Crear usuarios del equipo y prestadores | | | ✓ | ✓ |
| Crear o modificar administradores superiores | | | | ✓ |
| Eliminar prestadores | | | ✓ | ✓ |

## Crear un usuario

**Nuevo usuario** pide nombre, correo, contraseña inicial (mínimo 8 caracteres) y rol. Comparte la contraseña por un
canal seguro y pide que la cambien al entrar.

Para una cuenta de **prestador** (por ejemplo, alguien inscrito por la Secretaría que ahora quiere entrar), indica el
**ID del prestador**: es el número al final de la dirección de su ficha (`/crm/actores/123`).

## Desactivar

Desmarca **Cuenta activa**: la persona no puede entrar y **se cierran todas sus sesiones**. También se cierran al
cambiarle la contraseña o el rol. Nadie puede desactivarse ni cambiarse el rol a sí mismo.

:::tip[El superadministrador inicial]
Se crea al instalar el sistema con el correo de `ADMIN_EMAIL`. Cambia su contraseña el primer día.
:::

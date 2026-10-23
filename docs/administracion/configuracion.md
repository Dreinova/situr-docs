---
title: Configuración
sidebar_position: 1
---

# Configuración

Aquí se define **qué se pregunta** en la inscripción y en los reportes. Los cambios aplican de inmediato para todos.

![Configuración](/img/capturas/crm-configuracion.png)

| Pestaña | Para qué sirve |
|---|---|
| **Categorías** | Los tipos de prestador (las del RNT más categorías locales como Artesanías). |
| **Tipos (subcategorías)** | El detalle dentro de cada categoría: hotel, glamping, cafetería… |
| **Campos adicionales** | Preguntas de perfil por categoría (horarios, mascotas, idiomas, tipo de comida…). |
| **Indicadores de reporte** | Las cifras periódicas: qué se pregunta, de qué tipo, cada cuánto y a qué categoría aplica. |
| **Tipos de turismo** | Las secciones temáticas de visitatenjo.com (senderismo, bodas, gastronómico…). |
| **Veredas** | Lista de veredas de Tenjo. |
| **Etiquetas** | Marcas internas para agrupar prestadores (ferias, capacitaciones pendientes…). |

## Campos adicionales

Cada campo tiene una **pregunta**, un **tipo de respuesta** (texto, número, una opción, varias opciones, sí/no,
fecha) y aplica a **todas las categorías** o a una sola. Para las de opciones, escribe **una opción por línea**.

## Indicadores

| Tipo | Validación |
|---|---|
| Número entero | Sin decimales, no negativo. |
| Número decimal | No negativo. |
| Porcentaje | Entre 0 y 100. |
| Pesos (COP) | No negativo; se muestra con formato de moneda. |
| Texto | Libre. |

:::caution[Cambiar o borrar]
- No cambies la **clave** ni el **identificador** de algo que ya tiene datos: lo usan la API pública y los reportes.
- En lugar de **eliminar**, **desactiva**: deja de aparecer en los formularios, pero se conservan las respuestas.
  El sistema no permite eliminar lo que está en uso.
:::

:::info[Origen de las preguntas]
Los campos e indicadores actuales se trajeron del formulario que la Secretaría ya había diseñado en el sistema anterior
(47 indicadores y 28 campos). Los de ejemplo con los que se instala el sistema quedaron desactivados.
:::

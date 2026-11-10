# Documentación SITUR Tenjo

Sitio de documentación del SITUR (Sistema de Información Turística de Tenjo), que funciona dentro del CRM Turismo
Tenjo (repositorio `oblicuaDev/imctt-crm`). Hecho con [Docusaurus 3](https://docusaurus.io/).

- `docs/`: guías de uso (prestadores, equipo del IMCTT, administración) y documentación técnica.
- `src/pages/index.tsx`: portada.
- `src/css/custom.css`: piel con la paleta de Visita Tenjo (ver `docs/tecnico/marca.md`).
- `static/img/capturas/`: capturas de pantalla **con datos de demostración**. No usar capturas con datos reales.

```powershell
npm install
npm start          # http://localhost:3000
npm run build      # genera build/ (falla si hay enlaces rotos)
npm run serve      # sirve build/ localmente
```

## Capturas

Se tomaron el 9/11/2026 del CRM (marca `imctt`, 1440×900) con una **cuenta de demostración** en una base local de
Supabase: «IMCTT (demostración)», con prestadores, correos (dominios `.example`) y respuestas ficticios. Nunca con la
cuenta real del IMCTT.

Los scripts están en `scripts/capturas/` (se corren desde la raíz del repositorio `imctt-crm`, con Node 22.18+):

| Script | Qué hace |
|---|---|
| `01-account.mjs` | Crea la cuenta demo y su superadministrador (`admin@demo-tenjo.test`). Luego se carga el catálogo con `scripts/imctt/seed-situr.mjs --nit 9001112223`. |
| `02-intake.mts` | Inscribe 8 prestadores ficticios por `public_form_intake`, con las mismas reglas del formulario. |
| `03-enrich.mts` | Equipo, estados de revisión, seguimiento, tareas y una encuesta con respuestas. |
| `cleanup.sql` | Borra los registros de la cuenta demo (no el catálogo ni los usuarios). |
| `shoot.mjs` | Inicia sesión y toma las capturas listadas en `shots.json` / `shots2.json` (Playwright). |

`lib.mjs` lee `local.env` (salida de `supabase status -o env`), que no se guarda en el repositorio. Los ids de los
JSON son los de la base local donde se tomaron.

> **Ojo:** la Edge Function `situr` busca un único formulario `situr` activo. Para capturar el formulario de la demo
> hay que desactivar temporalmente el de la otra cuenta y luego restaurarlo.

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

Las capturas de la aplicación anterior (`crm-tenjo`) se retiraron en noviembre de 2026, al pasar el SITUR al CRM.
Las nuevas se toman del CRM con la marca `imctt` y datos de demostración, y se agregan a las guías con
`![Descripción](/img/capturas/<nombre>.png)`.

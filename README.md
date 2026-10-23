# Documentación SITUR Tenjo

Sitio de documentación del SITUR (Sistema de Información Turística de Tenjo), hecho con [Docusaurus 3](https://docusaurus.io/).

- `docs/`: guías de uso (prestadores, equipo, administración) y documentación técnica.
- `src/pages/index.tsx`: portada.
- `src/css/custom.css`: piel con la paleta de Visita Tenjo (ver `docs/tecnico/marca.md`).
- `static/img/capturas/`: capturas de pantalla **con datos de demostración**. No reemplazarlas por capturas con datos reales.

```powershell
npm install
npm start          # http://localhost:3000
npm run build      # genera build/ (falla si hay enlaces rotos)
npm run serve      # sirve build/ localmente
```

Para regenerar las capturas: cargar `DemoSeeder` en el CRM local y ejecutar el script de Puppeteer de capturas
(ver `docs/tecnico/instalacion.md`).

import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// Dos menús: uno para quien usa el sistema y otro para quien lo mantiene.
const sidebars: SidebarsConfig = {
  guias: [
    'inicio',
    {
      type: 'category',
      label: 'Prestadores turísticos',
      collapsed: false,
      items: ['prestadores/inscripcion', 'prestadores/portal', 'prestadores/reportes'],
    },
    {
      type: 'category',
      label: 'Equipo de la Secretaría',
      collapsed: false,
      items: [
        'equipo/inicio-y-revisiones',
        'equipo/prestadores-y-seguimiento',
        'equipo/establecimientos-y-mapa',
        'equipo/reportes-situr',
        'equipo/tareas',
      ],
    },
    {
      type: 'category',
      label: 'Administración',
      items: ['administracion/configuracion', 'administracion/usuarios-y-roles'],
    },
    'preguntas-frecuentes',
  ],
  tecnico: [
    'tecnico/arquitectura',
    'tecnico/instalacion',
    'tecnico/api-publica',
    'tecnico/api-interna',
    'tecnico/migracion',
    'tecnico/despliegue',
    'tecnico/seguridad',
    'tecnico/marca',
  ],
};

export default sidebars;

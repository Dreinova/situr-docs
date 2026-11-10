import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// Dos menús: uno para quien usa el sistema y otro para quien lo mantiene.
const sidebars: SidebarsConfig = {
  guias: [
    'inicio',
    {
      type: 'category',
      label: 'Prestadores turísticos',
      collapsed: false,
      items: ['prestadores/inscripcion', 'prestadores/actualizar', 'prestadores/reportes'],
    },
    {
      type: 'category',
      label: 'Equipo del IMCTT',
      collapsed: false,
      items: [
        'equipo/primeros-pasos',
        'equipo/revisiones',
        'equipo/establecimientos',
        'equipo/empresas-y-contactos',
        'equipo/reportes-estadisticos',
        'equipo/encuestas',
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
    'tecnico/formulario-publico',
    'tecnico/visitatenjo',
    'tecnico/migracion',
    'tecnico/despliegue',
    'tecnico/seguridad',
    'tecnico/marca',
  ],
};

export default sidebars;

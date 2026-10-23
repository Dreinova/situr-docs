import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// Se ejecuta en Node.js: aquí no va código de navegador.

// Publicado en GitHub Pages: https://dreinova.github.io/situr-docs/
// Con un dominio propio (p. ej. docs.situr.visitatenjo.com) basta con DOCS_URL=https://… y DOCS_BASE_URL=/
const url = process.env.DOCS_URL ?? 'https://dreinova.github.io';
const baseUrl = process.env.DOCS_BASE_URL ?? '/situr-docs/';

const config: Config = {
  title: 'SITUR Tenjo',
  tagline: 'Documentación del Sistema de Información Turística de Tenjo',
  favicon: 'img/favicon.png',

  future: {
    v4: true,
  },

  url,
  baseUrl,
  organizationName: 'Dreinova',
  projectName: 'situr-docs',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
  },

  headTags: [
    {tagName: 'link', attributes: {rel: 'preconnect', href: 'https://fonts.googleapis.com'}},
    {tagName: 'link', attributes: {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous'}},
    {tagName: 'link', attributes: {rel: 'apple-touch-icon', href: `${baseUrl}img/apple-touch-icon.png`}},
  ],
  stylesheets: [
    'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700&family=IBM+Plex+Mono:wght@400;500&family=Public+Sans:wght@400;500;600;700&display=swap',
  ],

  markdown: {
    mermaid: true,
  },
  themes: [
    '@docusaurus/theme-mermaid',
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['es'],
        indexBlog: false,
        docsRouteBasePath: '/',
        highlightSearchTermsOnTargetPage: true,
        searchBarShortcutHint: false,
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          // La documentación es el sitio: las guías viven en la raíz (/inicio, /prestadores/…)
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          showLastUpdateTime: false,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/tarjeta-social.png',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'SITUR',
      style: 'primary',
      logo: {
        alt: 'Visita Tenjo',
        src: 'img/visita-tenjo-blanco.png',
      },
      items: [
        {type: 'docSidebar', sidebarId: 'guias', position: 'left', label: 'Guías de uso'},
        {type: 'docSidebar', sidebarId: 'tecnico', position: 'left', label: 'Documentación técnica'},
        {href: 'https://visitatenjo.com', label: 'visitatenjo.com', position: 'right'},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Guías',
          items: [
            {label: 'Prestadores', to: '/prestadores/inscripcion'},
            {label: 'Equipo de la Secretaría', to: '/equipo/inicio-y-revisiones'},
            {label: 'Administración', to: '/administracion/configuracion'},
          ],
        },
        {
          title: 'Técnico',
          items: [
            {label: 'Instalación local', to: '/tecnico/instalacion'},
            {label: 'API pública', to: '/tecnico/api-publica'},
            {label: 'Migración desde SITUR', to: '/tecnico/migracion'},
          ],
        },
        {
          title: 'Tenjo',
          items: [
            {label: 'visitatenjo.com', href: 'https://visitatenjo.com'},
            {label: 'Alcaldía de Tenjo', href: 'https://www.tenjo-cundinamarca.gov.co'},
          ],
        },
      ],
      copyright: `Secretaría de Desarrollo Económico y Turismo · Alcaldía de Tenjo · ${new Date().getFullYear()}`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: ['php', 'bash', 'powershell', 'sql', 'json'],
    },
    mermaid: {
      theme: {light: 'base', dark: 'dark'},
      options: {
        themeVariables: {
          primaryColor: '#ffe6e3',
          primaryBorderColor: '#d90e18',
          primaryTextColor: '#2a1b19',
          lineColor: '#766866',
          fontFamily: 'Public Sans, sans-serif',
        },
      },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

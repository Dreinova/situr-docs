import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

/** Curvas de nivel del cerro Juaica: la misma firma visual del CRM. */
function Curvas() {
  const lineas = Array.from({length: 14}, (_, i) => {
    const y = 40 + i * 34;
    const a = 26 + i * 4;
    return `M-20 ${y} C 80 ${y - a}, 150 ${y + a * 0.6}, 240 ${y - a * 0.4} S 380 ${y + a}, 520 ${y - a * 0.2}`;
  });
  return (
    <svg className={styles.curvas} viewBox="0 0 500 520" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1">
        {lineas.map((d, i) => (
          <path key={i} d={d} opacity={0.35 + (i % 4) * 0.12} />
        ))}
        <ellipse cx="360" cy="150" rx="70" ry="38" opacity="0.6" />
        <ellipse cx="360" cy="150" rx="44" ry="22" opacity="0.7" />
        <ellipse cx="360" cy="150" rx="18" ry="9" opacity="0.8" />
      </g>
    </svg>
  );
}

const RUTAS = [
  {
    titulo: 'Tengo un negocio turístico',
    texto: 'Inscríbete, mantén tus establecimientos al día, sube fotos y envía tus reportes periódicos.',
    enlace: '/prestadores/inscripcion',
    accion: 'Guía para prestadores',
  },
  {
    titulo: 'Trabajo en la Secretaría',
    texto: 'Revisa inscripciones, haz seguimiento a cada prestador, gestiona tareas y consulta los reportes SITUR.',
    enlace: '/equipo/inicio-y-revisiones',
    accion: 'Guía del equipo',
  },
  {
    titulo: 'Administro el sistema',
    texto: 'Define categorías, preguntas, indicadores y tipos de turismo; crea usuarios y asigna roles.',
    enlace: '/administracion/configuracion',
    accion: 'Guía de administración',
  },
  {
    titulo: 'Mantengo el código',
    texto: 'Arquitectura, instalación con Docker o XAMPP, API, migración desde el SITUR anterior y despliegue.',
    enlace: '/tecnico/arquitectura',
    accion: 'Documentación técnica',
  },
];

export default function Inicio(): ReactNode {
  return (
    <Layout title="Inicio" description="Documentación del SITUR, el Sistema de Información Turística de Tenjo">
      <header className={styles.hero}>
        <Curvas />
        <div className={`container ${styles.heroInterior}`}>
          <img src={useBaseUrl('/img/visita-tenjo-blanco.png')} alt="Visita Tenjo" className={styles.logo} width={161} height={92} />
          <Heading as="h1" className={styles.titulo}>
            Cada finca, café y sendero de Tenjo, en un solo lugar.
          </Heading>
          <p className={styles.bajada}>
            El SITUR es el sistema con el que la Secretaría de Desarrollo Económico y Turismo conoce a los prestadores
            turísticos del municipio, acompaña su formalización y publica su oferta en visitatenjo.com.
          </p>
          <div className={styles.botones}>
            <Link className={styles.botonClaro} to="/inicio">
              Empezar
            </Link>
            <Link className={styles.botonBorde} to="/preguntas-frecuentes">
              Preguntas frecuentes
            </Link>
          </div>
        </div>
      </header>
      <main className="container margin-vert--xl">
        <Heading as="h2" className={styles.subtitulo}>
          ¿Qué necesitas hacer?
        </Heading>
        <div className={styles.rutas}>
          {RUTAS.map((r) => (
            <Link key={r.enlace} to={r.enlace} className={styles.ruta}>
              <span className={styles.rutaTitulo}>{r.titulo}</span>
              <span className={styles.rutaTexto}>{r.texto}</span>
              <span className={styles.rutaAccion}>{r.accion} →</span>
            </Link>
          ))}
        </div>
      </main>
    </Layout>
  );
}

import { Link } from 'react-router';
import { VERSION_LEGAL } from '../../../shared/lib/legal.js';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { HeaderSitio } from '../../landing/components/HeaderSitio.jsx';
import { DOCUMENTOS } from '../documentos.js';
import css from './PantallaDocumento.module.css';

const ACTUALIZADO = new Date(`${VERSION_LEGAL}T15:00:00Z`).toLocaleDateString('es-AR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

// Términos o privacidad (S2): índice con anclas y la fecha de la versión.
export function PantallaDocumento({ doc }) {
  const d = DOCUMENTOS[doc];
  return (
    <>
      <HeaderSitio />
      <Pagina ancho="lectura">
        <TituloPagina migas={`Actualizado el ${ACTUALIZADO}`} titulo={d.titulo} />
        <nav aria-label="Índice" className={css.indice}>
          <ol>
            {d.secciones.map(([titulo], i) => (
              <li key={titulo}>
                <a href={`#s${i + 1}`}>{titulo}</a>
              </li>
            ))}
          </ol>
        </nav>
        {d.secciones.map(([titulo, parrafos], i) => (
          <section key={titulo} id={`s${i + 1}`} className={css.seccion}>
            <h2 className={css.titulo}>
              {i + 1}. {titulo}
            </h2>
            {parrafos.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>
        ))}
        <p className={css.otro}>
          Ver también: <Link to={d.otro.ruta}>{d.otro.texto}</Link>
        </p>
      </Pagina>
    </>
  );
}

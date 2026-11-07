import { fechaHora } from '../../../shared/lib/fechas.js';
import { Boton } from '../../../shared/ui/Boton.jsx';
import css from './HojaMas.module.css';

// Las últimas publicaciones; la primera es la que se ve hoy.
export function ListaVersiones({ lista, onVolver }) {
  const versiones = lista.datos ?? [];
  return (
    <section className={css.seccion} aria-labelledby="mas-versiones">
      <h3 id="mas-versiones" className={css.titulo}>
        Lo que publicaste antes
      </h3>
      {lista.cargando ? <p className={css.nota}>Buscando…</p> : null}
      {!lista.cargando && !versiones.length ? (
        <p className={css.nota}>Todavía no publicaste tu página.</p>
      ) : null}
      <ul className={css.lista}>
        {versiones.map((x, i) => (
          <li key={x.id} className={css.version}>
            <span>
              {fechaHora(x.creadaEn)}
              {i === 0 ? <span className={css.nota}> · la que se ve hoy</span> : null}
            </span>
            <Boton variante="texto" onClick={() => onVolver(x.id)}>
              Volver a esta
            </Boton>
          </li>
        ))}
      </ul>
    </section>
  );
}

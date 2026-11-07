import { useState } from 'react';
import { fechaHora } from '../../../shared/lib/fechas.js';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Hoja } from '../../../shared/ui/Hoja.jsx';
import { useVersiones } from '../hooks/useVersiones.js';
import css from './HojaMas.module.css';

// "Más": cambiar de plantilla, volver a una versión publicada o a la página de siempre.
export function HojaMas({ abierta, onCerrar, onPlantillas, alRestaurar, alVolver }) {
  const v = useVersiones(abierta, { alRestaurar, alVolver });
  const [seguro, setSeguro] = useState(false);
  const cerrar = () => {
    setSeguro(false);
    onCerrar();
  };
  const hacer =
    (accion) =>
    async (...args) =>
      (await accion.ejecutar(...args)).ok && cerrar();
  const versiones = v.lista.datos ?? [];
  return (
    <Hoja abierta={abierta} onCerrar={cerrar} titulo="Más opciones">
      <div className={css.cuerpo}>
        <Boton icono="dashboard_customize" anchoCompleto onClick={onPlantillas}>
          Cambiar de plantilla
        </Boton>
        <section className={css.seccion} aria-labelledby="mas-versiones">
          <h3 id="mas-versiones" className={css.titulo}>
            Lo que publicaste antes
          </h3>
          {v.lista.cargando ? <p className={css.nota}>Buscando…</p> : null}
          {!v.lista.cargando && !versiones.length ? (
            <p className={css.nota}>Todavía no publicaste tu página.</p>
          ) : null}
          <ul className={css.lista}>
            {versiones.map((x, i) => (
              <li key={x.id} className={css.version}>
                <span>
                  {fechaHora(x.creadaEn)}
                  {i === 0 ? <span className={css.nota}> · la que se ve hoy</span> : null}
                </span>
                <Boton variante="texto" onClick={() => hacer(v.restaurar)(x.id)}>
                  Volver a esta
                </Boton>
              </li>
            ))}
          </ul>
        </section>
        <section className={css.seccion}>
          <p className={css.nota}>
            La página de siempre es la que tu tienda tenía antes de armar la tuya.
          </p>
          <Boton
            variante={seguro ? 'peligro' : 'secundario'}
            anchoCompleto
            cargando={v.deSiempre.enviando}
            onClick={() => (seguro ? hacer(v.deSiempre)() : setSeguro(true))}
          >
            {seguro ? 'Sí, sacar mi página publicada' : 'Volver a la de siempre'}
          </Boton>
        </section>
      </div>
    </Hoja>
  );
}

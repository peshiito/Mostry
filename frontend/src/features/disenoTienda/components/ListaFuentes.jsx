import { useState } from 'react';
import { cargarFuentes } from '../../../shared/temaTienda/cargarFuentes.js';
import { familiaCss, fuente } from '../../../shared/temaTienda/fuentes.js';
import css from './ListaFuentes.module.css';

// Cada tipografía escrita con su propia letra. Se bajan recién al abrir la
// lista (son muchas y en el celular pesan).
export function ListaFuentes({ titulo, nombre, lista, valor, muestra, onElegir }) {
  const [abierta, setAbierta] = useState(false);
  const actual = fuente(valor);
  function alternar(e) {
    setAbierta(e.currentTarget.open);
    if (e.currentTarget.open) cargarFuentes(lista.map((f) => f.clave));
  }
  return (
    <details className={css.caja} onToggle={alternar}>
      <summary className={css.resumen}>
        <span className={css.etiqueta}>{titulo}</span>
        <span className={css.actual} style={{ fontFamily: familiaCss(valor) }}>
          {actual?.nombre ?? valor}
        </span>
      </summary>
      {abierta ? (
        <div className={css.lista} role="radiogroup" aria-label={titulo}>
          {lista.map((f) => (
            <label key={f.clave} className={css.opcion}>
              <input
                type="radio"
                name={nombre}
                checked={valor === f.clave}
                onChange={() => onElegir(f.clave)}
              />
              <span className={css.muestra} style={{ fontFamily: familiaCss(f.clave) }}>
                {muestra}
              </span>
              <span className={css.dato}>
                {f.nombre} · {f.estilo}
              </span>
            </label>
          ))}
        </div>
      ) : null}
    </details>
  );
}

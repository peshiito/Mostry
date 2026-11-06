import { Hoja } from '../../../shared/ui/Hoja.jsx';
import { Icono } from '../../../shared/ui/Icono.jsx';
import { REGISTRO } from '../../pagina/bloques/registro.js';
import { BIBLIOTECA } from '../lib/biblioteca.js';
import css from './HojaBiblioteca.module.css';

// "Agregar bloque": elegís uno y entra al final de la página (después se mueve).
export function HojaBiblioteca({ abierta, onCerrar, onElegir }) {
  return (
    <Hoja abierta={abierta} onCerrar={onCerrar} titulo="Agregar un bloque" ancha>
      <div className={css.grupos}>
        {BIBLIOTECA.map(([grupo, bloques]) => (
          <section key={grupo} className={css.grupo}>
            <h3 className={css.titulo}>{grupo}</h3>
            <ul className={css.lista}>
              {bloques.map(([tipo, para]) => (
                <li key={tipo}>
                  <button
                    type="button"
                    className={css.opcion}
                    onClick={() => onElegir(tipo)}
                  >
                    <span className={css.icono}>
                      <Icono nombre={REGISTRO[tipo].icono} tamano={22} />
                    </span>
                    <span>
                      <strong>{REGISTRO[tipo].nombre}</strong>
                      <span className={css.para}>{para}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Hoja>
  );
}

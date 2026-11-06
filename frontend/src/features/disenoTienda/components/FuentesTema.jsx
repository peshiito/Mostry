import { FUENTES, FUENTES_TEXTO } from '../../../shared/temaTienda/fuentes.js';
import { Campo } from '../../../shared/ui/Campo.jsx';
import { Selector } from '../../../shared/ui/Selector.jsx';
import css from './Personalizar.module.css';

const opciones = (lista) =>
  lista.map((f) => ({ valor: f.clave, texto: `${f.nombre} · ${f.estilo}` }));

// Tipografías: cualquiera para títulos; para el texto, solo las que se leen bien.
export function FuentesTema({ fuentes, onCambio }) {
  return (
    <fieldset className={css.grupo}>
      <legend className={css.leyenda}>Tipografías</legend>
      <Campo etiqueta="Títulos y nombre de la tienda">
        {(c) => (
          <Selector
            c={c}
            opciones={opciones(FUENTES)}
            value={fuentes.titulos}
            onChange={(e) => onCambio({ ...fuentes, titulos: e.target.value })}
          />
        )}
      </Campo>
      <Campo etiqueta="Texto" ayuda="Para descripciones y precios: siempre legible.">
        {(c) => (
          <Selector
            c={c}
            opciones={opciones(FUENTES_TEXTO)}
            value={fuentes.texto}
            onChange={(e) => onCambio({ ...fuentes, texto: e.target.value })}
          />
        )}
      </Campo>
    </fieldset>
  );
}

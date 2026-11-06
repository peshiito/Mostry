import { FUENTES, FUENTES_TEXTO } from '../../../shared/temaTienda/fuentes.js';
import { ListaFuentes } from './ListaFuentes.jsx';
import css from './Personalizar.module.css';

// Tipografías: cualquiera para títulos; para el texto, solo las que se leen bien.
export function FuentesTema({ fuentes, nombreTienda = 'Tu tienda', onCambio }) {
  return (
    <fieldset className={css.grupo}>
      <legend className={css.leyenda}>Tipografías</legend>
      <ListaFuentes
        titulo="Títulos y nombre de la tienda"
        nombre="fuente-titulos"
        lista={FUENTES}
        valor={fuentes.titulos}
        muestra={nombreTienda}
        onElegir={(titulos) => onCambio({ ...fuentes, titulos })}
      />
      <ListaFuentes
        titulo="Texto (descripciones y precios)"
        nombre="fuente-texto"
        lista={FUENTES_TEXTO}
        valor={fuentes.texto}
        muestra="Facturas recién hechas · $ 4.200"
        onElegir={(texto) => onCambio({ ...fuentes, texto })}
      />
    </fieldset>
  );
}

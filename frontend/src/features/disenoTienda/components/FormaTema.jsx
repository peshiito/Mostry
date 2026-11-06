import { Segmentado } from '../../../shared/ui/Segmentado.jsx';
import css from './Personalizar.module.css';

const FORMAS = [
  { valor: 'recta', texto: 'Recta' },
  { valor: 'suave', texto: 'Suave' },
  { valor: 'redonda', texto: 'Redonda' },
];
const ENCABEZADOS = [
  { valor: 'toldo', texto: 'Toldo' },
  { valor: 'portada', texto: 'Portada' },
  { valor: 'minimo', texto: 'Mínimo' },
];

// Forma de tarjetas y botones, y estilo del encabezado de la vidriera.
export function FormaTema({ tema, onCambio }) {
  return (
    <fieldset className={css.grupo}>
      <legend className={css.leyenda}>Forma</legend>
      <p className={css.etiqueta}>Bordes de tarjetas y botones</p>
      <Segmentado
        etiqueta="Bordes"
        opciones={FORMAS}
        valor={tema.forma}
        onCambio={(forma) => onCambio({ forma })}
      />
      <p className={css.etiqueta}>Encabezado</p>
      <Segmentado
        etiqueta="Encabezado"
        opciones={ENCABEZADOS}
        valor={tema.encabezado}
        onCambio={(encabezado) => onCambio({ encabezado })}
      />
    </fieldset>
  );
}

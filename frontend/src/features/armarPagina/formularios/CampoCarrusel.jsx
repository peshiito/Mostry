import { Opcion } from './campos.jsx';

const SEGUNDOS = [2, 3, 4, 5, 6, 8, 10].map((n) => [n, `Cada ${n} segundos`]);
const PASO = [
  ['fundido', 'Fundido'],
  ['deslizar', 'Deslizando'],
];

// Cada cuánto y cómo pasan las imágenes de la portada.
export function CampoCarrusel({ carrusel, onCambio }) {
  return (
    <>
      <Opcion
        etiqueta="Cambia"
        opciones={SEGUNDOS}
        valor={carrusel.segundos}
        onCambio={(s) => onCambio({ ...carrusel, segundos: Number(s) })}
      />
      <Opcion
        etiqueta="Cómo pasa"
        opciones={PASO}
        valor={carrusel.transicion}
        onCambio={(transicion) => onCambio({ ...carrusel, transicion })}
      />
    </>
  );
}

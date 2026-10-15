import { encode } from 'uqr';
import css from './TarjetaQr.module.css';

// El QR dibujado en SVG con <rect> (sin innerHTML). Un módulo = 1 unidad.
export function CodigoQr({ texto }) {
  const { data, size } = encode(texto, { ecc: 'M', border: 2 });
  const cuadros = [];
  data.forEach((fila, y) =>
    fila.forEach((lleno, x) => {
      if (lleno)
        cuadros.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />);
    }),
  );
  return (
    <svg
      className={css.qr}
      viewBox={`0 0 ${size} ${size}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label={`Código QR de ${texto}`}
    >
      {cuadros}
    </svg>
  );
}

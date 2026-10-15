import { Fila } from '../../../shared/ui/Fila.jsx';
import { Icono } from '../../../shared/ui/Icono.jsx';
import { textoCompras, textoPremio } from '../../club/lib/textoPremio.js';

// Un escalón del club en la lista: "A las 5 compras · 20 % de descuento".
export function FilaPremio({ premio, onEditar }) {
  return (
    <Fila
      inicio={<Icono nombre="redeem" />}
      titulo={`A las ${textoCompras(premio.compras)}`}
      detalle={textoPremio(premio)}
      flecha
      onClick={onEditar}
    />
  );
}

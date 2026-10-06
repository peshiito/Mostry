import { plata } from '../../../shared/lib/plata.js';
import { Aviso } from '../../../shared/ui/Aviso.jsx';

// Resultado en vivo del arqueo: coincide, sobra o falta.
export function Diferencia({ valor }) {
  if (valor === null) return null;
  if (valor === 0) return <Aviso tipo="ok" titulo="Coincide justo" />;
  if (valor > 0) return <Aviso tipo="ok" titulo={`Sobran ${plata(valor)}`} />;
  return (
    <Aviso tipo="error" titulo={`Faltan ${plata(-valor)}`}>
      Queda asentado en el cierre. Revisá vueltos y pagos en efectivo del día.
    </Aviso>
  );
}

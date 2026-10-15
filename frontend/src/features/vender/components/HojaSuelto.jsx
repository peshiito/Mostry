import { useState } from 'react';
import { aCentavos } from '../../../shared/lib/plata.js';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import { Hoja } from '../../../shared/ui/Hoja.jsx';

// Un monto sin producto (algo que no está cargado, una bolsa, un redondeo).
export function HojaSuelto({ abierta, onCerrar, onAgregar }) {
  const [monto, setMonto] = useState('');
  const [concepto, setConcepto] = useState('');
  const centavos = aCentavos(monto);
  const agregar = () => {
    onAgregar({ monto: centavos, concepto: concepto.trim() || undefined });
    setMonto('');
    setConcepto('');
    onCerrar();
  };
  return (
    <Hoja abierta={abierta} onCerrar={onCerrar} titulo="Monto suelto">
      <Campo etiqueta="Monto">
        {(c) => (
          <Entrada
            c={c}
            prefijo="$"
            inputMode="decimal"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
          />
        )}
      </Campo>
      <Campo etiqueta="Qué es (opcional)">
        {(c) => (
          <Entrada
            c={c}
            maxLength={80}
            value={concepto}
            onChange={(e) => setConcepto(e.target.value)}
          />
        )}
      </Campo>
      <Boton
        variante="verde"
        tamano="lg"
        anchoCompleto
        disabled={!centavos}
        onClick={agregar}
      >
        Agregar a la venta
      </Boton>
    </Hoja>
  );
}

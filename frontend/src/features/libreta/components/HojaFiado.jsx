import { useState } from 'react';
import { aCentavos } from '../../../shared/lib/plata.js';
import { Aviso } from '../../../shared/ui/Aviso.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import { Hoja } from '../../../shared/ui/Hoja.jsx';
import { Segmentado } from '../../../shared/ui/Segmentado.jsx';
import { MEDIOS } from '../../gastos/lib/opciones.js';

// Anotar deuda o registrar pago. Un pago entra a la caja automáticamente (6.4).
export function HojaFiado({ tipo, onCerrar, onGuardar }) {
  const [monto, setMonto] = useState('');
  const [detalle, setDetalle] = useState('');
  const [medio, setMedio] = useState('efectivo');
  const [error, setError] = useState('');
  function guardar() {
    const c = aCentavos(monto);
    if (!c) return setError('Escribí el monto.');
    onGuardar({
      tipo,
      monto: c,
      medio,
      detalle: detalle.trim() || (tipo === 'pago' ? 'Pago' : 'Fiado'),
    });
  }
  return (
    <Hoja
      abierta={!!tipo}
      onCerrar={onCerrar}
      titulo={tipo === 'pago' ? 'Registrar pago' : 'Anotar deuda'}
    >
      <Campo etiqueta="Monto" error={error}>
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
      <Campo etiqueta="Detalle">
        {(c) => (
          <Entrada c={c} value={detalle} onChange={(e) => setDetalle(e.target.value)} />
        )}
      </Campo>
      {tipo === 'pago' ? (
        <>
          <Segmentado
            etiqueta="Medio"
            opciones={MEDIOS}
            valor={medio}
            onCambio={setMedio}
          />
          <Aviso>Se suma a la caja de hoy.</Aviso>
        </>
      ) : null}
      <Boton variante="principal" tamano="lg" anchoCompleto onClick={guardar}>
        Guardar
      </Boton>
    </Hoja>
  );
}

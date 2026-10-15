import { useState } from 'react';
import { aCentavos } from '../../../shared/lib/plata.js';
import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import { Segmentado } from '../../../shared/ui/Segmentado.jsx';

const VENCE = [
  { valor: 0, texto: 'Nunca' },
  { valor: 3, texto: '3 meses' },
  { valor: 6, texto: '6 meses' },
  { valor: 12, texto: '1 año' },
];
const pesos = (c) => (c ? String(c / 100).replace('.', ',') : '');

// Nombre, compra mínima y vencimiento de los sellos.
export function ReglasClub({ p, cambiar }) {
  const [minima, setMinima] = useState(pesos(p.compraMinima));
  return (
    <>
      <Campo etiqueta="Nombre del club">
        {(c) => (
          <Entrada
            c={c}
            maxLength={40}
            value={p.nombre}
            onChange={(e) => cambiar('nombre', e.target.value)}
          />
        )}
      </Campo>
      <Campo
        etiqueta="Compra mínima para sumar un sello"
        ayuda="Vacío = cualquier compra suma."
        error={p.compraMinima === null ? 'Revisá el monto.' : undefined}
      >
        {(c) => (
          <Entrada
            c={c}
            inputMode="decimal"
            prefijo="$"
            value={minima}
            onChange={(e) => {
              setMinima(e.target.value);
              cambiar(
                'compraMinima',
                e.target.value.trim() ? aCentavos(e.target.value) : 0,
              );
            }}
          />
        )}
      </Campo>
      <Segmentado
        etiqueta="Cuánto duran los sellos"
        opciones={VENCE}
        valor={p.venceMeses ?? 0}
        onCambio={(v) => cambiar('venceMeses', v || null)}
      />
    </>
  );
}

import { useState } from 'react';
import { aCentavos } from '../../../shared/lib/plata.js';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import { Hoja } from '../../../shared/ui/Hoja.jsx';
import { Segmentado } from '../../../shared/ui/Segmentado.jsx';

const TITULOS = {
  ingreso: 'Registrar ingreso',
  egreso: 'Registrar egreso',
  deposito: 'Depositar en el banco',
};
const MEDIOS = [
  { valor: 'efectivo', texto: 'Efectivo' },
  { valor: 'transferencia', texto: 'Transferencia' },
];

// Movimiento manual. Un depósito siempre es efectivo que sale de la caja.
export function HojaMovimiento({ tipo, onCerrar, onGuardar }) {
  const [medio, setMedio] = useState('efectivo');
  const [monto, setMonto] = useState('');
  const [concepto, setConcepto] = useState('');
  const [error, setError] = useState('');
  function guardar() {
    const c = aCentavos(monto);
    if (!c) return setError('Escribí un monto mayor a cero.');
    const m = tipo === 'deposito' ? 'efectivo' : medio;
    onGuardar({ tipo, medio: m, monto: c, concepto: concepto.trim() || TITULOS[tipo] });
  }
  return (
    <Hoja abierta={!!tipo} onCerrar={onCerrar} titulo={TITULOS[tipo] ?? ''}>
      {tipo === 'deposito' ? null : (
        <Segmentado
          etiqueta="Medio"
          opciones={MEDIOS}
          valor={medio}
          onCambio={setMedio}
        />
      )}
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
      <Campo etiqueta="Concepto">
        {(c) => (
          <Entrada c={c} value={concepto} onChange={(e) => setConcepto(e.target.value)} />
        )}
      </Campo>
      <Boton variante="principal" tamano="lg" anchoCompleto onClick={guardar}>
        Guardar
      </Boton>
    </Hoja>
  );
}

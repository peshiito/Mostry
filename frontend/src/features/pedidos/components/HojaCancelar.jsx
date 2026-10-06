import { useState } from 'react';
import { plata } from '../../../shared/lib/plata.js';
import { Aviso } from '../../../shared/ui/Aviso.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { AreaTexto, Campo } from '../../../shared/ui/Campo.jsx';
import { Hoja } from '../../../shared/ui/Hoja.jsx';
import { Segmentado } from '../../../shared/ui/Segmentado.jsx';
import { MEDIOS } from '../../gastos/lib/opciones.js';

const PAGADOS = [
  'pago_aprobado',
  'confirmado',
  'en_preparacion',
  'en_camino',
  'listo_retirar',
];

// Cancelar con motivo obligatorio. Si ya pagó, la devolución queda como egreso (decisión 26).
export function HojaCancelar({ abierta, onCerrar, pedido, onCancelar }) {
  const [motivo, setMotivo] = useState('');
  const [medio, setMedio] = useState('transferencia');
  const [error, setError] = useState('');
  const pagado =
    PAGADOS.includes(pedido.estado) && (pedido.sena > 0 || pedido.tipo === 'inmediato');
  function confirmar() {
    if (motivo.trim().length < 3)
      return setError('Contale al cliente por qué se cancela.');
    onCancelar(motivo.trim(), pagado ? { medio } : undefined);
  }
  return (
    <Hoja
      abierta={abierta}
      onCerrar={onCerrar}
      titulo={`Cancelar pedido #${pedido.numero}`}
    >
      <Campo etiqueta="Motivo (lo ve el cliente)" error={error}>
        {(c) => (
          <AreaTexto c={c} value={motivo} onChange={(e) => setMotivo(e.target.value)} />
        )}
      </Campo>
      {pagado ? (
        <>
          <Aviso
            tipo="alerta"
            titulo={`Ya te pagó: devolvé ${plata(pedido.sena || pedido.total)}`}
          />
          <Segmentado
            etiqueta="¿Cómo se lo devolvés?"
            opciones={MEDIOS}
            valor={medio}
            onCambio={setMedio}
          />
        </>
      ) : null}
      <Boton variante="peligro" tamano="lg" anchoCompleto onClick={confirmar}>
        Cancelar pedido
      </Boton>
    </Hoja>
  );
}

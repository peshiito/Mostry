import { useState } from 'react';
import { Aviso } from '../../../shared/ui/Aviso.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { AreaTexto, Campo } from '../../../shared/ui/Campo.jsx';
import { Chips } from '../../../shared/ui/Chips.jsx';
import { Hoja } from '../../../shared/ui/Hoja.jsx';

const RAPIDOS = ['No llegó la plata', 'Monto distinto', 'Comprobante ilegible'];

// Rechazo con motivo obligatorio. El segundo rechazo cancela el pedido (6.1).
export function HojaRechazo({ abierta, onCerrar, pedido, onRechazar }) {
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState('');
  const ultimo = pedido.rechazos >= 1;
  function confirmar() {
    if (motivo.trim().length < 3)
      return setError('El motivo es obligatorio: lo ve el cliente.');
    onRechazar(motivo.trim());
  }
  return (
    <Hoja
      abierta={abierta}
      onCerrar={onCerrar}
      titulo="Rechazar comprobante"
      subtitulo={`Pedido #${pedido.numero} · ${pedido.cliente}`}
    >
      <Chips
        etiqueta="Motivos frecuentes"
        opciones={RAPIDOS.map((m) => ({ valor: m, texto: m }))}
        valor={motivo}
        onCambio={setMotivo}
      />
      <Campo etiqueta="Motivo" error={error}>
        {(c) => (
          <AreaTexto c={c} value={motivo} onChange={(e) => setMotivo(e.target.value)} />
        )}
      </Campo>
      <Aviso tipo={ultimo ? 'error' : 'alerta'}>
        {ultimo
          ? 'Es el segundo rechazo: el pedido se cancela y se libera el stock.'
          : 'Es el primer rechazo: el cliente puede mandar otro una sola vez más.'}
      </Aviso>
      <Boton variante="peligro" tamano="lg" anchoCompleto onClick={confirmar}>
        {ultimo ? 'Rechazar y cancelar pedido' : 'Rechazar comprobante'}
      </Boton>
    </Hoja>
  );
}

import { ErrorCarga } from '../../../shared/ui/ErrorCarga.jsx';
import { useState } from 'react';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { useTurnosDia } from '../hooks/useTurnosDia.js';
import { turnosDelDia } from '../lib/agenda.js';
import { Calendario } from '../../../shared/ui/Calendario.jsx';
import { Turnos } from './Turnos.jsx';

// Calendario + horarios. Los días se estiman con los horarios de la tienda
// y los turnos del día elegido se confirman con la API.
export function ElegirTurno({ tienda, turno, onTurno }) {
  const [dia, setDia] = useState(null);
  const { tramos, anticipacionEncargoHoras } = tienda;
  const {
    turnos,
    motivo,
    cargando,
    error: errorCarga,
    recargar,
  } = useTurnosDia(dia, anticipacionEncargoHoras);
  if (errorCarga)
    return (
      <ErrorCarga
        que="los horarios disponibles"
        onReintentar={recargar}
        conPagina={false}
      />
    );
  return (
    <>
      <Tarjeta>
        <Calendario
          elegido={dia}
          onElegir={(f) => {
            setDia(f);
            onTurno(null);
          }}
          disponible={(f) =>
            turnosDelDia(f, tramos, [], anticipacionEncargoHoras).length > 0
          }
        />
      </Tarjeta>
      <Tarjeta>
        {motivo ? <p>Ese día no toman encargos. Elegí otro.</p> : null}
        {cargando ? <p>Buscando horarios…</p> : null}
        {!motivo && !cargando ? (
          <Turnos turnos={turnos} elegido={turno} onElegir={onTurno} />
        ) : null}
      </Tarjeta>
    </>
  );
}

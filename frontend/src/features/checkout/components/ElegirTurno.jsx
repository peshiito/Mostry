import { ErrorCarga } from '../../../shared/ui/ErrorCarga.jsx';
import { useState } from 'react';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { useTurnosDia } from '../hooks/useTurnosDia.js';
import { turnosDelDia } from '../lib/agenda.js';
import { Calendario } from '../../../shared/ui/Calendario.jsx';
import { Turnos } from './Turnos.jsx';

// Calendario + horarios. Los días se estiman con los horarios de la tienda
// y los turnos del día elegido se confirman con la API.
// `anticipacion`: la mayor del carrito; `productos`: sus ids (Encargos 3).
export function ElegirTurno({ tienda, anticipacion, productos, turno, onTurno }) {
  const [dia, setDia] = useState(null);
  const { tramos } = tienda;
  const {
    turnos,
    motivo,
    cargando,
    error: errorCarga,
    recargar,
  } = useTurnosDia(dia, anticipacion, productos);
  if (errorCarga)
    return (
      <ErrorCarga
        error={errorCarga}
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
          disponible={(f) => turnosDelDia(f, tramos, [], anticipacion).length > 0}
        />
      </Tarjeta>
      <Tarjeta>
        {motivo ? (
          <p>
            {motivo === 'sin_cupo'
              ? 'Ese día ya no toman más encargos. Elegí otro.'
              : 'Ese día no toman encargos. Elegí otro.'}
          </p>
        ) : null}
        {cargando ? <p>Buscando horarios…</p> : null}
        {!motivo && !cargando ? (
          <Turnos turnos={turnos} elegido={turno} onElegir={onTurno} />
        ) : null}
      </Tarjeta>
    </>
  );
}

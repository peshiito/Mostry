import { useState } from 'react';
import { fechaCorta } from '../../../shared/lib/fechas.js';
import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { BotonIcono } from '../../../shared/ui/BotonIcono.jsx';
import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import { Fila } from '../../../shared/ui/Fila.jsx';
import { Lista } from '../../../shared/ui/Lista.jsx';

// Días cerrados puntuales. Se pueden quitar (decisión de la Etapa 4).
export function Feriados({ feriados, onAgregar, onQuitar, error }) {
  const [fecha, setFecha] = useState('');
  const [motivo, setMotivo] = useState('');
  async function agregar() {
    if ((await onAgregar(fecha, motivo.trim() || undefined)).ok)
      setFecha('') || setMotivo('');
  }
  return (
    <>
      <AvisoError error={error} />
      {feriados.length ? (
        <Lista>
          {feriados.map((f) => (
            <Fila
              key={f.id}
              titulo={fechaCorta(`${f.fecha}T15:00:00Z`)}
              detalle={f.motivo ?? 'Cerrado'}
              fin={
                <BotonIcono
                  icono="delete"
                  etiqueta="Quitar día"
                  onClick={() => onQuitar(f.id)}
                />
              }
            />
          ))}
        </Lista>
      ) : null}
      <Campo etiqueta="Agregar día cerrado">
        {(c) => (
          <Entrada
            c={c}
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        )}
      </Campo>
      <Campo etiqueta="Motivo (opcional)">
        {(c) => (
          <Entrada c={c} value={motivo} onChange={(e) => setMotivo(e.target.value)} />
        )}
      </Campo>
      <Boton icono="add" disabled={!fecha} onClick={agregar}>
        Agregar día
      </Boton>
    </>
  );
}

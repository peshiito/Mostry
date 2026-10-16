import { useState } from 'react';
import { useAccion } from '../../../shared/api/useAccion.js';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Interruptor } from '../../../shared/ui/Interruptor.jsx';
import { SelectorHora } from '../../../shared/ui/SelectorHora.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { panel } from '../../panelBase/panelApi.js';
import css from './Avisos.module.css';

// Horario de silencio: en ese rango los avisos llegan igual, pero sin sonido
// ni vibración, y quedan en la bandeja para verlos a la mañana.
export function SilencioAvisos({ silencio, onGuardado }) {
  const [s, setS] = useState(silencio);
  const activo = s.desde !== null;
  const guardar = useAccion((cuerpo) => panel.put('/avisos/silencio', cuerpo), {
    exito: 'Horario de silencio guardado',
  });
  const cambiado = s.desde !== silencio.desde || s.hasta !== silencio.hasta;
  return (
    <Tarjeta className={css.bloque}>
      <Interruptor
        etiqueta="Horario de silencio"
        ayuda="Los pedidos de la noche llegan sin sonido y los ves a la mañana"
        activo={activo}
        onCambio={(v) =>
          setS(v ? { desde: '23:00', hasta: '07:00' } : { desde: null, hasta: null })
        }
      />
      {activo ? (
        <div className={css.horas}>
          <SelectorHora
            etiqueta="Desde"
            valor={s.desde}
            onCambio={(desde) => setS({ ...s, desde })}
          />
          <SelectorHora
            etiqueta="Hasta"
            valor={s.hasta}
            onCambio={(hasta) => setS({ ...s, hasta })}
          />
        </div>
      ) : null}
      {cambiado ? (
        <Boton
          anchoCompleto
          cargando={guardar.enviando}
          onClick={async () => (await guardar.ejecutar(s)).ok && onGuardado()}
        >
          Guardar horario
        </Boton>
      ) : null}
    </Tarjeta>
  );
}

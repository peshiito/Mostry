import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Fila } from '../../../shared/ui/Fila.jsx';
import { Icono } from '../../../shared/ui/Icono.jsx';
import { Interruptor } from '../../../shared/ui/Interruptor.jsx';
import { Lista } from '../../../shared/ui/Lista.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';

// Prender o apagar el club, al toque (prender pide premios guardados), y el
// acceso a los socios.
export function InterruptorClub({ activo, accion }) {
  return (
    <>
      <Tarjeta>
        <Interruptor
          etiqueta="Club prendido"
          ayuda="Apagarlo no borra los sellos de nadie."
          activo={activo}
          onCambio={(v) => accion.ejecutar(v)}
        />
      </Tarjeta>
      <AvisoError error={accion.error} />
      <Lista>
        <Fila
          to="socios"
          inicio={<Icono nombre="group" />}
          titulo="Socios"
          detalle="Quiénes te compran con el Club y sus sellos"
          flecha
        />
      </Lista>
    </>
  );
}

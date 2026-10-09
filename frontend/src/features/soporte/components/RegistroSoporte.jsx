import { fechaHora } from '../../../shared/lib/fechas.js';
import { Fila } from '../../../shared/ui/Fila.jsx';
import { Lista } from '../../../shared/ui/Lista.jsx';
import { Seccion } from '../../../shared/ui/Seccion.jsx';

// Todo lo que cambió Mostry con el permiso de soporte, lo último primero.
export function RegistroSoporte({ registro }) {
  return (
    <Seccion titulo="Lo que hizo Mostry en tu tienda">
      {registro.length ? (
        <Lista>
          {registro.map((r) => (
            <Fila key={r.id} titulo={r.accion} detalle={fechaHora(r.creadoEn)} />
          ))}
        </Lista>
      ) : (
        <p>Todavía nada.</p>
      )}
    </Seccion>
  );
}

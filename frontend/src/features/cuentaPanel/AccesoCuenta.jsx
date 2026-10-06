import { Boton } from '../../shared/ui/Boton.jsx';
import { Fila } from '../../shared/ui/Fila.jsx';
import { Lista } from '../../shared/ui/Lista.jsx';

// Email y contraseña (cambiarla pide la actual).
export function AccesoCuenta({ email, onCambiarClave }) {
  return (
    <Lista>
      <Fila titulo="Email" detalle={email} />
      <Fila
        titulo="Contraseña"
        fin={
          <Boton tamano="sm" onClick={onCambiarClave}>
            Cambiar
          </Boton>
        }
      />
    </Lista>
  );
}

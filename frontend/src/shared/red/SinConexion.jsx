import { Icono } from '../ui/Icono.jsx';
import css from './SinConexion.module.css';
import { useConexion } from './useConexion.js';

// Franja fija arriba cuando se corta internet. Lo que se ve puede no estar al día
// y lo que se guarde va a fallar, así que se avisa sin tapar la pantalla.
export function SinConexion() {
  const conectado = useConexion();
  return (
    <div role="status" className={css.contenedor}>
      {conectado ? null : (
        <p className={css.franja}>
          <Icono nombre="wifi_off" tamano={18} />
          Sin conexión · revisá tu internet
        </p>
      )}
    </div>
  );
}

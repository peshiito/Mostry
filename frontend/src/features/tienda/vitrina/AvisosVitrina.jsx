import { Aviso } from '../../../shared/ui/Aviso.jsx';
import css from './AvisosVitrina.module.css';

// Avisos de la vidriera, con el mismo margen lateral que las secciones.
export const Margen = ({ children }) => <div className={css.margen}>{children}</div>;

export function AvisoCerrada({ estado }) {
  if (estado !== 'cerrada') return null;
  return (
    <Margen>
      <Aviso tipo="alerta" titulo="Ahora solo tomamos encargos" icono="schedule">
        El local está cerrado. Podés hacer un encargo para otro día.
      </Aviso>
    </Margen>
  );
}

export function AvisoEnvio({ tienda }) {
  if (!tienda.aceptaEnvio) return null;
  return (
    <Margen>
      <Aviso icono="local_shipping">
        Envíos {tienda.zonaEnvio.toLowerCase()} o retiro en el local.
      </Aviso>
    </Margen>
  );
}

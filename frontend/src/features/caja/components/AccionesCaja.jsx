import { Boton } from '../../../shared/ui/Boton.jsx';
import css from './AccionesCaja.module.css';

export function AccionesCaja({ onElegir, deshabilitado }) {
  return (
    <div className={css.acciones}>
      <Boton
        icono="south_west"
        disabled={deshabilitado}
        onClick={() => onElegir('ingreso')}
      >
        Ingreso
      </Boton>
      <Boton
        icono="north_east"
        disabled={deshabilitado}
        onClick={() => onElegir('egreso')}
      >
        Egreso
      </Boton>
      <Boton
        icono="savings"
        disabled={deshabilitado}
        onClick={() => onElegir('deposito')}
      >
        Depósito
      </Boton>
    </div>
  );
}

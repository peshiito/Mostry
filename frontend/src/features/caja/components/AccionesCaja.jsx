import { Boton } from '../../../shared/ui/Boton.jsx';
import css from './AccionesCaja.module.css';

// Venta en el local (Mejoras 3 C) y movimientos a mano de la caja.
export function AccionesCaja({ onElegir, deshabilitado }) {
  return (
    <>
      <Boton variante="verde" icono="shopping_bag" anchoCompleto to="/panel/vender">
        Venta en el local
      </Boton>
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
    </>
  );
}

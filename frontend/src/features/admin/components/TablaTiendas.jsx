import { FilaTienda } from './FilaTienda.jsx';
import css from './TablaTiendas.module.css';
import { ListaAnimada } from '../../../shared/movimiento/ListaAnimada.jsx';

const COLUMNAS = ['Tienda', 'Email del dueño', 'Estado', 'Vence', 'Alta', 'Contacto'];

export function TablaTiendas({ tiendas, onWhatsapp }) {
  return (
    <div className={css.marco}>
      <table className={css.tabla}>
        <thead>
          <tr>
            {COLUMNAS.map((c) => (
              <th key={c} scope="col">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <ListaAnimada as="tbody">
          {tiendas.map((t, i) => (
            <FilaTienda key={t.id} i={i} tienda={t} onWhatsapp={onWhatsapp} />
          ))}
        </ListaAnimada>
      </table>
    </div>
  );
}

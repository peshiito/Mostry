import { FilaTienda } from './FilaTienda.jsx';
import css from './TablaTiendas.module.css';

const COLUMNAS = ['Tienda', 'Email del dueño', 'Estado', 'Vence', 'Alta'];

export function TablaTiendas({ tiendas }) {
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
        <tbody>
          {tiendas.map((t) => (
            <FilaTienda key={t.id} tienda={t} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

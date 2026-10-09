import { Boton } from '../../../shared/ui/Boton.jsx';
import { Cantidad } from '../../../shared/ui/Cantidad.jsx';
import { Monto } from '../../../shared/ui/Monto.jsx';
import { useCarrito } from '../useCarrito.js';
import css from './ItemCarrito.module.css';

export function ItemCarrito({ item }) {
  const { cambiar } = useCarrito();
  return (
    <li className={css.item}>
      <img src={item.foto} alt="" className={css.foto} decoding="async" />
      <div className={css.cuerpo}>
        <div className={css.cabeza}>
          <h2 className={css.nombre}>{item.nombre}</h2>
          <Monto centavos={item.precio * item.cantidad} tamano="sm" />
        </div>
        <p className={css.desc}>{item.descripcion}</p>
        <div className={css.acciones}>
          <Cantidad
            valor={item.cantidad}
            nombre={item.nombre}
            onCambio={(n) => cambiar(item, n - item.cantidad)}
          />
          <Boton
            variante="texto"
            icono="delete"
            onClick={() => cambiar(item, -item.cantidad)}
          >
            Quitar
          </Boton>
        </div>
      </div>
    </li>
  );
}

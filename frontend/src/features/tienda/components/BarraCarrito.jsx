import { Link } from 'react-router';
import { Icono } from '../../../shared/ui/Icono.jsx';
import { Monto } from '../../../shared/ui/Monto.jsx';
import { useCarrito } from '../../carrito/useCarrito.js';
import css from './BarraCarrito.module.css';

// Botón coral fijo abajo: el único coral de las pantallas de compra.
export function BarraCarrito() {
  const { unidades, subtotal } = useCarrito();
  if (!unidades) return null;
  return (
    <div className={css.barra}>
      <Link to="/carrito" className={css.boton}>
        <Icono nombre="shopping_bag" />
        <span className={css.textos}>
          <span className={css.titulo}>Ver mi pedido</span>
          <span className={css.detalle}>
            {unidades} {unidades === 1 ? 'producto' : 'productos'}
          </span>
        </span>
        <Monto centavos={subtotal} tamano="md" />
        <Icono nombre="arrow_forward" />
      </Link>
    </div>
  );
}

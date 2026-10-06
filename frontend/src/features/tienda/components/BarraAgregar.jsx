import { avisar } from '../../../shared/avisos/avisos.js';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Cantidad } from '../../../shared/ui/Cantidad.jsx';
import { useCarrito } from '../../carrito/useCarrito.js';
import { useTienda } from '../hooks/useTienda.js';
import css from './BarraAgregar.module.css';

// Barra fija del detalle: cantidad + "Agregar al carrito" (coral).
export function BarraAgregar({ producto, cantidad, onCantidad, onAgregado }) {
  const { estado } = useTienda();
  const { cambiar } = useCarrito();
  const sinStock = !producto.aceptaEncargo && (producto.agotado || producto.stock === 0);
  const bloqueada = sinStock || (estado === 'cerrada' && !producto.aceptaEncargo);
  const max = producto.aceptaEncargo ? 20 : producto.stock;
  return (
    <div className={css.barra}>
      <div className={css.interior}>
        <Cantidad
          valor={cantidad}
          onCambio={onCantidad}
          max={max}
          nombre={producto.nombre}
        />
        <Boton
          variante="principal"
          tamano="lg"
          icono="shopping_bag"
          anchoCompleto
          disabled={bloqueada}
          onClick={() => {
            cambiar(producto, cantidad);
            avisar.exito(`Agregaste ${cantidad} × ${producto.nombre}`, {
              descripcion: 'Ya está en tu pedido.',
            });
            onAgregado();
          }}
        >
          {sinStock ? 'Sin stock por hoy' : 'Agregar'}
        </Boton>
      </div>
    </div>
  );
}

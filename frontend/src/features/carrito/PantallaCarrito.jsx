import { Link } from 'react-router';
import { Aviso } from '../../shared/ui/Aviso.jsx';
import { Boton } from '../../shared/ui/Boton.jsx';
import { Estado } from '../../shared/ui/Estado.jsx';
import { Monto } from '../../shared/ui/Monto.jsx';
import { Pagina } from '../../shared/ui/Pagina.jsx';
import { Tarjeta } from '../../shared/ui/Tarjeta.jsx';
import { TituloPagina } from '../../shared/ui/TituloPagina.jsx';
import { HeaderTienda } from '../tienda/components/HeaderTienda.jsx';
import { ItemCarrito } from './components/ItemCarrito.jsx';
import { useCarrito } from './useCarrito.js';
import css from './PantallaCarrito.module.css';

// Carrito (Stitch 15). El total final lo calcula el servidor.
export function PantallaCarrito() {
  const { items, unidades, subtotal } = useCarrito();
  return (
    <>
      <HeaderTienda volver="/" titulo="Tu pedido" />
      <Pagina>
        {items.length === 0 ? (
          <Estado
            nivel={1}
            icono="shopping_bag"
            titulo="Tu carrito está vacío"
            accion={<Boton to="/catalogo">Ver productos</Boton>}
          />
        ) : (
          <>
            <TituloPagina
              titulo="Tu pedido"
              bajada={`${unidades} ${unidades === 1 ? 'producto' : 'productos'}`}
            />
            <ul className={css.lista}>
              {items.map((i) => (
                <ItemCarrito key={i.id} item={i} />
              ))}
            </ul>
            <Tarjeta className={css.subtotal}>
              <span>Subtotal</span>
              <Monto centavos={subtotal} tamano="md" />
            </Tarjeta>
            <Aviso>El envío o retiro se elige en el paso siguiente.</Aviso>
            <Boton
              variante="principal"
              tamano="lg"
              anchoCompleto
              iconoFin="arrow_forward"
              to="/checkout"
            >
              Continuar
            </Boton>
            <Link to="/catalogo" className={css.seguir}>
              Seguir comprando
            </Link>
          </>
        )}
      </Pagina>
    </>
  );
}

import { Link, NavLink } from 'react-router';
import { useConsulta } from '../../../shared/api/useConsulta.js';
import { BotonTema } from '../../../shared/tema/BotonTema.jsx';
import { BotonIcono } from '../../../shared/ui/BotonIcono.jsx';
import { LogoTienda } from '../../../shared/ui/LogoTienda.jsx';
import { useCarrito } from '../../carrito/useCarrito.js';
import { useTienda } from '../hooks/useTienda.js';
import css from './BarraSitio.module.css';

// La barra de arriba de una tienda online de verdad: marca, menú con las
// categorías, buscar, modo y carrito. Queda fija al bajar. En el celular el
// menú es una fila que se desliza; en la compu va al medio.
export function BarraSitio() {
  const { tienda } = useTienda();
  const { unidades } = useCarrito();
  const { datos } = useConsulta('/publico/categorias');
  const categorias = (datos ?? []).filter((c) => c.productos > 0).slice(0, 6);
  return (
    <header className={css.barra} data-v="barra">
      <div className={css.fila}>
        <Link to="/" className={css.marca} aria-label={`${tienda.nombre}, inicio`}>
          <LogoTienda url={tienda.logoUrl} tamano={36} borde="ninguno" />
          <span className={css.nombre} data-v="marca">
            {tienda.nombre}
          </span>
        </Link>
        <nav aria-label="Secciones de la tienda" className={css.menu} data-v="menu">
          <NavLink to="/" end className={css.link}>
            Inicio
          </NavLink>
          <NavLink to="/catalogo" end className={css.link}>
            Productos
          </NavLink>
          {categorias.map((c) => (
            <Link key={c.id} to={`/catalogo?categoria=${c.id}`} className={css.link}>
              {c.nombre}
            </Link>
          ))}
        </nav>
        <div className={css.acciones}>
          <BotonIcono icono="search" etiqueta="Buscar productos" to="/catalogo" />
          <BotonTema />
          <BotonIcono
            icono="shopping_bag"
            etiqueta={`Ver carrito (${unidades} ${unidades === 1 ? 'producto' : 'productos'})`}
            to="/carrito"
            insignia={unidades || null}
          />
        </div>
      </div>
    </header>
  );
}

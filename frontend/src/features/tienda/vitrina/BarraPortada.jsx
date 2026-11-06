import { BotonTema } from '../../../shared/tema/BotonTema.jsx';
import { BotonIcono } from '../../../shared/ui/BotonIcono.jsx';
import { LogoTienda } from '../../../shared/ui/LogoTienda.jsx';
import { useCarrito } from '../../carrito/useCarrito.js';
import { useTienda } from '../hooks/useTienda.js';
import css from './Portada.module.css';

// Barra de arriba de la portada: logo chico, modo claro u oscuro y carrito.
export function BarraPortada() {
  const { tienda } = useTienda();
  const { unidades } = useCarrito();
  return (
    <div className={css.barra}>
      <span className={css.logo} data-v="logo-chico">
        <LogoTienda url={tienda.logoUrl} tamano={44} />
      </span>
      <BotonTema tono="sobreVerde" />
      <BotonIcono
        icono="shopping_bag"
        etiqueta={`Ver carrito (${unidades} ${unidades === 1 ? 'producto' : 'productos'})`}
        to="/carrito"
        insignia={unidades || null}
        tono="sobreVerde"
      />
    </div>
  );
}

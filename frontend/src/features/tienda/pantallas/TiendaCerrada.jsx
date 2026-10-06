import { Boton } from '../../../shared/ui/Boton.jsx';
import { LogoTienda } from '../../../shared/ui/LogoTienda.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { useTienda } from '../hooks/useTienda.js';
import css from './TiendaCerrada.module.css';

// Tienda suspendida o pausada (Stitch 22). No muestra productos.
export function TiendaCerrada() {
  const { tienda, estado } = useTienda();
  return (
    <Pagina className={css.pagina}>
      <LogoTienda url={tienda.logoUrl} tamano={96} borde="ninguno" className={css.logo} />
      <h1 className={css.titulo}>
        {estado === 'pausada'
          ? `${tienda.nombre} está en pausa`
          : 'Cerrada temporalmente'}
      </h1>
      <p className={css.texto}>Volvé a visitarnos pronto.</p>
      <Tarjeta className={css.datos}>
        <p className={css.nombre}>{tienda.nombre}</p>
        <p>{tienda.direccion}</p>
      </Tarjeta>
      <Boton icono="chat" href={`https://wa.me/${tienda.whatsapp}`}>
        Consultar por WhatsApp
      </Boton>
    </Pagina>
  );
}

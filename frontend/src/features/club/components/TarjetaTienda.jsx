import { urlTienda } from '../../../shared/lib/urls.js';
import { LogoTienda } from '../../../shared/ui/LogoTienda.jsx';
import { pieTarjeta } from '../lib/pieTarjeta.js';
import { TarjetaSellos } from './TarjetaSellos.jsx';
import css from './TarjetaTienda.module.css';

// Una tienda en "Mis tiendas": su logo y nombre (link a la tienda) y la
// tarjeta con los sellos del cliente. Si apagó el club, se avisa.
export function TarjetaTienda({ t }) {
  const pie = t.activo
    ? pieTarjeta(t)
    : 'Esta tienda pausó su club: tus sellos quedan guardados.';
  return (
    <div className={css.tienda}>
      <a className={css.cabeza} href={urlTienda(t.slug)}>
        <LogoTienda url={t.logoUrl} tamano={40} />
        <span>{t.tienda}</span>
      </a>
      <TarjetaSellos nombre={t.nombre} premios={t.premios} sellos={t.sellos} pie={pie} />
    </div>
  );
}

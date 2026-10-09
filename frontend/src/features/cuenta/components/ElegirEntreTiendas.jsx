import { urlTienda } from '../../../shared/lib/urls.js';
import { DOMINIO_BASE } from '../../../shared/lib/zonaActual.js';
import { Fila } from '../../../shared/ui/Fila.jsx';
import { Icono } from '../../../shared/ui/Icono.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { LayoutCuenta } from './LayoutCuenta.jsx';

// Quien atiende más de una tienda elige a qué panel entrar.
export function ElegirEntreTiendas({ tiendas }) {
  return (
    <LayoutCuenta>
      <TituloPagina titulo="¿A qué tienda entrás?" />
      <Tarjeta relleno={false}>
        <ul aria-label="Tus tiendas">
          {tiendas.map((t) => (
            <li key={t.slug}>
              <Fila
                to={urlTienda(t.slug, '/panel')}
                inicio={<Icono nombre="storefront" />}
                titulo={t.nombre}
                detalle={`${t.slug}.${DOMINIO_BASE}`}
                flecha
              />
            </li>
          ))}
        </ul>
      </Tarjeta>
    </LayoutCuenta>
  );
}

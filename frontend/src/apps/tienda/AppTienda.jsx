import { CarritoProveedor } from '../../features/carrito/CarritoContexto.jsx';
import { RutasTienda } from './RutasTienda.jsx';

// Zona tienda: <slug>.mostry.com.ar (pública) y <slug>.mostry.com.ar/panel.
export default function AppTienda({ slug }) {
  return (
    <CarritoProveedor slug={slug}>
      <RutasTienda slug={slug} />
    </CarritoProveedor>
  );
}

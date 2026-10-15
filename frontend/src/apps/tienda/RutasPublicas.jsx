import { Route, Routes } from 'react-router';
import { PantallaCarrito } from '../../features/carrito/PantallaCarrito.jsx';
import { useTienda } from '../../features/tienda/hooks/useTienda.js';
import { PantallaCatalogo } from '../../features/tienda/pantallas/PantallaCatalogo.jsx';
import { PantallaInicio } from '../../features/tienda/pantallas/PantallaInicio.jsx';
import { PantallaProducto } from '../../features/tienda/pantallas/PantallaProducto.jsx';
import { TarjetaPresentacion } from '../../features/tienda/pantallas/TarjetaPresentacion.jsx';
import { TiendaCerrada } from '../../features/tienda/pantallas/TiendaCerrada.jsx';
import { TransicionRuta } from '../../shared/movimiento/TransicionRuta.jsx';
import { NoEncontrada } from '../../shared/ui/NoEncontrada.jsx';
import { RutasCompra } from './RutasCompra.jsx';

// Suspendida o pausada: la vidriera se cierra, pero el seguimiento de pedidos
// sigue andando (decisión 19 y sección 6.5).
export function RutasPublicas() {
  const { estado, tienda } = useTienda();
  const cerrada = estado === 'suspendida' || estado === 'pausada';
  return (
    <Routes>
      <Route element={<TransicionRuta soloFundido />}>
        {RutasCompra({ cerrada })}
        {cerrada ? (
          <Route path="*" element={<TiendaCerrada />} />
        ) : tienda.vendeOnline === false ? (
          <Route path="*" element={<TarjetaPresentacion />} />
        ) : (
          <>
            <Route index element={<PantallaInicio />} />
            <Route path="catalogo" element={<PantallaCatalogo />} />
            <Route path="producto/:id" element={<PantallaProducto />} />
            <Route path="carrito" element={<PantallaCarrito />} />
            <Route path="*" element={<NoEncontrada zona="tienda" />} />
          </>
        )}
      </Route>
    </Routes>
  );
}

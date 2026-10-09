import { Navigate, Route } from 'react-router';
import { cargarPantalla } from '../../shared/lib/cargarPantalla.js';
import { LayoutSoporte } from './LayoutSoporte.jsx';

// Las pantallas del panel que se pueden usar en modo soporte (y ninguna otra).
const archivos = import.meta.glob(
  '../../features/{productos,miTienda}/pantallas/Pantalla*.jsx',
);
const pantalla = (archivo) =>
  cargarPantalla(archivos[`../../features/${archivo}.jsx`], archivo.split('/').pop());

const rutas = [
  ['productos', 'productos/pantallas/PantallaProductos'],
  ['productos/:id', 'productos/pantallas/PantallaProductoEditar'],
  ['categorias', 'productos/pantallas/PantallaCategorias'],
  ['horarios', 'miTienda/pantallas/PantallaHorarios'],
  ['tienda', 'miTienda/pantallas/PantallaMiTienda'],
].map(([path, archivo]) => ({ path, Pantalla: pantalla(archivo) }));

// /tiendas/:tiendaId/soporte/… dentro del admin.
export function rutasSoporte() {
  return (
    <Route path="tiendas/:tiendaId/soporte" element={<LayoutSoporte />}>
      <Route index element={<Navigate to="productos" replace />} />
      {rutas.map(({ path, Pantalla }) => (
        <Route key={path} path={path} element={<Pantalla />} />
      ))}
    </Route>
  );
}

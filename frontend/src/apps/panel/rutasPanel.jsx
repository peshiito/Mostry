import { Route } from 'react-router';
import { cargarPantalla } from '../../shared/lib/cargarPantalla.js';

// Cada pantalla es su propio archivo y se descarga recién al abrirla.
const archivos = import.meta.glob(
  '../../features/{pedidos,productos,promociones,caja,gastos,encargos,libreta}/pantallas/Pantalla*.jsx',
);
const pantalla = (feature, nombre) => {
  const importar = archivos[`../../features/${feature}/pantallas/${nombre}.jsx`];
  if (!importar) throw new Error(`No existe la pantalla ${feature}/${nombre}`);
  return cargarPantalla(importar, nombre);
};

const rutas = [
  ['pedidos', 'pedidos', 'PantallaPedidos'],
  ['pedidos/:id', 'pedidos', 'PantallaPedido'],
  ['pedidos/:id/comprobante', 'pedidos', 'PantallaRevisarComprobante'],
  ['productos', 'productos', 'PantallaProductos'],
  ['productos/:id', 'productos', 'PantallaProductoEditar'],
  ['categorias', 'productos', 'PantallaCategorias'],
  ['promociones', 'promociones', 'PantallaPromociones'],
  ['caja', 'caja', 'PantallaCaja'],
  ['caja/cerrar', 'caja', 'PantallaCerrarCaja'],
  ['caja/resumen', 'caja', 'PantallaResumen'],
  ['gastos', 'gastos', 'PantallaGastos'],
  ['gastos/nuevo', 'gastos', 'PantallaGastoNuevo'],
  ['proveedores', 'gastos', 'PantallaProveedores'],
  ['encargos', 'encargos', 'PantallaEncargos'],
  ['libreta', 'libreta', 'PantallaLibreta'],
  ['libreta/notas', 'libreta', 'PantallaNotas'],
  ['libreta/:id', 'libreta', 'PantallaClienteFiado'],
].map(([path, feature, nombre]) => ({ path, Pantalla: pantalla(feature, nombre) }));

// Rutas de las secciones del panel (relativas a /panel).
export function rutasPanel() {
  return rutas.map(({ path, Pantalla }) => (
    <Route key={path} path={path} element={<Pantalla />} />
  ));
}

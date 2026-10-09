import { Route } from 'react-router';
import { cargarPantalla } from '../../shared/lib/cargarPantalla.js';

// Cada pantalla es su propio archivo y se descarga recién al abrirla.
const archivos = import.meta.glob([
  '../../features/{cuentaPanel,mas}/Pantalla*.jsx',
  '../../features/{miTienda,suscripcion,reportes,soporte}/pantallas/Pantalla*.jsx',
]);
const pantalla = (archivo) => {
  const importar = archivos[`../../features/${archivo}.jsx`];
  if (!importar) throw new Error(`No existe la pantalla ${archivo}`);
  return cargarPantalla(importar, archivo.split('/').pop());
};

const rutas = [
  ['mas', 'mas/PantallaMas'],
  ['tienda', 'miTienda/pantallas/PantallaMiTienda'],
  ['horarios', 'miTienda/pantallas/PantallaHorarios'],
  ['cobros', 'miTienda/pantallas/PantallaCobros'],
  ['suscripcion', 'suscripcion/pantallas/PantallaSuscripcion'],
  ['cuenta', 'cuentaPanel/PantallaCuenta'],
  ['reportar', 'reportes/pantallas/PantallaReportar'],
  ['reportes', 'reportes/pantallas/PantallaMisReportes'],
  ['soporte', 'soporte/pantallas/PantallaSoporte'],
].map(([path, archivo]) => ({ path, Pantalla: pantalla(archivo) }));

// Rutas de configuración, cuenta y ayuda del panel (relativas a /panel).
export function rutasConfig() {
  return rutas.map(({ path, Pantalla }) => (
    <Route key={path} path={path} element={<Pantalla />} />
  ));
}

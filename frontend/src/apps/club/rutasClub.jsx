import { Route } from 'react-router';
import { clubApi } from '../../features/club/api/club.js';
import { cargarPantalla } from '../../shared/lib/cargarPantalla.js';

// Cada pantalla del Club baja recién al abrirla (la landing no las carga).
const archivos = import.meta.glob(
  '../../features/club/{pantallas,components}/{Pantalla,RequiereCliente,LayoutClub}*.jsx',
);
const club = (archivo) => {
  const importar = archivos[`../../features/club/${archivo}.jsx`];
  if (!importar) throw new Error(`No existe ${archivo}`);
  return cargarPantalla(importar, archivo.split('/').at(-1));
};

const PantallaClub = club('pantallas/PantallaClub');
const Registro = club('pantallas/PantallaRegistroClub');
const Verificar = club('pantallas/PantallaVerificarClub');
const Ingresar = club('pantallas/PantallaIngresarClub');
const Recuperar = cargarPantalla(
  () => import('../../features/cuenta/pantallas/PantallaRecuperar.jsx'),
  'PantallaRecuperar',
);
const RequiereCliente = club('components/RequiereCliente');
const LayoutClub = club('components/LayoutClub');
const MiQr = club('pantallas/PantallaMiQr');
const MisTiendas = club('pantallas/PantallaMisTiendas');
const MisDatos = club('pantallas/PantallaMisDatos');

// Club Mostry en mostry.com.ar/club: la cuenta del cliente, una para todas las tiendas.
export function rutasClub() {
  return (
    <Route path="club">
      <Route index element={<PantallaClub />} />
      <Route path="registro" element={<Registro />} />
      <Route path="verificar" element={<Verificar />} />
      <Route path="ingresar" element={<Ingresar />} />
      <Route path="recuperar" element={<Recuperar base="/club" api={clubApi} />} />
      <Route element={<RequiereCliente />}>
        <Route element={<LayoutClub />}>
          <Route path="qr" element={<MiQr />} />
          <Route path="tiendas" element={<MisTiendas />} />
          <Route path="datos" element={<MisDatos />} />
        </Route>
      </Route>
    </Route>
  );
}

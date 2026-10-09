import { Route, Routes } from 'react-router';
import { RequiereSesion } from '../../features/sesion/RequiereSesion.jsx';
import { NoEncontrada } from '../../shared/ui/NoEncontrada.jsx';
import { rutasCuenta } from '../cuenta/rutasCuenta.jsx';
import { LayoutAdmin } from './LayoutAdmin.jsx';
import { rutasSoporte } from './rutasSoporte.jsx';
import { cargarPantalla } from '../../shared/lib/cargarPantalla.js';

const PantallaMetricas = cargarPantalla(
  () => import('../../features/admin/pantallas/PantallaMetricas.jsx'),
  'PantallaMetricas',
);
const PantallaTiendaAdmin = cargarPantalla(
  () => import('../../features/admin/pantallas/PantallaTiendaAdmin.jsx'),
  'PantallaTiendaAdmin',
);
const PantallaMensajes = cargarPantalla(
  () => import('../../features/admin/pantallas/PantallaMensajes.jsx'),
  'PantallaMensajes',
);
const PantallaReportes = cargarPantalla(
  () => import('../../features/admin/pantallas/PantallaReportes.jsx'),
  'PantallaReportes',
);
const PantallaTiendas = cargarPantalla(
  () => import('../../features/admin/pantallas/PantallaTiendas.jsx'),
  'PantallaTiendas',
);

// Zona admin (admin.mostry.com.ar). Cookie de sesión aparte (sección 13).
export default function AppAdmin() {
  return (
    <Routes>
      {rutasCuenta('', true)}
      <Route element={<RequiereSesion ingreso="/ingresar" admin />}>
        <Route element={<LayoutAdmin />}>
          <Route index element={<PantallaTiendas />} />
          <Route path="tiendas/:id" element={<PantallaTiendaAdmin />} />
          {rutasSoporte()}
          <Route path="metricas" element={<PantallaMetricas />} />
          <Route path="mensajes" element={<PantallaMensajes />} />
          <Route path="reportes" element={<PantallaReportes />} />
          <Route path="*" element={<NoEncontrada />} />
        </Route>
      </Route>
    </Routes>
  );
}

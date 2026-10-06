import { Route, Routes } from 'react-router';
import { PantallaMetricas } from '../../features/admin/pantallas/PantallaMetricas.jsx';
import { PantallaTiendaAdmin } from '../../features/admin/pantallas/PantallaTiendaAdmin.jsx';
import { PantallaTiendas } from '../../features/admin/pantallas/PantallaTiendas.jsx';
import { RequiereSesion } from '../../features/sesion/RequiereSesion.jsx';
import { NoEncontrada } from '../../shared/ui/NoEncontrada.jsx';
import { rutasCuenta } from '../cuenta/rutasCuenta.jsx';
import { LayoutAdmin } from './LayoutAdmin.jsx';

// Zona admin (admin.mostry.com.ar). Cookie de sesión aparte (sección 13).
export default function AppAdmin() {
  return (
    <Routes>
      {rutasCuenta('', true)}
      <Route element={<RequiereSesion ingreso="/ingresar" admin />}>
        <Route element={<LayoutAdmin />}>
          <Route index element={<PantallaTiendas />} />
          <Route path="tiendas/:id" element={<PantallaTiendaAdmin />} />
          <Route path="metricas" element={<PantallaMetricas />} />
          <Route path="*" element={<NoEncontrada />} />
        </Route>
      </Route>
    </Routes>
  );
}

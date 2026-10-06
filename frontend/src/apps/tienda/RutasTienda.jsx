import { lazy } from 'react';
import { Route, Routes } from 'react-router';
import { TiendaProveedor } from '../../features/tienda/TiendaContexto.jsx';
import { RutasPublicas } from './RutasPublicas.jsx';

const AppPanel = lazy(() => import('../panel/AppPanel.jsx'));

// /panel es del comerciante; todo lo demás es la vidriera pública.
export function RutasTienda({ slug }) {
  return (
    <Routes>
      <Route path="/panel/*" element={<AppPanel />} />
      <Route
        path="*"
        element={
          <TiendaProveedor slug={slug}>
            <RutasPublicas />
          </TiendaProveedor>
        }
      />
    </Routes>
  );
}

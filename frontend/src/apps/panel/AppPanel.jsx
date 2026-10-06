import { Route, Routes } from 'react-router';
import { PantallaInicioPanel } from '../../features/panelInicio/pantallas/PantallaInicioPanel.jsx';
import { RequiereSesion } from '../../features/sesion/RequiereSesion.jsx';
import { NoEncontrada } from '../../shared/ui/NoEncontrada.jsx';
import { rutasCuenta } from '../cuenta/rutasCuenta.jsx';
import { LayoutPanel } from './LayoutPanel.jsx';
import { rutasConfig } from './rutasConfig.jsx';
import { rutasPanel } from './rutasPanel.jsx';

// Panel del comerciante (<slug>.mostry.com.ar/panel). Mobile first, instalable.
// Las rutas son relativas a /panel (AppTienda monta este componente en /panel/*).
export default function AppPanel() {
  return (
    <Routes>
      {rutasCuenta('/panel', false)}
      <Route element={<RequiereSesion ingreso="/panel/ingresar" />}>
        <Route element={<LayoutPanel />}>
          <Route index element={<PantallaInicioPanel />} />
          {rutasPanel()}
          {rutasConfig()}
          <Route path="*" element={<NoEncontrada volver="/panel" />} />
        </Route>
      </Route>
    </Routes>
  );
}

import { lazy } from 'react';
import { Route, Routes } from 'react-router';
import { PantallaElegirTienda } from '../../features/cuenta/pantallas/PantallaElegirTienda.jsx';
import { PantallaRegistro } from '../../features/cuenta/pantallas/PantallaRegistro.jsx';
import { PantallaVerificarEmail } from '../../features/cuenta/pantallas/PantallaVerificarEmail.jsx';
import { PantallaLanding } from '../../features/landing/pantallas/PantallaLanding.jsx';
import { PantallaLegal } from '../../features/landing/pantallas/PantallaLegal.jsx';
import { rutasCuenta } from '../cuenta/rutasCuenta.jsx';
import { NoEncontrada } from '../../shared/ui/NoEncontrada.jsx';

const Indice = import.meta.env.DEV ? lazy(() => import('./IndicePantallas.jsx')) : null;

// Zona sitio (mostry.com.ar): presentación, registro, verificación del email e
// ingreso (el admin va a su dashboard y cada comerciante a su panel).
export default function AppSitio() {
  return (
    <Routes>
      <Route index element={<PantallaLanding />} />
      <Route path="legal" element={<PantallaLegal />} />
      <Route path="registro" element={<PantallaRegistro />} />
      <Route path="verificar" element={<PantallaVerificarEmail />} />
      {rutasCuenta('', false, true)}
      <Route path="ingresar/tienda" element={<PantallaElegirTienda />} />
      {Indice ? <Route path="pantallas" element={<Indice />} /> : null}
      <Route path="*" element={<NoEncontrada />} />
    </Routes>
  );
}

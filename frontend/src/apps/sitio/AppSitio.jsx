import { lazy } from 'react';
import { Route, Routes } from 'react-router';
import { PantallaElegirTienda } from '../../features/cuenta/pantallas/PantallaElegirTienda.jsx';
import { PantallaRegistro } from '../../features/cuenta/pantallas/PantallaRegistro.jsx';
import { PantallaVerificarEmail } from '../../features/cuenta/pantallas/PantallaVerificarEmail.jsx';
import { PantallaLanding } from '../../features/landing/pantallas/PantallaLanding.jsx';
import { PantallaLegal } from '../../features/landing/pantallas/PantallaLegal.jsx';
import { NoEncontrada } from '../../shared/ui/NoEncontrada.jsx';

const Indice = import.meta.env.DEV ? lazy(() => import('./IndicePantallas.jsx')) : null;

// Zona sitio (mostry.com.ar): presentación, registro y verificación del email.
// El ingreso se hace desde cada tienda (la API no permite login en el sitio).
export default function AppSitio() {
  return (
    <Routes>
      <Route index element={<PantallaLanding />} />
      <Route path="legal" element={<PantallaLegal />} />
      <Route path="registro" element={<PantallaRegistro />} />
      <Route path="verificar" element={<PantallaVerificarEmail />} />
      <Route path="ingresar" element={<PantallaElegirTienda />} />
      {Indice ? <Route path="pantallas" element={<Indice />} /> : null}
      <Route path="*" element={<NoEncontrada />} />
    </Routes>
  );
}

import '@fontsource-variable/rubik';
import '@fontsource-variable/work-sans';
import './shared/styles/tokens.css';
import './shared/styles/base.css';
import './shared/styles/texto.css';
import './shared/styles/utilidades.css';
import './shared/tema/tema.js';
import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { Avisos } from './shared/avisos/Avisos.jsx';
import { FocoAlNavegar } from './shared/navegacion/FocoAlNavegar.jsx';
import { SinConexion } from './shared/red/SinConexion.jsx';
import { SaltarAlContenido } from './shared/navegacion/SaltarAlContenido.jsx';
import { urlSitio } from './shared/lib/urls.js';
import { esHostLocalSuelto } from './shared/lib/zona.js';
import { ZONA_ACTUAL } from './shared/lib/zonaActual.js';
import { Esqueleto } from './shared/ui/Esqueleto.jsx';

// Una sola app de frontend que decide la zona por el subdominio.
const APPS = {
  sitio: lazy(() => import('./apps/sitio/AppSitio.jsx')),
  tienda: lazy(() => import('./apps/tienda/AppTienda.jsx')),
  admin: lazy(() => import('./apps/admin/AppAdmin.jsx')),
  desconocida: lazy(() => import('./apps/sitio/AppDesconocida.jsx')),
};
const { zona, slug } = ZONA_ACTUAL;
const App = APPS[zona];

// http://localhost:5173 no es ninguna zona: va a la landing (mostry.localhost).
if (zona === 'desconocida' && esHostLocalSuelto(window.location.hostname)) {
  window.location.replace(urlSitio(window.location.pathname + window.location.search));
}

createRoot(document.getElementById('raiz')).render(
  <StrictMode>
    <BrowserRouter>
      <SaltarAlContenido />
      <SinConexion />
      <FocoAlNavegar />
      <Suspense fallback={<Esqueleto filas={6} />}>
        <App slug={slug} />
      </Suspense>
      <Avisos />
    </BrowserRouter>
  </StrictMode>,
);

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
import { BarraProgreso } from './shared/carga/BarraProgreso.jsx';
import { SinConexion } from './shared/red/SinConexion.jsx';
import { SaltarAlContenido } from './shared/navegacion/SaltarAlContenido.jsx';
import { urlSitio } from './shared/lib/urls.js';
import { MovimientoProveedor } from './shared/movimiento/MovimientoProveedor.jsx';
import { RedSeguridad } from './shared/errores/RedSeguridad.jsx';
import { escucharVersionNueva } from './shared/errores/recargarUnaVez.js';
import { esHostLocalSuelto } from './shared/lib/zona.js';
import { ZONA_ACTUAL } from './shared/lib/zonaActual.js';
import { EsqueletoPantalla } from './shared/ui/esqueletos/index.js';

// Una sola app de frontend que decide la zona por el subdominio.
const APPS = {
  sitio: lazy(() => import('./apps/sitio/AppSitio.jsx')),
  tienda: lazy(() => import('./apps/tienda/AppTienda.jsx')),
  admin: lazy(() => import('./apps/admin/AppAdmin.jsx')),
  desconocida: lazy(() => import('./apps/sitio/AppDesconocida.jsx')),
};
const { zona, slug } = ZONA_ACTUAL;
escucharVersionNueva();
const App = APPS[zona];

// http://localhost:5173 no es ninguna zona: va a la landing (mostry.localhost).
if (zona === 'desconocida' && esHostLocalSuelto(window.location.hostname)) {
  window.location.replace(urlSitio(window.location.pathname + window.location.search));
}

createRoot(document.getElementById('raiz')).render(
  <StrictMode>
    <BrowserRouter>
      <SaltarAlContenido />
      <BarraProgreso />
      <SinConexion />
      <FocoAlNavegar />
      <MovimientoProveedor>
        <RedSeguridad>
          <Suspense fallback={<EsqueletoPantalla />}>
            <App slug={slug} />
          </Suspense>
        </RedSeguridad>
      </MovimientoProveedor>
      <Avisos />
    </BrowserRouter>
  </StrictMode>,
);

import { render, screen } from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AppAdmin from '../apps/admin/AppAdmin.jsx';
import AppSitio from '../apps/sitio/AppSitio.jsx';
import AppTienda from '../apps/tienda/AppTienda.jsx';
import { usarApiFalsa } from './apiFalsa.js';
import { RUTAS } from './rutas.js';

const APPS = { sitio: AppSitio, tienda: AppTienda, panel: AppTienda, admin: AppAdmin };

afterEach(() => vi.unstubAllGlobals());

// Humo: cada pantalla carga con respuestas reales grabadas y muestra un título.
describe.each(Object.keys(RUTAS))('zona %s', (zona) => {
  it.each(RUTAS[zona])('%s', async (ruta) => {
    usarApiFalsa({ admin: zona === 'admin' });
    const App = APPS[zona];
    render(
      <MemoryRouter initialEntries={[ruta]}>
        <Suspense fallback={null}>
          <App slug="dona-rosa" />
        </Suspense>
      </MemoryRouter>,
    );
    expect(
      (await screen.findAllByRole('heading', {}, { timeout: 4000 })).length,
    ).toBeGreaterThan(0);
    expect(screen.queryByText(/No pudimos/)).toBeNull();
  });
});

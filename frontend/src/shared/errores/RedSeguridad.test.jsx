import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RedSeguridad } from './RedSeguridad.jsx';

function Rota({ error }) {
  throw error;
}

const montar = (error) =>
  render(
    <MemoryRouter>
      <RedSeguridad inicio="/panel">
        <Rota error={error} />
      </RedSeguridad>
    </MemoryRouter>,
  );

describe('RedSeguridad', () => {
  const recargar = vi.fn();
  beforeEach(() => {
    sessionStorage.clear();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal('reportError', vi.fn());
    vi.spyOn(window, 'location', 'get').mockReturnValue({ reload: recargar });
  });
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    recargar.mockReset();
  });

  it('un error común muestra "Algo se rompió" en lugar de una pantalla en blanco', () => {
    montar(new Error('se cayó'));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Algo se rompió');
    expect(screen.getByRole('link', { name: /Volver al inicio/ })).toHaveAttribute(
      'href',
      '/panel',
    );
    expect(recargar).not.toHaveBeenCalled();
  });

  it('si no se pudo bajar una pantalla, recarga sola una vez', () => {
    const chunk = new TypeError('Failed to fetch dynamically imported module: /x.js');
    montar(chunk);
    expect(recargar).toHaveBeenCalledTimes(1);
    cleanup();
    // Vuelve a fallar enseguida: ya no recarga, avisa que hay versión nueva.
    montar(chunk);
    expect(recargar).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('versión nueva');
  });
});

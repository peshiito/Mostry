import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SinConexion } from './SinConexion.jsx';

// Simula cortar y volver internet (navigator.onLine + evento).
const red = (online) => {
  vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(online);
  act(() => window.dispatchEvent(new Event(online ? 'online' : 'offline')));
};

describe('SinConexion', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('aparece al cortarse internet y se va al volver', () => {
    render(<SinConexion />);
    expect(screen.queryByText(/Sin conexión/)).toBeNull();
    red(false);
    expect(screen.getByRole('status')).toHaveTextContent(
      'Sin conexión · revisá tu internet',
    );
    red(true);
    expect(screen.queryByText(/Sin conexión/)).toBeNull();
  });
});

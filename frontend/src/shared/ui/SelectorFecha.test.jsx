import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SelectorFecha } from './SelectorFecha.jsx';

describe('SelectorFecha', () => {
  afterEach(cleanup);

  it('muestra la fecha elegida y al tocar un día devuelve YYYY-MM-DD', () => {
    const onCambio = vi.fn();
    render(<SelectorFecha etiqueta="Desde" valor="2026-10-09" onCambio={onCambio} />);
    expect(screen.getByRole('button', { name: /9 oct 2026/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /9 oct/ }));
    fireEvent.click(
      screen.getByRole('button', { name: /jueves, 15 de octubre/, hidden: true }),
    );
    expect(onCambio).toHaveBeenCalledWith('2026-10-15');
  });

  it('sin valor invita a elegir y abre en el mes actual', () => {
    render(<SelectorFecha etiqueta="Desde" valor="" onCambio={() => {}} />);
    expect(screen.getByRole('button', { name: 'Elegí una fecha' })).toBeInTheDocument();
  });
});

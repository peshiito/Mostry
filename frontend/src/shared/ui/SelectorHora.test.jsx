import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SelectorHora } from './SelectorHora.jsx';

const cuadro = () => new Promise((listo) => requestAnimationFrame(listo));

describe('SelectorHora', () => {
  afterEach(cleanup);

  it('"Listo" guarda lo que quedó en el centro de las ruedas', async () => {
    const onCambio = vi.fn();
    render(<SelectorHora valor="07:30" onCambio={onCambio} etiqueta="Lunes, abre" />);
    fireEvent.click(screen.getByRole('button', { name: /Lunes, abre: 07:30/ }));
    await cuadro();
    const [hora] = screen.getAllByRole('spinbutton', { hidden: true });
    hora.scrollTop = 9 * 44; // el dedo dejó la rueda en las 09
    fireEvent.click(screen.getByRole('button', { name: /Listo/, hidden: true }));
    expect(onCambio).toHaveBeenCalledWith('09:30');
  });

  it('un minuto fuera de la grilla (07) se puede elegir igual', async () => {
    render(<SelectorHora valor="23:07" onCambio={() => {}} etiqueta="Cierra" />);
    fireEvent.click(screen.getByRole('button', { name: /Cierra/ }));
    await cuadro();
    const [, minutos] = screen.getAllByRole('spinbutton', { hidden: true });
    expect(minutos).toHaveAttribute('aria-valuetext', '07');
  });

  it('cerrar sin "Listo" no cambia nada', () => {
    const onCambio = vi.fn();
    render(<SelectorHora valor="08:00" onCambio={onCambio} etiqueta="Abre" />);
    fireEvent.click(screen.getByRole('button', { name: /Abre/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar', hidden: true }));
    expect(onCambio).not.toHaveBeenCalled();
  });
});

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { almacenAvisos, avisar } from './avisos.js';
import { TextosAviso } from './TextosAviso.jsx';
import { useTemporizador } from './useTemporizador.js';

const abiertos = () => almacenAvisos.leer().filter((a) => !a.saliendo);

function ConReloj({ id, duracion }) {
  useTemporizador(id, duracion, false);
  return null;
}

describe('avisos con acción y fijos', () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('el botón de acción hace lo suyo y cierra el aviso', () => {
    const alHacer = vi.fn();
    const id = avisar.info('Hay una versión nueva', {
      accion: { texto: 'Actualizar', alHacer },
    });
    const aviso = almacenAvisos.leer().find((a) => a.id === id);
    render(<TextosAviso aviso={aviso} />);
    fireEvent.click(screen.getByRole('button', { name: 'Actualizar' }));
    expect(alHacer).toHaveBeenCalledOnce();
    expect(abiertos().some((a) => a.id === id)).toBe(false);
  });

  it('duración Infinity: el aviso queda hasta que lo cierren', () => {
    vi.useFakeTimers();
    const id = avisar.info('Fijo', { duracion: Infinity });
    render(<ConReloj id={id} duracion={Infinity} />);
    act(() => vi.advanceTimersByTime(60 * 60 * 1000));
    expect(abiertos().some((a) => a.id === id)).toBe(true);
  });

  it('un aviso fijo no sale de la pila aunque lleguen otros', () => {
    const id = avisar.info('Versión nueva', { duracion: Infinity });
    ['Uno', 'Dos', 'Tres', 'Cuatro'].forEach((t) => avisar.exito(t));
    expect(abiertos().some((a) => a.id === id)).toBe(true);
  });
});

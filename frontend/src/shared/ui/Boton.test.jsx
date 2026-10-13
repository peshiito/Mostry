import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Boton } from './Boton.jsx';

describe('Boton cargando', () => {
  afterEach(cleanup);

  it('dice qué está haciendo, queda ocupado y no se puede volver a tocar', () => {
    render(
      <Boton cargando textoCargando="Guardando…" disabled={false}>
        Guardar
      </Boton>,
    );
    const boton = screen.getByRole('button', { name: 'Guardando…' });
    expect(boton).toBeDisabled();
    expect(boton).toHaveAttribute('aria-busy', 'true');
  });

  it('sin textoCargando conserva su texto', () => {
    render(<Boton cargando>Seguir</Boton>);
    expect(screen.getByRole('button', { name: 'Seguir' })).toBeDisabled();
  });
});

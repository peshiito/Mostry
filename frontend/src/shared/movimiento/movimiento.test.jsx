import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ItemAnimado, ListaAnimada } from './ListaAnimada.jsx';
import { MovimientoProveedor } from './MovimientoProveedor.jsx';
import { useContar } from './useContar.js';

function Numero({ valor, activo }) {
  return <output>{useContar(valor, { activo, paso: 1 })}</output>;
}

const lista = (items) => (
  <MovimientoProveedor>
    <ListaAnimada>
      {items.map((t, i) => (
        <ItemAnimado key={t} i={i}>
          {t}
        </ItemAnimado>
      ))}
    </ListaAnimada>
  </MovimientoProveedor>
);

describe('movimiento', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('useContar termina en el valor exacto', async () => {
    // Un cuadro que ya está "después del final": no depende de lo rápido que vaya jsdom.
    vi.stubGlobal('requestAnimationFrame', (f) =>
      setTimeout(() => f(performance.now() + 1e4)),
    );
    render(<Numero valor={1234} activo />);
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('1234'));
  });

  it('useContar sin animar muestra el valor al toque', () => {
    render(<Numero valor={50} activo={false} />);
    expect(screen.getByRole('status')).toHaveTextContent('50');
  });

  it('ListaAnimada muestra todo y saca lo que se va', async () => {
    const { rerender } = render(lista(['Pan', 'Facturas', 'Torta']));
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    rerender(lista(['Pan', 'Torta']));
    await waitFor(() => expect(screen.queryByText('Facturas')).toBeNull());
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });
});

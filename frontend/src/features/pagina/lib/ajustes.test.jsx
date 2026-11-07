import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AjustesProveedor, useAjustes } from '../AjustesPagina.jsx';
import { linkConsulta } from './consulta.js';

const Mirar = () => {
  const a = useAjustes();
  return (
    <p>{`${a.carrito}-${a.buscador}-${a.tarjeta.botones.join('+')}-${a.tarjeta.categoria}`}</p>
  );
};

describe('ajustes de la página (P4)', () => {
  it('sin página propia usa los de siempre, y completa lo que falte', () => {
    const { rerender } = render(
      <AjustesProveedor ajustes={undefined}>
        <Mirar />
      </AjustesProveedor>,
    );
    expect(screen.getByText('true-true-agregar-true')).toBeInTheDocument();
    rerender(
      <AjustesProveedor ajustes={{ carrito: false, tarjeta: { botones: ['whatsapp'] } }}>
        <Mirar />
      </AjustesProveedor>,
    );
    expect(screen.getByText('false-true-whatsapp-true')).toBeInTheDocument();
  });

  it('arma la consulta por WhatsApp con el producto y el precio', () => {
    const href = linkConsulta(
      { nombre: 'Ropa Mía', whatsapp: '+54 9 11 2233-4455' },
      { nombre: 'Jean mom', precio: 2800000 },
    );
    expect(href).toMatch(/^https:\/\/wa\.me\/5491122334455\?text=/);
    expect(decodeURIComponent(href)).toContain('Jean mom');
    expect(decodeURIComponent(href)).toContain('28.000');
    expect(
      linkConsulta({ nombre: 'X', whatsapp: '' }, { nombre: 'Y', precio: 1 }),
    ).toBeNull();
  });
});

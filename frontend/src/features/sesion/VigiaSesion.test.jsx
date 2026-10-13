import { act, cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { SESION_VENCIDA } from '../../shared/api/cliente.js';
import { VigiaSesion } from './VigiaSesion.jsx';

function Ingreso() {
  return <p>volver a {useLocation().state?.volver}</p>;
}

describe('VigiaSesion', () => {
  afterEach(cleanup);

  it('al vencer la sesión lleva al ingreso recordando dónde estaba', () => {
    render(
      <MemoryRouter initialEntries={['/panel/caja?dia=hoy']}>
        <VigiaSesion ingreso="/panel/ingresar" />
        <Routes>
          <Route path="/panel/caja" element={<p>caja</p>} />
          <Route path="/panel/ingresar" element={<Ingreso />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText('caja')).toBeInTheDocument();
    act(() => {
      window.dispatchEvent(new Event(SESION_VENCIDA));
      window.dispatchEvent(new Event(SESION_VENCIDA));
    });
    expect(screen.getByText('volver a /panel/caja?dia=hoy')).toBeInTheDocument();
  });
});

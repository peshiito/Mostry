import { beforeEach, describe, expect, it, vi } from 'vitest';
import { api } from './cliente.js';
import { getCompartido } from './getCompartido.js';

vi.mock('./cliente.js', () => ({ api: vi.fn() }));

// Pedido que se resuelve a mano, para controlar el orden.
const diferido = () => {
  let resolver;
  const promesa = new Promise((r) => (resolver = r));
  return { promesa, resolver };
};

describe('getCompartido', () => {
  beforeEach(() => {
    api.mockReset();
  });

  it('dos consultas iguales a la vez hacen un solo pedido', async () => {
    const d = diferido();
    api.mockReturnValue(d.promesa);
    const a = getCompartido('/caja/hoy');
    const b = getCompartido('/caja/hoy');
    d.resolver({ abierta: true });
    expect(await a).toEqual({ abierta: true });
    expect(await b).toEqual({ abierta: true });
    expect(api).toHaveBeenCalledTimes(1);
  });

  it('terminado el pedido, la próxima consulta va de nuevo a la red', async () => {
    api.mockResolvedValue(1);
    await getCompartido('/pedidos');
    await getCompartido('/pedidos');
    expect(api).toHaveBeenCalledTimes(2);
  });

  it('si uno cancela, el otro igual recibe la respuesta', async () => {
    const d = diferido();
    api.mockReturnValue(d.promesa);
    const c = new AbortController();
    const a = getCompartido('/x', c.signal);
    const b = getCompartido('/x');
    c.abort();
    d.resolver('ok');
    await expect(a).rejects.toThrow('cancelada');
    expect(await b).toBe('ok');
    expect(api.mock.calls[0][1].senal.aborted).toBe(false);
  });

  it('si cancelan todos, se corta el pedido a la red', async () => {
    api.mockReturnValue(new Promise(() => {}));
    const c = new AbortController();
    const a = getCompartido('/y', c.signal);
    c.abort();
    await expect(a).rejects.toThrow('cancelada');
    expect(api.mock.calls[0][1].senal.aborted).toBe(true);
  });
});

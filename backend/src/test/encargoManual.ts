import type { tiendaLista } from './tiendaLista.js';

type Tienda = Awaited<ReturnType<typeof tiendaLista>>;
export const enDias = (d: number) => new Date(Date.now() + d * 86_400_000).toISOString();

// Encargos 3: un encargo que le llegó por WhatsApp, cargado por Rosa en el panel.
export const datosManual = (t: Tienda, extra: Record<string, unknown> = {}) => ({
  clienteNombre: 'Marta Ruiz',
  clienteWhatsapp: '11 2345-6789',
  entrega: 'retiro',
  fechaEncargo: enDias(2),
  items: [
    { productoId: t.productos.rogel, cantidad: 1, personalizacion: 'Con frutillas' },
  ],
  ...extra,
});

export const cargar = (t: Tienda, extra: Record<string, unknown> = {}) =>
  t.panel.post('/panel/encargos', datosManual(t, extra));

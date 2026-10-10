import type { Sesion } from './sesion.js';

// Gastos con proveedores, y la libreta: fiados, pagos y notas.
export async function escenaLibreta(rosa: Sesion) {
  const molino = await rosa.post('/panel/proveedores', {
    nombre: 'Molino San José',
    contacto: '11 4000-1000 · Hugo',
  });
  const tambo = await rosa.post('/panel/proveedores', {
    nombre: 'Lácteos El Tambo',
    contacto: 'pedidos@eltambo.test',
  });
  await rosa.post('/panel/gastos', {
    tipo: 'gasto',
    monto: 3_200_000,
    medio: 'transferencia',
    proveedorId: molino.id,
    detalle: '20 bolsas de harina 000',
  });
  await rosa.post('/panel/gastos', {
    tipo: 'gasto',
    monto: 450_000,
    medio: 'efectivo',
    proveedorId: tambo.id,
    detalle: 'Manteca y crema',
  });
  await rosa.post('/panel/gastos', {
    tipo: 'inversion',
    monto: 8_500_000,
    medio: 'transferencia',
    detalle: 'Seña del horno pastelero',
  });

  const cliente = (nombre: string, telefono: string) =>
    rosa.post('/panel/libreta/clientes', { nombre, telefono });
  const fiado = (id: number, m: object) =>
    rosa.post(`/panel/libreta/clientes/${id}/movimientos`, m);
  const marta = await cliente('Marta (vecina del 3°B)', '11 2222-3333');
  await fiado(marta.id, { tipo: 'deuda', monto: 420_000, detalle: 'Docena surtida' });
  await fiado(marta.id, {
    tipo: 'pago',
    monto: 200_000,
    medio: 'efectivo',
    detalle: 'Pagó una parte',
  });
  const julio = await cliente('Don Julio', '11 4444-5555');
  await fiado(julio.id, { tipo: 'deuda', monto: 250_000, detalle: 'Pan del lunes' });
  await fiado(julio.id, { tipo: 'deuda', monto: 180_000, detalle: 'Medialunas' });
  const escuela = await cliente('Escuela N° 12', '11 6666-7777');
  await fiado(escuela.id, {
    tipo: 'deuda',
    monto: 1_260_000,
    detalle: 'Desayuno del acto',
  });
  await fiado(escuela.id, {
    tipo: 'pago',
    monto: 1_260_000,
    medio: 'transferencia',
    detalle: 'Saldado',
  });

  await rosa.post('/panel/libreta/notas', {
    texto: 'Pedir más dulce de leche el jueves.',
  });
  await rosa.post('/panel/libreta/notas', {
    texto: 'Cumple de la escuela: 3 docenas para el viernes.',
  });
}

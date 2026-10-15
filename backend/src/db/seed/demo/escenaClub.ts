import type { Sesion } from './sesion.js';

// Club de clientes (Lealtad): Doña Rosa arma su programa y lo prende.
export async function escenaClub(rosa: Sesion) {
  await rosa.put('/panel/club', {
    nombre: 'Club Doña Rosa',
    compraMinima: 500_000,
    venceMeses: 6,
    premios: [
      { compras: 5, tipo: 'porcentaje', valor: 20, tope: null, descripcion: null },
      { compras: 7, tipo: 'porcentaje', valor: 75, tope: 1_000_000, descripcion: null },
      { compras: 10, tipo: 'regalo', descripcion: 'Una docena de facturas' },
    ],
  });
  await rosa.patch('/panel/club/activo', { activo: true });
}

// Un programa de ejemplo para los tests del club (Lealtad L2).
export const programaEjemplo = {
  nombre: 'Club Doña Rosa',
  compraMinima: 500_000,
  venceMeses: 6,
  premios: [
    { compras: 5, tipo: 'porcentaje', valor: 20, tope: null, descripcion: null },
    { compras: 7, tipo: 'porcentaje', valor: 75, tope: 500_000, descripcion: null },
    { compras: 10, tipo: 'regalo', descripcion: 'Una docena de facturas' },
  ],
};

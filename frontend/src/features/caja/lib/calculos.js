// Fórmulas de caja (sección 6.4).
export const efectivoEsperado = (c) =>
  c.apertura + c.ingresosEfectivo - c.egresosEfectivo - c.depositos;

// Diferencia al cerrar = contado − esperado. Positiva: sobra; negativa: falta.
export const diferencia = (contado, c) => contado - efectivoEsperado(c);

// Ganancia real = ingresos − devoluciones − gastos (decisión de la Etapa 4).
export const gananciaReal = (r) => r.ingresos - r.devoluciones - r.gastos;

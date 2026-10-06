// La plata viaja en centavos (INT). En pantalla: "$ 7.800", sin centavos si son cero.
const entero = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 });
const decimal = new Intl.NumberFormat('es-AR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function plata(centavos) {
  const pesos = centavos / 100;
  const f = centavos % 100 === 0 ? entero : decimal;
  return `$ ${f.format(pesos)}`;
}

// Para inputs: "7800" o "7800,50" → centavos. Devuelve null si no es válido.
export function aCentavos(texto) {
  const limpio = String(texto).replace(/\./g, '').replace(',', '.').trim();
  if (!/^\d+(\.\d{1,2})?$/.test(limpio)) return null;
  return Math.round(Number(limpio) * 100);
}

import { aCentavos } from '../../../shared/lib/plata.js';

export const TIPOS = [
  { valor: 'porcentaje', texto: 'Porcentaje' },
  { valor: 'monto', texto: 'Monto fijo' },
  { valor: 'regalo', texto: 'Regalo' },
];

const pesos = (c) => (c ? String(c / 100).replace('.', ',') : '');

// Premio guardado → formulario (textos) y de vuelta, con su validación.
export const aForm = (p) => ({
  compras: p?.compras ?? 5,
  tipo: p?.tipo ?? 'porcentaje',
  valor: p?.tipo === 'monto' ? pesos(p.valor) : String(p?.valor ?? ''),
  tope: pesos(p?.tope),
  descripcion: p?.descripcion ?? '',
});

// Devuelve { premio } o { error } (el mensaje para el formulario).
export function desdeForm(f, ocupadas) {
  if (ocupadas.includes(f.compras))
    return { error: `Ya hay un premio a las ${f.compras} compras.` };
  const descripcion = f.descripcion.trim() || null;
  const base = { compras: f.compras, tipo: f.tipo };
  if (f.tipo === 'regalo')
    return descripcion && descripcion.length >= 2
      ? { premio: { ...base, descripcion } }
      : { error: 'Contá qué regalás.' };
  if (f.tipo === 'monto') {
    const valor = aCentavos(f.valor);
    if (!valor) return { error: 'Poné cuánto descontás.' };
    return { premio: { ...base, valor, descripcion } };
  }
  const valor = Number(f.valor);
  if (!Number.isInteger(valor) || valor < 1 || valor > 100)
    return { error: 'El porcentaje va de 1 a 100.' };
  const tope = f.tope.trim() ? aCentavos(f.tope) : null;
  if (tope === null && f.tope.trim()) return { error: 'Revisá el tope.' };
  return { premio: { ...base, valor, tope: tope || null, descripcion } };
}

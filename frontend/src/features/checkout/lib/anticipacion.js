// Encargos 3: la anticipación de un encargo es la mayor entre la de la tienda
// y la de cada producto (null = la de la tienda). La API aplica la misma regla.
export const anticipacionDe = (tienda, items) =>
  Math.max(
    tienda.anticipacionEncargoHoras,
    ...items.map((i) => i.anticipacionHoras ?? 0),
  );

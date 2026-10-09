// Texto que ve el comercio por cada cambio que hizo Mostry en modo soporte.
// La clave es "MÉTODO ruta" tal como está montada en el router.
const ACCIONES: Record<string, string> = {
  'POST /productos': 'Creó un producto',
  'PATCH /productos/:id': 'Editó un producto',
  'POST /productos/:id/fotos': 'Agregó una foto a un producto',
  'PUT /productos/:id/fotos/orden': 'Reordenó las fotos de un producto',
  'DELETE /productos/:id/fotos/:fotoId': 'Quitó una foto de un producto',
  'POST /categorias': 'Creó una categoría',
  'PUT /categorias/orden': 'Reordenó las categorías',
  'PATCH /categorias/:id': 'Renombró una categoría',
  'DELETE /categorias/:id': 'Borró una categoría',
  'PUT /horarios': 'Cambió los horarios',
  'POST /feriados': 'Agregó un feriado',
  'DELETE /feriados/:id': 'Quitó un feriado',
  'PATCH /tienda/config': 'Editó los datos de la tienda',
  'PUT /tienda/logo': 'Cambió el logo',
  'DELETE /tienda/logo': 'Quitó el logo',
};

export const textoAccion = (metodo: string, ruta: string, nombre?: string) => {
  const base = ACCIONES[`${metodo} ${ruta}`] ?? `Hizo un cambio (${metodo} ${ruta})`;
  return nombre ? `${base}: «${nombre}»` : base;
};

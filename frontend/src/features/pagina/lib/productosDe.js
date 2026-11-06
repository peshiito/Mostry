// Los productos de un bloque según su fuente, y su título por defecto.
export function productosDe(c, fuente, cantidad) {
  const lista =
    fuente.tipo === 'destacados'
      ? c.destacados
      : fuente.tipo === 'categoria'
        ? c.productos.filter((p) => p.categoriaId === fuente.id)
        : fuente.tipo === 'elegidos'
          ? fuente.ids.map((id) => c.productos.find((p) => p.id === id)).filter(Boolean)
          : c.productos;
  return lista.slice(0, cantidad);
}

export function textosDe(fuente, c, cuantos) {
  if (fuente.tipo === 'destacados') return ['Lo más pedido', 'Los favoritos de la casa'];
  if (fuente.tipo === 'categoria')
    return [c.categorias.find((k) => k.id === fuente.id)?.nombre ?? 'Productos', null];
  if (fuente.tipo === 'elegidos') return ['Elegidos para vos', null];
  return ['Todo lo que hay', `${cuantos} productos`];
}

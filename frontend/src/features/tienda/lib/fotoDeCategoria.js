// La foto de un producto de esa categoría (o nada: se muestran sus iniciales).
export const fotoDeCategoria = (categoria, productos) =>
  productos.find(
    (p) => p.categoriaId === categoria.id && !p.foto.endsWith('/sin-foto.svg'),
  )?.foto;

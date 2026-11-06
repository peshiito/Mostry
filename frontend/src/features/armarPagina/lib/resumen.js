// Una línea que dice qué tiene cada bloque, para la lista del editor.
const FUENTES = {
  destacados: 'Lo más pedido',
  todos: 'Todos los productos',
  categoria: 'Una categoría',
  elegidos: 'Elegidos a mano',
};

export function resumenBloque(b) {
  const d = b.datos;
  switch (b.tipo) {
    case 'hero':
      return d.titulo ?? 'Con el nombre de tu tienda';
    case 'productos':
      return `${d.vista === 'carrusel' ? 'Carrusel' : 'Grilla'} · ${FUENTES[d.fuente.tipo]}`;
    case 'banner':
      return d.origen === 'promo' ? 'Tu promo vigente' : (d.titulo ?? 'Banner');
    case 'texto':
      return d.titulo ?? d.cuerpo.slice(0, 40);
    case 'separador':
      return `Espacio ${d.tamano}${d.linea ? ' con línea' : ''}`;
    default:
      return d.titulo ?? 'Se arma solo con los datos de tu tienda';
  }
}

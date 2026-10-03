// Escapa % y _ para que un texto de búsqueda no funcione como comodín de LIKE.
export function patronContiene(texto: string): string {
  return `%${texto.replace(/[\\%_]/g, '\\$&')}%`;
}

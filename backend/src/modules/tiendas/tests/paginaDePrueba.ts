// Una página con un bloque de cada tipo, válida (para los tests).
export const paginaDePrueba = () => ({
  version: 1 as const,
  ajustes: {
    carrito: true,
    buscador: true,
    tarjeta: { botones: ['agregar' as const], categoria: true, estrellas: false },
  },
  bloques: [
    {
      id: 'hero01',
      tipo: 'hero',
      visible: true,
      datos: {
        titulo: null,
        frase: 'Facturas de verdad',
        imagen: 'portada',
        medios: [],
        carrusel: { segundos: 5, transicion: 'fundido' },
        botones: [{ texto: 'Ver todo', destino: { tipo: 'catalogo' } }],
      },
    },
    { id: 'benef1', tipo: 'beneficios', visible: true, datos: {} },
    {
      id: 'prod01',
      tipo: 'productos',
      visible: true,
      datos: {
        titulo: null,
        bajada: null,
        vista: 'carrusel',
        fuente: { tipo: 'destacados' },
        cantidad: 8,
        automatico: false,
      },
    },
    {
      id: 'texto1',
      tipo: 'texto',
      visible: false,
      datos: { titulo: 'Hola', cuerpo: 'Somos del barrio.', alineacion: 'centro' },
    },
    { id: 'cierre', tipo: 'cierre', visible: true, datos: { titulo: null, texto: null } },
  ],
});

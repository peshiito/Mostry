// Valores de arranque de la página y de su portada.
export const AJUSTES_BASE = {
  carrito: true,
  buscador: true,
  tarjeta: { botones: ['agregar'], categoria: true, estrellas: false },
};

export const HERO_BASE = {
  titulo: null,
  frase: null,
  imagen: 'portada',
  botones: [
    { texto: 'Ver productos', destino: { tipo: 'seccion', id: 'productos' } },
    { texto: 'Escribinos', destino: { tipo: 'whatsapp' } },
  ],
};

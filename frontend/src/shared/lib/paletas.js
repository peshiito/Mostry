// Paletas cerradas de las tiendas (decisión 39). "principal" lleva texto blanco
// (contraste ≥ 4.5:1) y "acento" lleva texto carbón.
export const PALETAS = {
  toldo: { nombre: 'Toldo', principal: '#0E5A4A', acento: '#F2B53A' },
  tomate: { nombre: 'Tomate', principal: '#B3361F', acento: '#F2B53A' },
  cielo: { nombre: 'Cielo', principal: '#1F5F8B', acento: '#F2C14E' },
  lavanda: { nombre: 'Lavanda', principal: '#5B4A8B', acento: '#E9C4DE' },
  oliva: { nombre: 'Oliva', principal: '#4E6128', acento: '#E9C46A' },
  pizarra: { nombre: 'Pizarra', principal: '#34495E', acento: '#F2B53A' },
  menta: { nombre: 'Menta', principal: '#16705B', acento: '#F4D35E' },
  chocolate: { nombre: 'Chocolate', principal: '#5D3A1A', acento: '#E9B872' },
  frambuesa: { nombre: 'Frambuesa', principal: '#9C2457', acento: '#F7B2C4' },
  noche: { nombre: 'Noche', principal: '#1B2A41', acento: '#F2B53A' },
};

// Props para el contenedor de una tienda (vidriera o panel): el color va en
// --paleta y los tonos de cada modo (claro u oscuro) los arma tokens.css.
export const propsPaleta = (clave) => {
  const p = PALETAS[clave] ?? PALETAS.toldo;
  return {
    'data-paleta': clave ?? 'toldo',
    style: { '--paleta': p.principal, '--paleta-acento': p.acento },
  };
};

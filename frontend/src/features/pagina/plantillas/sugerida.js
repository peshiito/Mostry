import { plantilla } from './index.js';

// Si la tienda no eligió estilo, su rubro (de "Armá tu Mostry") da una pista.
const POR_RUBRO = {
  panaderia: 'horno',
  pasteleria: 'horno',
  almacen: 'kiosco',
  ropa: 'street',
  artesanias: 'atelier',
};

// La plantilla que se ofrece primero: la de su estilo, o la de su rubro.
// Sin ninguna de las dos, null (se queda con la de siempre).
export function plantillaSugerida(tienda) {
  const base = tienda?.tema?.base === 'calle' ? 'street' : tienda?.tema?.base;
  const p = plantilla(base) ?? plantilla(POR_RUBRO[tienda?.rubro]);
  return p?.clave === 'cero' ? null : p;
}

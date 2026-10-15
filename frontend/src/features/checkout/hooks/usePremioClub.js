import { useState } from 'react';
import { useConsulta } from '../../../shared/api/useConsulta.js';
import { disponibles } from '../../club/lib/descuento.js';

// Los premios del Club que el comprador puede usar en ESTA tienda (si entró al
// Club y le alcanzan los sellos) y cuál eligió.
export function usePremioClub(tienda, cliente) {
  const ruta = cliente && tienda.club ? '/club/tiendas' : null;
  const mias = useConsulta(ruta).datos ?? [];
  const aca = mias.find((t) => t.slug === tienda.slug && t.activo);
  const opciones = aca ? disponibles(aca.premios, aca.sellos) : [];
  const [elegido, setElegido] = useState(null); // compras del escalón
  const premio = opciones.find((p) => p.compras === elegido) ?? null;
  return { opciones, premio, elegir: setElegido, sellos: aca?.sellos ?? 0 };
}

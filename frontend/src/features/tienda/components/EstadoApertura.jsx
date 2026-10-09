import { Etiqueta } from '../../../shared/ui/Etiqueta.jsx';
import { useTienda } from '../hooks/useTienda.js';
import { textoAbierta } from '../lib/textoApertura.js';

const TEXTO = {
  abierta: (t) => textoAbierta(t.cierraA),
  cerrada: (t) => `Cerrado · abre ${t.abreProximo}`,
  pausada: () => 'Pausada',
  suspendida: () => 'Cerrada',
};

// "ABIERTO · cierra a las 20:30" (6.3). Con texto, no solo color.
export function EstadoApertura() {
  const { tienda, estado } = useTienda();
  return (
    <Etiqueta tono="sobreVerde" punto mayus>
      {TEXTO[estado](tienda)}
    </Etiqueta>
  );
}

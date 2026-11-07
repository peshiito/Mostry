import { Hoja } from '../../../shared/ui/Hoja.jsx';
import { PLANTILLAS } from '../../pagina/plantillas/index.js';
import css from './HojaPlantillas.module.css';
import { TarjetaPlantilla } from './TarjetaPlantilla.jsx';

// Todas las plantillas; la del estilo de la tienda, primera. Elegir una cambia
// los bloques (no los colores) y se puede deshacer.
export function HojaPlantillas({ abierta, onCerrar, sugerida, onElegir }) {
  const lista = sugerida
    ? [sugerida, ...PLANTILLAS.filter((p) => p.clave !== sugerida.clave)]
    : PLANTILLAS;
  return (
    <Hoja
      abierta={abierta}
      onCerrar={onCerrar}
      titulo="Plantillas"
      subtitulo="Cambia los bloques de tu página, no tus colores. Si no te gusta, deshacés."
      ancha
    >
      <ul className={css.lista}>
        {lista.map((p) => (
          <li key={p.clave}>
            <TarjetaPlantilla
              p={p}
              tuya={p.clave === sugerida?.clave}
              onElegir={onElegir}
            />
          </li>
        ))}
      </ul>
    </Hoja>
  );
}

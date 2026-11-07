import { avisar } from '../../../shared/avisos/avisos.js';
import { usePanel } from '../../panelBase/PanelContexto.jsx';
import { armarPlantilla } from '../../pagina/plantillas/armar.js';
import { plantilla } from '../../pagina/plantillas/index.js';
import { plantillaSugerida } from '../../pagina/plantillas/sugerida.js';

// La plantilla sugerida (por estilo o rubro) y cómo poner una: cambia los
// bloques, conserva los ajustes y se puede deshacer. `null` = la de siempre.
export function usePlantillas(e, ctx) {
  const { tienda } = usePanel();
  const sugerida = plantillaSugerida({ tema: ctx.tienda.tema, rubro: tienda.rubro });
  function poner(clave) {
    e.cerrarBienvenida();
    if (!clave) {
      e.guardarYa();
      return;
    }
    const doc = armarPlantilla(clave, { catalogo: ctx.c, ajustes: e.doc.ajustes });
    e.despachar({ tipo: 'reemplazar', doc });
    const nombre = plantilla(clave).nombre;
    const texto =
      clave === 'cero' ? 'Arrancaste de cero' : `Pusimos la plantilla ${nombre}`;
    avisar.info(texto, {
      accion: { texto: 'Deshacer', alHacer: () => e.despachar({ tipo: 'deshacer' }) },
    });
  }
  return { sugerida, poner };
}

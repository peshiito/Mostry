import { BotonIcono } from '../ui/BotonIcono.jsx';
import { useTema } from './useTema.js';

// Botón chico que va rotando: automático → claro → oscuro.
const CICLO = {
  sistema: { icono: 'brightness_auto', siguiente: 'claro', texto: 'automático' },
  claro: { icono: 'light_mode', siguiente: 'oscuro', texto: 'claro' },
  oscuro: { icono: 'dark_mode', siguiente: 'sistema', texto: 'oscuro' },
};

export function BotonTema({ tono = 'neutro' }) {
  const { preferencia, elegir } = useTema();
  const c = CICLO[preferencia];
  return (
    <BotonIcono
      icono={c.icono}
      tono={tono}
      etiqueta={`Modo ${c.texto}. Cambiar a ${CICLO[c.siguiente].texto}`}
      onClick={() => elegir(c.siguiente)}
    />
  );
}

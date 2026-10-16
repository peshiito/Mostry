import { RESPONSABLE } from '../../shared/lib/legal.js';
import { privacidad } from './textos/privacidad.js';
import { terminos } from './textos/terminos.js';

// Los dos documentos del sitio: /terminos y /privacidad.
export const DOCUMENTOS = {
  terminos: {
    titulo: 'Términos y condiciones',
    otro: { texto: 'Política de privacidad', ruta: '/privacidad' },
    secciones: terminos(RESPONSABLE),
  },
  privacidad: {
    titulo: 'Política de privacidad',
    otro: { texto: 'Términos y condiciones', ruta: '/terminos' },
    secciones: privacidad(RESPONSABLE),
  },
};

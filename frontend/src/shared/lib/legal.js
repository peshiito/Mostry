import { urlSitio } from './urls.js';

// Versión vigente de los términos y la privacidad (la fecha en que cambiaron).
// Tiene que ser igual a la del backend (config/legal.ts): lo controla el e2e.
export const VERSION_LEGAL = '2026-10-16';

const FALTA = 'a completar';

// Responsable de los datos (Ley 25.326). Vienen del .env: el repo no guarda
// datos personales. El build de producción (Dockerfile) exige las tres.
export const responsable = (env) => ({
  nombre: env.VITE_LEGAL_NOMBRE || FALTA,
  cuit: env.VITE_LEGAL_CUIT || FALTA,
  email: env.VITE_LEGAL_EMAIL || FALTA,
});
export const RESPONSABLE = responsable(import.meta.env);

// Desde cualquier zona (tienda, panel, Club) los documentos viven en el sitio.
export const urlTerminos = () => urlSitio('/terminos');
export const urlPrivacidad = () => urlSitio('/privacidad');

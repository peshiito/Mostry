import { linkWhatsapp } from '../../../shared/lib/linkSeguro.js';

// Número de Mostry (lo configura Pedro en el .env del frontend).
const WA_MOSTRY = import.meta.env.VITE_WHATSAPP_MOSTRY;

// Link para avisarle a Mostry por WhatsApp que se mandó un reporte (o null si
// no hay número configurado: entonces no se muestra el botón).
export function avisoReporte({ numero, tienda, descripcion }, numeroMostry = WA_MOSTRY) {
  const resumen =
    descripcion.length > 140 ? `${descripcion.slice(0, 140)}…` : descripcion;
  return linkWhatsapp(
    numeroMostry,
    `Hola Pedro, soy de ${tienda}. Te mandé el reporte #${numero} desde el panel de Mostry: "${resumen}"`,
  );
}

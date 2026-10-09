// Solo links https de Google Maps (la API ya los valida; esto es una segunda capa).
const HOSTS = [
  'maps.app.goo.gl',
  'goo.gl',
  'www.google.com',
  'maps.google.com',
  'google.com',
];

export function linkMapsSeguro(u) {
  try {
    const x = new URL(u);
    return x.protocol === 'https:' && HOSTS.includes(x.hostname) ? x.href : null;
  } catch {
    return null;
  }
}

// Link de WhatsApp armado con datos de un comercio o un cliente: del número
// quedan solo los dígitos (nada de "?", "/" ni "#" que cambien el link).
export function linkWhatsapp(numero, texto) {
  const digitos = String(numero ?? '').replace(/\D/g, '');
  if (digitos.length < 8 || digitos.length > 15) return null;
  return `https://wa.me/${digitos}${texto ? `?text=${encodeURIComponent(texto)}` : ''}`;
}

// Link de WhatsApp que arma la API (con el mensaje del pedido): https y wa.me.
export function esLinkWhatsapp(u) {
  try {
    const x = new URL(u);
    return x.protocol === 'https:' && x.hostname === 'wa.me' ? x.href : null;
  } catch {
    return null;
  }
}

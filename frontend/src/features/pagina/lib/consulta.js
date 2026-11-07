import { linkWhatsapp } from '../../../shared/lib/linkSeguro.js';
import { plata } from '../../../shared/lib/plata.js';

// Link para consultar un producto por WhatsApp (tiendas sin carrito), con el
// mensaje ya escrito. null si la tienda no tiene WhatsApp.
export const linkConsulta = (tienda, producto) =>
  linkWhatsapp(
    tienda.whatsapp,
    `Hola ${tienda.nombre}, quiero consultar por ${producto.nombre} (${plata(producto.precio)}).`,
  );

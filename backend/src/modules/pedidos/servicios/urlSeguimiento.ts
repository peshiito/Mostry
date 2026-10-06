import { config } from '../../../config/env.js';

// Link único del pedido para el comprador (va en los mensajes de WhatsApp).
export const urlSeguimiento = (slug: string, token: string) =>
  `${config.URL_TIENDA.replace('{slug}', slug)}/pedido/${token}`;

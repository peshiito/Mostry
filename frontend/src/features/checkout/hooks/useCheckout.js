import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useConsulta } from '../../../shared/api/useConsulta.js';
import { whatsappLocal } from '../../../shared/lib/texto.js';
import { useCarrito } from '../../carrito/useCarrito.js';
import { esEncargo, validarDatos } from '../lib/validar.js';
import { usePremioClub } from './usePremioClub.js';
import { armarPedido, useCrearPedido } from './useCrearPedido.js';

const VACIO = { nombre: '', whatsapp: '', direccion: '', linkMaps: '' };
// Si entró al Club Mostry, sus datos vienen precargados (los puede cambiar).
const delClub = (c) =>
  c && {
    ...VACIO,
    nombre: c.nombre,
    whatsapp: whatsappLocal(c.whatsapp),
    direccion: c.direccion ?? '',
  };

// Estado y envío del checkout. Si es encargo, pasa a elegir día y hora.
export function useCheckout(tienda, estadoTienda) {
  const { items } = useCarrito();
  const pedido = useCrearPedido();
  const navegar = useNavigate();
  const club = useConsulta('/club/yo').datos?.cliente ?? null;
  const [editados, setDatos] = useState(null);
  const datos = editados ?? delClub(club) ?? VACIO;
  const [entrega, setEntrega] = useState(tienda.aceptaRetiro ? 'retiro' : 'envio');
  const [locales, setLocales] = useState({});
  const encargo = esEncargo(items, estadoTienda);
  // Los premios del Club se usan en compras inmediatas (no en encargos).
  const premio = usePremioClub(tienda, encargo ? null : club);
  async function confirmar(e) {
    e.preventDefault();
    const err = validarDatos(datos, entrega);
    setLocales(err);
    if (Object.keys(err).length) return;
    if (encargo) return navegar('/checkout/encargo', { state: { datos, entrega } });
    const r = await pedido.crear(
      armarPedido({
        datos,
        entrega,
        items,
        costoEnvio: tienda.costoEnvio,
        premio: premio.premio,
      }),
    );
    if (!r.ok) return;
    navegar(`/pedido/${r.datos.token}/pago`, { state: { recienCreado: true } });
  }
  const errores = { ...pedido.campos, ...locales };
  return {
    items,
    club,
    premio,
    datos,
    setDatos,
    entrega,
    setEntrega,
    errores,
    encargo,
    enviando: pedido.enviando,
    error: pedido.error,
    confirmar,
  };
}

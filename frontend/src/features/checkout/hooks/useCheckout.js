import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useCarrito } from '../../carrito/useCarrito.js';
import { esEncargo, validarDatos } from '../lib/validar.js';
import { armarPedido, useCrearPedido } from './useCrearPedido.js';

const VACIO = { nombre: '', whatsapp: '', direccion: '', linkMaps: '' };

// Estado y envío del checkout. Si es encargo, pasa a elegir día y hora.
export function useCheckout(tienda, estadoTienda) {
  const { items } = useCarrito();
  const pedido = useCrearPedido();
  const navegar = useNavigate();
  const [datos, setDatos] = useState(VACIO);
  const [entrega, setEntrega] = useState(tienda.aceptaRetiro ? 'retiro' : 'envio');
  const [locales, setLocales] = useState({});
  const encargo = esEncargo(items, estadoTienda);
  async function confirmar(e) {
    e.preventDefault();
    const err = validarDatos(datos, entrega);
    setLocales(err);
    if (Object.keys(err).length) return;
    if (encargo) return navegar('/checkout/encargo', { state: { datos, entrega } });
    const r = await pedido.crear(
      armarPedido({ datos, entrega, items, costoEnvio: tienda.costoEnvio }),
    );
    if (!r.ok) return;
    navegar(`/pedido/${r.datos.token}/pago`, { state: { recienCreado: true } });
  }
  const errores = { ...pedido.campos, ...locales };
  return {
    items,
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

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { avisar } from '../../../shared/avisos/avisos.js';
import { publicoApi } from '../../tienda/api/publico.js';
import { useCrearPedido } from './useCrearPedido.js';

// Encargos 2: crea el encargo y después sube las fotos de referencia (cada una
// a su ítem, con el link del pedido). El encargo queda "por aceptar": se va al
// seguimiento, salvo que haya algo para pagar ya.
export function useConfirmarEncargo() {
  const pedido = useCrearPedido();
  const navegar = useNavigate();
  const [subiendo, setSubiendo] = useState(false);
  async function subirFotos(token, cuerpo, valores) {
    const fotos = cuerpo.items
      .map((it, idx) => ({ idx, foto: valores[it.productoId]?.foto }))
      .filter((f) => f.foto);
    if (!fotos.length) return;
    setSubiendo(true);
    try {
      // Los ítems vuelven en el mismo orden en que se mandaron.
      const { items } = await publicoApi.seguimiento(token);
      for (const f of fotos)
        await publicoApi.subirFotoItem(token, items[f.idx].id, f.foto);
    } catch {
      avisar.error('No pudimos subir la foto. Mandásela a la tienda por WhatsApp.');
    } finally {
      setSubiendo(false);
    }
  }
  async function confirmar(cuerpo, valores) {
    const r = await pedido.crear(cuerpo);
    if (!r.ok) return;
    await subirFotos(r.datos.token, cuerpo, valores);
    navegar(
      r.datos.estado === 'pendiente_pago'
        ? `/pedido/${r.datos.token}/pago`
        : `/pedido/${r.datos.token}`,
      { state: { recienCreado: true } },
    );
  }
  return { confirmar, enviando: pedido.enviando || subiendo, error: pedido.error };
}

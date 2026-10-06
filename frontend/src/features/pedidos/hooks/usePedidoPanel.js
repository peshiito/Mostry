import { useAccion } from '../../../shared/api/useAccion.js';
import { useConsulta } from '../../../shared/api/useConsulta.js';
import { panel } from '../../panelBase/panelApi.js';

// Detalle de un pedido + cambio de estado y cancelación (/panel/pedidos/:id).
export function usePedidoPanel(id) {
  const { datos, cargando, error, setDatos } = useConsulta(
    `/panel/pedidos/${Number(id) || 0}`,
  );
  const accion = useAccion(
    async (ruta, cuerpo) => setDatos(await panel.post(`/pedidos/${id}/${ruta}`, cuerpo)),
    {
      exito: (_, ruta) =>
        ruta === 'cancelar' ? 'Pedido cancelado' : 'Pedido actualizado',
    },
  );
  const pedido = datos
    ? {
        ...datos,
        cliente: datos.clienteNombre,
        items: datos.items.map((i) => ({
          ...i,
          id: i.productoId,
          precio: i.precioUnitario,
        })),
      }
    : null;
  return {
    pedido,
    cargando,
    error,
    cambiarEstado: (estado, medioCobro) =>
      accion.ejecutar('estado', medioCobro ? { estado, medioCobro } : { estado }),
    cancelar: (motivo, devolucion) =>
      accion.ejecutar('cancelar', devolucion ? { motivo, devolucion } : { motivo }),
    accion,
  };
}

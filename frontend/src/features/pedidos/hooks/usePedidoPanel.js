import { useAccion } from '../../../shared/api/useAccion.js';
import { useConsulta } from '../../../shared/api/useConsulta.js';
import { panel } from '../../panelBase/panelApi.js';

const EXITOS = { cancelar: 'Pedido cancelado', aceptar: 'Encargo aceptado' };

// Detalle de un pedido + cambio de estado y cancelación (/panel/pedidos/:id).
export function usePedidoPanel(id) {
  const { datos, cargando, error, recargar, setDatos } = useConsulta(
    `/panel/pedidos/${Number(id) || 0}`,
  );
  const accion = useAccion(
    async (ruta, cuerpo) => setDatos(await panel.post(`/pedidos/${id}/${ruta}`, cuerpo)),
    {
      exito: (_, ruta) => EXITOS[ruta] ?? 'Pedido actualizado',
    },
  );
  const pedido = datos
    ? {
        ...datos,
        cliente: datos.clienteNombre,
        items: datos.items.map((i) => ({
          ...i,
          itemId: i.id,
          id: i.productoId,
          precio: i.precioUnitario,
        })),
      }
    : null;
  return {
    pedido,
    cargando,
    error,
    recargar,
    // "aceptar" no es un estado: es la ruta que acepta un encargo (Encargos 2).
    cambiarEstado: (estado, medioCobro) =>
      estado === 'aceptar'
        ? accion.ejecutar('aceptar', {})
        : accion.ejecutar('estado', medioCobro ? { estado, medioCobro } : { estado }),
    cancelar: (motivo, devolucion) =>
      accion.ejecutar('cancelar', devolucion ? { motivo, devolucion } : { motivo }),
    accion,
  };
}

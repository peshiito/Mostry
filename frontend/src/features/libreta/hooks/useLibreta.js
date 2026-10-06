import { useAccion } from '../../../shared/api/useAccion.js';
import { useConsulta } from '../../../shared/api/useConsulta.js';
import { panel } from '../../panelBase/panelApi.js';

// Libreta de fiados (/panel/libreta). El saldo lo calcula la API (sección 5).
export function useLibreta() {
  const { datos, cargando, recargar } = useConsulta('/panel/libreta/clientes');
  const clientes = datos ?? [];
  const crear = useAccion(
    async (d) => {
      await panel.post('/libreta/clientes', {
        nombre: d.nombre.trim(),
        telefono: d.telefono.trim() || null,
      });
      recargar();
    },
    { exito: 'Cliente agregado a la libreta' },
  );
  return {
    clientes,
    totalDeuda: clientes.reduce((s, c) => s + Math.max(c.saldo, 0), 0),
    conDeuda: clientes.filter((c) => c.saldo > 0).length,
    cargando,
    crear,
  };
}

// Un cliente con sus movimientos. Un pago entra a la caja (efectivo o transferencia).
export function useClienteFiado(id) {
  const { datos, cargando, setDatos } = useConsulta(
    `/panel/libreta/clientes/${Number(id) || 0}`,
  );
  const anotar = useAccion(
    async (m) => {
      const cuerpo = {
        tipo: m.tipo,
        monto: m.monto,
        detalle: m.detalle,
        ...(m.tipo === 'pago' ? { medio: m.medio } : {}),
      };
      setDatos(await panel.post(`/libreta/clientes/${id}/movimientos`, cuerpo));
    },
    { exito: (_, m) => (m.tipo === 'pago' ? 'Pago anotado' : 'Deuda anotada') },
  );
  return {
    cliente: datos,
    movimientos: datos?.movimientos ?? [],
    saldo: datos?.saldo ?? 0,
    cargando,
    anotar,
  };
}

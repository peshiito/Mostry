import { useAccion } from '../../../shared/api/useAccion.js';
import { useConsulta } from '../../../shared/api/useConsulta.js';
import { aCentavos } from '../../../shared/lib/plata.js';
import { panel } from '../../panelBase/panelApi.js';

const hoy = new Date();
const desde = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toLocaleDateString('sv-SE');
const hasta = hoy.toLocaleDateString('sv-SE');

// Gastos del mes y proveedores. Los gastos no se editan (decisión de la Etapa 4);
// si son en efectivo salen de la caja de hoy.
export function useGastos() {
  const g = useConsulta(`/panel/gastos?desde=${desde}&hasta=${hasta}`);
  const p = useConsulta('/panel/proveedores');
  const gastos = g.datos ?? [];
  const total = (tipo) =>
    gastos.filter((x) => !tipo || x.tipo === tipo).reduce((s, x) => s + x.monto, 0);
  const delMes = (id) =>
    gastos.filter((x) => x.proveedorId === id).reduce((s, x) => s + x.monto, 0);
  const proveedores = (p.datos ?? []).map((x) => ({ ...x, delMes: delMes(x.id) }));
  const crearGasto = useAccion(
    (f) =>
      panel.post('/gastos', {
        tipo: f.tipo,
        monto: aCentavos(f.monto),
        medio: f.medio,
        ...(f.proveedorId ? { proveedorId: Number(f.proveedorId) } : {}),
        detalle: f.detalle.trim() || null,
      }),
    { exito: (_, f) => (f.tipo === 'inversion' ? 'Inversión anotada' : 'Gasto anotado') },
  );
  const crearProveedor = useAccion(
    async (d) => {
      await panel.post('/proveedores', {
        nombre: d.nombre.trim(),
        contacto: d.contacto.trim() || null,
      });
      p.recargar();
    },
    { exito: 'Proveedor agregado' },
  );
  return {
    gastos,
    proveedores,
    total,
    cargando: g.cargando || p.cargando,
    crearGasto,
    crearProveedor,
  };
}

import { useState } from 'react';
import { useAccion } from '../../../shared/api/useAccion.js';
import { useConsulta } from '../../../shared/api/useConsulta.js';
import { usePanelApi } from '../../panelBase/BasePanel.jsx';
import { calcularDescuento } from '../../club/lib/descuento.js';
import { useSocio } from './useSocio.js';

// Lo que se está por cobrar en el local. El total de acá es solo para mostrar:
// el servidor pone los precios y cobra (Mejoras 3, parte C).
export function useVenta() {
  const panel = usePanelApi();
  const [lineas, setLineas] = useState([]); // [{ producto, cantidad }]
  const [suelto, setSuelto] = useState(null); // { monto, concepto }
  const [medio, setMedio] = useState('efectivo');
  const socio = useSocio(panel);
  const hoy = useConsulta('/panel/caja/ventas');
  const cambiar = (producto, delta) =>
    setLineas((ls) => {
      const actual = ls.find((l) => l.producto.id === producto.id)?.cantidad ?? 0;
      const cantidad = Math.max(0, actual + delta);
      const otras = ls.filter((l) => l.producto.id !== producto.id);
      return cantidad ? [...otras, { producto, cantidad }] : otras;
    });
  const bruto =
    lineas.reduce((s, l) => s + l.producto.precio * l.cantidad, 0) + (suelto?.monto ?? 0);
  const descuento = calcularDescuento(socio.premio, bruto);
  const total = bruto - descuento;
  const limpiar = () => (setLineas([]), setSuelto(null));
  const cobro = useAccion(
    async () => {
      const items = lineas.map((l) => ({
        productoId: l.producto.id,
        cantidad: l.cantidad,
      }));
      const r = await panel.post('/caja/ventas', {
        items,
        medio,
        ...(suelto ? { suelto } : {}),
        ...(socio.socio ? { fichaClub: socio.socio.ficha } : {}),
        ...(socio.premio ? { premio: socio.premio.compras } : {}),
      });
      limpiar();
      socio.setSocio(null);
      hoy.recargar();
      return r;
    },
    {
      exito: (r) => `Venta #${r.numero} cobrada${r.sello ? ' · sumó un sello' : ''}`,
    },
  );
  return {
    lineas,
    cambiar,
    suelto,
    setSuelto,
    medio,
    setMedio,
    total,
    descuento,
    cobro,
    hoy,
    limpiar,
    ...socio,
  };
}

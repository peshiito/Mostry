import { Route } from 'react-router';
import { PantallaPedido } from '../../features/pedidos/pantallas/PantallaPedido.jsx';
import { PantallaPedidos } from '../../features/pedidos/pantallas/PantallaPedidos.jsx';
import { PantallaRevisarComprobante } from '../../features/pedidos/pantallas/PantallaRevisarComprobante.jsx';

import { PantallaCategorias } from '../../features/productos/pantallas/PantallaCategorias.jsx';
import { PantallaProductoEditar } from '../../features/productos/pantallas/PantallaProductoEditar.jsx';
import { PantallaProductos } from '../../features/productos/pantallas/PantallaProductos.jsx';
import { PantallaPromociones } from '../../features/promociones/pantallas/PantallaPromociones.jsx';

import { PantallaCaja } from '../../features/caja/pantallas/PantallaCaja.jsx';
import { PantallaCerrarCaja } from '../../features/caja/pantallas/PantallaCerrarCaja.jsx';
import { PantallaResumen } from '../../features/caja/pantallas/PantallaResumen.jsx';

import { PantallaGastoNuevo } from '../../features/gastos/pantallas/PantallaGastoNuevo.jsx';
import { PantallaGastos } from '../../features/gastos/pantallas/PantallaGastos.jsx';
import { PantallaProveedores } from '../../features/gastos/pantallas/PantallaProveedores.jsx';

import { PantallaEncargos } from '../../features/encargos/pantallas/PantallaEncargos.jsx';

import { PantallaClienteFiado } from '../../features/libreta/pantallas/PantallaClienteFiado.jsx';
import { PantallaLibreta } from '../../features/libreta/pantallas/PantallaLibreta.jsx';
import { PantallaNotas } from '../../features/libreta/pantallas/PantallaNotas.jsx';

// Rutas de las secciones del panel (relativas a /panel).
export function rutasPanel() {
  return [
    <Route key="pe" path="pedidos" element={<PantallaPedidos />} />,
    <Route key="pd" path="pedidos/:id" element={<PantallaPedido />} />,
    <Route
      key="pc"
      path="pedidos/:id/comprobante"
      element={<PantallaRevisarComprobante />}
    />,
    <Route key="pr" path="productos" element={<PantallaProductos />} />,
    <Route key="px" path="productos/:id" element={<PantallaProductoEditar />} />,
    <Route key="ca" path="categorias" element={<PantallaCategorias />} />,
    <Route key="po" path="promociones" element={<PantallaPromociones />} />,
    <Route key="cj" path="caja" element={<PantallaCaja />} />,
    <Route key="cc" path="caja/cerrar" element={<PantallaCerrarCaja />} />,
    <Route key="cr" path="caja/resumen" element={<PantallaResumen />} />,
    <Route key="ga" path="gastos" element={<PantallaGastos />} />,
    <Route key="gn" path="gastos/nuevo" element={<PantallaGastoNuevo />} />,
    <Route key="pv" path="proveedores" element={<PantallaProveedores />} />,
    <Route key="en" path="encargos" element={<PantallaEncargos />} />,
    <Route key="li" path="libreta" element={<PantallaLibreta />} />,
    <Route key="ln" path="libreta/notas" element={<PantallaNotas />} />,
    <Route key="lc" path="libreta/:id" element={<PantallaClienteFiado />} />,
  ];
}

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAccion } from '../../../shared/api/useAccion.js';
import { useConsulta } from '../../../shared/api/useConsulta.js';
import { usePanel } from '../../panelBase/PanelContexto.jsx';
import { usePanelApi } from '../../panelBase/BasePanel.jsx';
import { aCuerpo, FORM_ENCARGO, faltante, totalEstimado } from '../lib/nuevoEncargo.js';

// Encargos 3: cargar un encargo que llegó por WhatsApp (POST /panel/encargos).
// Entra aceptado; al guardar va al detalle para avisarle al cliente.
export function useNuevoEncargo() {
  const panel = usePanelApi();
  const { tienda } = usePanel();
  const navegar = useNavigate();
  const [form, setForm] = useState(FORM_ENCARGO);
  const consulta = useConsulta('/panel/productos?encargo=true&estado=activos');
  const productos = consulta.datos?.productos ?? [];
  const accion = useAccion((cuerpo) => panel.post('/encargos', cuerpo), {
    exito: 'Encargo cargado',
  });
  async function guardar() {
    const r = await accion.ejecutar(aCuerpo(form));
    if (r.ok) navegar(`/panel/pedidos/${r.datos.id}`);
  }
  return {
    form,
    setForm,
    productos,
    consulta,
    total: totalEstimado(form, productos, tienda.costoEnvio ?? 0),
    falta: faltante(form),
    guardar,
    accion,
  };
}

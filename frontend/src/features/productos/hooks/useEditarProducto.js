import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAccion } from '../../../shared/api/useAccion.js';
import { useConsulta } from '../../../shared/api/useConsulta.js';

import { aCuerpo, aFormulario, FORM_NUEVO } from '../lib/formProducto.js';
import { validarProducto } from '../lib/validarProducto.js';
import { useBasePanel, usePanelApi } from '../../panelBase/BasePanel.jsx';

// Crear (POST) o editar (PATCH) un producto. Si otro cambió el stock mientras tanto,
// la API rechaza el cambio en vez de pisar una venta (decisión de la Etapa 4).
export function useEditarProducto(id) {
  const panel = usePanelApi();
  const base = useBasePanel();
  const nuevo = id === 'nuevo';
  const navegar = useNavigate();
  const {
    datos: original,
    cargando,
    error: errorCarga,
    recargar,
  } = useConsulta(nuevo ? null : `${base.api}/productos/${Number(id) || 0}`);
  const [editado, setForm] = useState(null);
  const form = editado ?? (original ? aFormulario(original) : FORM_NUEVO);
  const [errores, setErrores] = useState({});
  const accion = useAccion(
    (cuerpo) =>
      nuevo ? panel.post('/productos', cuerpo) : panel.patch(`/productos/${id}`, cuerpo),
    { exito: nuevo ? 'Producto creado' : 'Cambios guardados' },
  );
  async function guardar(e) {
    e.preventDefault();
    const err = validarProducto(form);
    setErrores(err);
    if (Object.keys(err).length) return;
    const r = await accion.ejecutar(aCuerpo(form, original));
    if (!r.ok) return recargar();
    navegar(nuevo ? `${base.rutas}/productos/${r.datos.id}` : `${base.rutas}/productos`, {
      replace: nuevo,
    });
  }
  return {
    errorCarga,
    recargar,
    nuevo,
    form,
    setForm,
    errores: { ...accion.campos, ...errores },
    guardar,
    cargando,
    accion,
  };
}

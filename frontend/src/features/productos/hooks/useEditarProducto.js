import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAccion } from '../../../shared/api/useAccion.js';
import { useConsulta } from '../../../shared/api/useConsulta.js';
import { panel } from '../../panelBase/panelApi.js';
import { aCuerpo, aFormulario, FORM_NUEVO } from '../lib/formProducto.js';
import { validarProducto } from '../lib/validarProducto.js';

// Crear (POST) o editar (PATCH) un producto. Si otro cambió el stock mientras tanto,
// la API rechaza el cambio en vez de pisar una venta (decisión de la Etapa 4).
export function useEditarProducto(id) {
  const nuevo = id === 'nuevo';
  const navegar = useNavigate();
  const {
    datos: original,
    cargando,
    recargar,
  } = useConsulta(nuevo ? null : `/panel/productos/${Number(id) || 0}`);
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
    navegar(nuevo ? `/panel/productos/${r.datos.id}` : '/panel/productos', {
      replace: nuevo,
    });
  }
  return {
    nuevo,
    form,
    setForm,
    errores: { ...accion.campos, ...errores },
    guardar,
    cargando,
    accion,
  };
}

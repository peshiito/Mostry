import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAccion } from '../../../shared/api/useAccion.js';
import { cuentaApi } from '../api/cuenta.js';
import { nivelClave } from '../lib/clave.js';
import { errorSlug, limpiarSlug } from '../lib/slug.js';

const VACIO = {
  email: '',
  clave: '',
  nombre: '',
  negocio: '',
  slug: '',
  terminos: false,
};

// Registro de comerciante (POST /auth/registro). Después, a verificar el email.
export function useRegistro() {
  const navegar = useNavigate();
  const accion = useAccion(cuentaApi.registrar);
  const [f, setF] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const cambiar = (k, v) =>
    setF((x) => ({ ...x, [k]: k === 'slug' ? limpiarSlug(v) : v }));
  const errSlug = f.slug ? errorSlug(f.slug) : null;
  async function enviar(e) {
    e.preventDefault();
    const err = {};
    if (!/^\S+@\S+\.\S+$/.test(f.email)) err.email = 'Revisá el email.';
    if (nivelClave(f.clave) === 0) err.clave = 'Mínimo 10 caracteres.';
    if (f.nombre.trim().length < 2) err.nombre = 'Poné tu nombre.';
    if (f.negocio.trim().length < 2) err.negocio = 'Poné el nombre del negocio.';
    if (!f.slug || errSlug) err.slug = errSlug ?? 'Elegí el link de tu tienda.';
    if (!f.terminos) err.terminos = 'Tenés que aceptar los términos.';
    setErrores(err);
    if (Object.keys(err).length) return;
    const datos = {
      email: f.email,
      clave: f.clave,
      nombre: f.nombre,
      nombreNegocio: f.negocio,
      slug: f.slug,
    };
    const r = await accion.ejecutar(datos);
    if (r.ok) navegar('/verificar', { state: { email: f.email, slug: f.slug } });
  }
  const { nombreNegocio, ...resto } = accion.campos;
  return {
    f,
    cambiar,
    errores: { ...resto, negocio: nombreNegocio, ...errores },
    errSlug,
    enviar,
    accion,
  };
}

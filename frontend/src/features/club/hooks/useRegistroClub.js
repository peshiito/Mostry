import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAccion } from '../../../shared/api/useAccion.js';
import { nivelClave } from '../../cuenta/lib/clave.js';
import { clubApi } from '../api/club.js';
import { guardarClaveDelRegistro } from '../lib/claveDelRegistro.js';

const VACIO = {
  email: '',
  clave: '',
  nombre: '',
  whatsapp: '',
  direccion: '',
  terminos: false,
};

// Registro al Club (POST /club/registro). Después, a verificar el email.
export function useRegistroClub() {
  const navegar = useNavigate();
  const accion = useAccion(clubApi.registrar);
  const [f, setF] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const cambiar = (k, v) => setF((x) => ({ ...x, [k]: v }));
  async function enviar(e) {
    e.preventDefault();
    const err = {};
    if (!/^\S+@\S+\.\S+$/.test(f.email)) err.email = 'Revisá el email.';
    if (nivelClave(f.clave) === 0) err.clave = 'Mínimo 10 caracteres.';
    if (f.nombre.trim().length < 2) err.nombre = 'Poné tu nombre.';
    if (f.whatsapp.replace(/\D/g, '').length < 10) err.whatsapp = 'Poné tu WhatsApp.';
    if (!f.terminos) err.terminos = 'Tenés que aceptar los términos.';
    setErrores(err);
    if (Object.keys(err).length) return;
    const { terminos, direccion, ...datos } = f;
    const r = await accion.ejecutar({
      ...datos,
      ...(direccion.trim() ? { direccion } : {}),
      aceptoTerminos: terminos,
    });
    if (r.ok) {
      guardarClaveDelRegistro(f.clave);
      navegar('/club/verificar', { state: { email: f.email } });
    }
  }
  return { f, cambiar, errores: { ...accion.campos, ...errores }, enviar, accion };
}

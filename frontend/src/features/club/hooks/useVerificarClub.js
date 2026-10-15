import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAccion } from '../../../shared/api/useAccion.js';
import { clubApi } from '../api/club.js';
import { claveDelRegistro, olvidarClaveDelRegistro } from '../lib/claveDelRegistro.js';

// Verificar el email pide el código Y la clave del registro: así quien verifica
// es quien eligió la clave. Viniendo del registro llega en memoria; si no, se pide.
export function useVerificarClub() {
  const navegar = useNavigate();
  const { state } = useLocation();
  const [email, setEmail] = useState(state?.email ?? '');
  const [deRegistro] = useState(claveDelRegistro);
  const [clave, setClave] = useState(deRegistro);
  const [codigo, setCodigo] = useState('');
  const verificar = useAccion(() => clubApi.verificarEmail(email, codigo, clave), {
    exito: '¡Listo! Ya sos parte del Club',
  });
  const reenvio = useAccion(() => clubApi.reenviarVerificacion(email), {
    exito: 'Te mandamos otro código',
  });
  const enviar = async (e) => {
    e.preventDefault();
    if (!(await verificar.ejecutar()).ok) return;
    olvidarClaveDelRegistro();
    navegar('/club/qr', { replace: true });
  };
  return {
    email,
    setEmail,
    clave,
    setClave,
    pedirClave: !deRegistro,
    codigo,
    setCodigo,
    verificar,
    reenvio,
    enviar,
  };
}

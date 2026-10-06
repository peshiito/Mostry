import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAccion } from '../../../shared/api/useAccion.js';
import { cuentaApi } from '../api/cuenta.js';

// Ingreso con email y contraseña. Si sale bien, entra directo al panel (o al admin).
export function useIngreso(base) {
  const navegar = useNavigate();
  const [email, setEmail] = useState('');
  const [clave, setClave] = useState('');
  const accion = useAccion(cuentaApi.ingresar, { exito: '¡Hola de nuevo!' });
  async function ingresar(e) {
    e.preventDefault();
    const r = await accion.ejecutar(email, clave);
    if (!r.ok) return;
    navegar(base || '/', { replace: true });
  }
  return { email, setEmail, clave, setClave, ingresar, accion };
}

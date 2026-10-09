import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAccion } from '../../../shared/api/useAccion.js';
import { cuentaApi } from '../api/cuenta.js';
import { irAlDestino } from '../lib/irAlDestino.js';

// Ingreso con email y contraseña. Desde la tienda o el admin entra directo; desde
// la landing sigue el destino que manda la API (admin, su tienda o elegir entre varias).
export function useIngreso(base) {
  const navegar = useNavigate();
  const [email, setEmail] = useState('');
  const [clave, setClave] = useState('');
  const [tiendas, setTiendas] = useState(null);
  const accion = useAccion(cuentaApi.ingresar, { exito: '¡Hola de nuevo!' });
  async function ingresar(e) {
    e.preventDefault();
    const r = await accion.ejecutar(email, clave);
    if (!r.ok) return;
    const varias = irAlDestino(r.datos?.destino);
    if (varias) setTiendas(varias);
    else if (!r.datos?.destino) navegar(base || '/', { replace: true });
  }
  return { email, setEmail, clave, setClave, ingresar, accion, tiendas };
}

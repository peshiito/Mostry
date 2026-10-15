import { whatsappLocal } from '../../../shared/lib/texto.js';
import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router';
import { useAccion } from '../../../shared/api/useAccion.js';
import { clubApi } from '../api/club.js';

const desde = (c) => ({
  nombre: c.nombre,
  whatsapp: whatsappLocal(c.whatsapp),
  direccion: c.direccion ?? '',
});

// "Mis datos": editar, salir y borrar la cuenta (pide la clave).
export function useMisDatos() {
  const navegar = useNavigate();
  const { cliente, setCliente } = useOutletContext();
  const [f, setF] = useState(() => desde(cliente));
  const cambiar = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const guardar = useAccion(clubApi.editar, { exito: 'Guardamos tus datos' });
  const salir = useAccion(clubApi.salir);
  const borrar = useAccion(clubApi.borrarCuenta, { exito: 'Borramos tu cuenta' });
  const afuera = () => navegar('/club', { replace: true });

  return {
    cliente,
    f,
    cambiar,
    guardar,
    salir,
    borrar,
    alGuardar: async (e) => {
      e.preventDefault();
      const r = await guardar.ejecutar(f);
      if (r.ok) setCliente(r.datos.cliente);
    },
    alSalir: async () => (await salir.ejecutar()).ok && afuera(),
    alBorrar: async (clave) => (await borrar.ejecutar(clave)).ok && afuera(),
  };
}

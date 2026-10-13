import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { SESION_VENCIDA } from '../../shared/api/cliente.js';
import { avisar } from '../../shared/avisos/avisos.js';

// Si la sesión vence a mitad de uso (la API responde 401 sin_sesion), lleva al
// ingreso en lugar de mostrar "no pudimos cargar". Después de ingresar, vuelve
// a la misma pantalla (useIngreso lee state.volver).
export function VigiaSesion({ ingreso }) {
  const navegar = useNavigate();
  const { pathname, search } = useLocation();
  useEffect(() => {
    // Varias consultas pueden fallar juntas: un solo aviso y una sola navegación.
    let avisado = false;
    const alVencer = () => {
      if (avisado) return;
      avisado = true;
      avisar.info('Tu sesión venció. Ingresá de nuevo para seguir.');
      navegar(ingreso, { replace: true, state: { volver: pathname + search } });
    };
    window.addEventListener(SESION_VENCIDA, alVencer);
    return () => window.removeEventListener(SESION_VENCIDA, alVencer);
  }, [navegar, ingreso, pathname, search]);
  return null;
}

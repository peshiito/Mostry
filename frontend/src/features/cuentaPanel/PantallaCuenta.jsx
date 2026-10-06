import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Boton } from '../../shared/ui/Boton.jsx';
import { Pagina } from '../../shared/ui/Pagina.jsx';
import { Seccion } from '../../shared/ui/Seccion.jsx';
import { TituloPagina } from '../../shared/ui/TituloPagina.jsx';
import { cuentaApi } from '../cuenta/api/cuenta.js';
import { useSesion } from '../sesion/useSesion.js';
import { AccesoCuenta } from './AccesoCuenta.jsx';
import { HojaCambiarClave } from './HojaCambiarClave.jsx';

// Mi cuenta: acceso y cierre de sesión (Stitch 51).
export function PantallaCuenta() {
  const { usuario } = useSesion();
  const navegar = useNavigate();
  const [cambiando, setCambiando] = useState(false);
  async function salir() {
    await cuentaApi.salir().catch(() => {});
    navegar('/panel/ingresar', { replace: true });
  }
  return (
    <Pagina>
      <TituloPagina migas="Cuenta" titulo="Mi cuenta" bajada={usuario?.nombre} />
      <Seccion titulo="Acceso">
        <AccesoCuenta
          email={usuario?.email ?? ''}
          onCambiarClave={() => setCambiando(true)}
        />
      </Seccion>
      <Boton
        variante="principal"
        tamano="lg"
        icono="logout"
        anchoCompleto
        onClick={salir}
      >
        Cerrar sesión
      </Boton>
      {cambiando ? (
        <HojaCambiarClave abierta onCerrar={() => setCambiando(false)} />
      ) : null}
    </Pagina>
  );
}

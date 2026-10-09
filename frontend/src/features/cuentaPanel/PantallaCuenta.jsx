import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAccion } from '../../shared/api/useAccion.js';
import { AvisoError } from '../../shared/ui/AvisoError.jsx';
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
  // Solo se sale si la API cerró la sesión: si no, la cookie seguiría viva.
  const cierre = useAccion(cuentaApi.salir);
  async function salir() {
    if ((await cierre.ejecutar()).ok) navegar('/panel/ingresar', { replace: true });
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
      <AvisoError error={cierre.error} />
      <Boton
        variante="principal"
        tamano="lg"
        cargando={cierre.enviando}
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

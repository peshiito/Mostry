import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAccion } from '../../../shared/api/useAccion.js';
import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { CampoClave } from '../../cuenta/components/CampoClave.jsx';
import { LayoutCuenta } from '../../cuenta/components/LayoutCuenta.jsx';
import css from '../../cuenta/pantallas/Cuenta.module.css';
import { clubApi } from '../api/club.js';

// Ingreso al Club. El error nunca dice si el email existe (sección 7).
export function PantallaIngresarClub() {
  const navegar = useNavigate();
  const [email, setEmail] = useState('');
  const [clave, setClave] = useState('');
  const accion = useAccion(clubApi.ingresar, { exito: '¡Hola de nuevo!' });
  const ingresar = async (e) => {
    e.preventDefault();
    if ((await accion.ejecutar(email, clave)).ok) navegar('/club/qr', { replace: true });
  };
  return (
    <LayoutCuenta volver="/club">
      <TituloPagina titulo="Ingresá al Club" bajada="Con tu email y tu clave." />
      <form className={css.form} onSubmit={ingresar} noValidate>
        <AvisoError error={accion.error} />
        {accion.error?.codigo === 'email_sin_verificar' ? (
          <Link to="/club/verificar" state={{ email }}>
            Verificar mi email
          </Link>
        ) : null}
        <Campo etiqueta="Email">
          {(c) => (
            <Entrada
              c={c}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}
        </Campo>
        <CampoClave
          etiqueta="Clave"
          valor={clave}
          onCambio={setClave}
          extra={<Link to="/club/recuperar">¿Te la olvidaste?</Link>}
        />
        <Boton
          type="submit"
          variante="principal"
          tamano="lg"
          anchoCompleto
          iconoFin="arrow_forward"
          cargando={accion.enviando}
          textoCargando="Ingresando…"
        >
          Ingresar
        </Boton>
      </form>
      <p className={css.alternativa}>
        ¿No tenés cuenta? <Link to="/club/registro">Sumate gratis</Link>
      </p>
    </LayoutCuenta>
  );
}

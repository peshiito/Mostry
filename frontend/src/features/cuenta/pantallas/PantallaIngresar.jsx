import { Link } from 'react-router';
import { urlSitio } from '../../../shared/lib/urls.js';
import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { CampoClave } from '../components/CampoClave.jsx';
import { LayoutCuenta } from '../components/LayoutCuenta.jsx';
import { useIngreso } from '../hooks/useIngreso.js';
import css from './Cuenta.module.css';

// Paso 1 del ingreso (Stitch 08), desde la tienda (/panel) o el admin.
// El error nunca dice si el email existe (sección 7).
export function PantallaIngresar({ base = '/panel', admin }) {
  const i = useIngreso(base);
  return (
    <LayoutCuenta>
      <TituloPagina
        titulo={admin ? 'Admin de Mostry' : 'Ingresá a tu panel'}
        bajada="Con tu email y tu contraseña."
      />
      <form className={css.form} onSubmit={i.ingresar} noValidate>
        <AvisoError error={i.accion.error} />
        {i.accion.error?.codigo === 'email_sin_verificar' ? (
          <a href={urlSitio('/verificar')}>Verificar mi email</a>
        ) : null}
        <Campo etiqueta="Email">
          {(c) => (
            <Entrada
              c={c}
              type="email"
              autoComplete="email"
              value={i.email}
              onChange={(e) => i.setEmail(e.target.value)}
            />
          )}
        </Campo>
        <CampoClave
          valor={i.clave}
          onCambio={i.setClave}
          extra={<Link to={`${base}/recuperar`}>¿Te la olvidaste?</Link>}
        />
        <Boton
          type="submit"
          variante="principal"
          tamano="lg"
          anchoCompleto
          iconoFin="arrow_forward"
          cargando={i.accion.enviando}
        >
          Ingresar
        </Boton>
      </form>
      {admin ? null : (
        <p className={css.alternativa}>
          ¿Todavía no tenés tienda? <a href={urlSitio('/registro')}>Creala gratis</a>
        </p>
      )}
    </LayoutCuenta>
  );
}

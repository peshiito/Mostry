import { Link } from 'react-router';
import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { AceptarTerminos } from '../../cuenta/components/AceptarTerminos.jsx';
import { CampoClave } from '../../cuenta/components/CampoClave.jsx';
import { LayoutCuenta } from '../../cuenta/components/LayoutCuenta.jsx';
import css from '../../cuenta/pantallas/Cuenta.module.css';
import { CamposCliente } from '../components/CamposCliente.jsx';
import { useRegistroClub } from '../hooks/useRegistroClub.js';

// Alta en el Club Mostry: una sola cuenta para juntar sellos en todas las tiendas.
export function PantallaRegistroClub() {
  const r = useRegistroClub();
  return (
    <LayoutCuenta volver="/club">
      <TituloPagina titulo="Sumate al Club" bajada="Una cuenta para todas las tiendas." />
      <form className={css.form} onSubmit={r.enviar} noValidate>
        <AvisoError error={r.accion.error} />
        <Campo etiqueta="Email" error={r.errores.email}>
          {(c) => (
            <Entrada
              c={c}
              type="email"
              autoComplete="email"
              value={r.f.email}
              onChange={(e) => r.cambiar('email', e.target.value)}
            />
          )}
        </Campo>
        <CampoClave
          etiqueta="Clave"
          nueva
          valor={r.f.clave}
          onCambio={(v) => r.cambiar('clave', v)}
          error={r.errores.clave}
        />
        <CamposCliente f={r.f} cambiar={r.cambiar} errores={r.errores} />
        <AceptarTerminos
          valor={r.f.terminos}
          onCambio={(v) => r.cambiar('terminos', v)}
          error={r.errores.terminos ?? r.errores.aceptoTerminos}
        />
        <Boton
          type="submit"
          variante="principal"
          tamano="lg"
          anchoCompleto
          cargando={r.accion.enviando}
          textoCargando="Creando tu cuenta…"
        >
          Crear mi cuenta
        </Boton>
      </form>
      <p className={css.alternativa}>
        ¿Ya tenés cuenta? <Link to="/club/ingresar">Ingresá</Link>
      </p>
    </LayoutCuenta>
  );
}

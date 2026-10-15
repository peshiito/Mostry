import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import { CodigoDigitos } from '../../../shared/ui/CodigoDigitos.jsx';
import { BotonReenviar } from '../../cuenta/components/BotonReenviar.jsx';
import { CabeceraIcono } from '../../cuenta/components/CabeceraIcono.jsx';
import { CampoClave } from '../../cuenta/components/CampoClave.jsx';
import { LayoutCuenta } from '../../cuenta/components/LayoutCuenta.jsx';
import css from '../../cuenta/pantallas/Cuenta.module.css';
import { useVerificarClub } from '../hooks/useVerificarClub.js';

// Código de 6 dígitos por mail. Al verificar ya queda adentro, en su QR.
export function PantallaVerificarClub() {
  const v = useVerificarClub();
  return (
    <LayoutCuenta volver="/club/registro">
      <form className={css.form} onSubmit={v.enviar} noValidate>
        <CabeceraIcono icono="mail" titulo="Revisá tu email">
          Te mandamos un código de 6 dígitos. Vence en 10 minutos.
        </CabeceraIcono>
        <AvisoError error={v.verificar.error ?? v.reenvio.error} />
        <Campo etiqueta="Email">
          {(c) => (
            <Entrada
              c={c}
              type="email"
              value={v.email}
              onChange={(e) => v.setEmail(e.target.value)}
            />
          )}
        </Campo>
        {v.pedirClave ? (
          <CampoClave etiqueta="Tu clave" valor={v.clave} onCambio={v.setClave} />
        ) : null}
        <CodigoDigitos
          valor={v.codigo}
          onCambio={v.setCodigo}
          etiqueta="Código de verificación"
        />
        <Boton
          type="submit"
          variante="principal"
          tamano="lg"
          anchoCompleto
          cargando={v.verificar.enviando}
          textoCargando="Verificando…"
          disabled={v.codigo.length !== 6 || !v.clave}
        >
          Verificar
        </Boton>
        <div className={css.links}>
          <BotonReenviar onReenviar={async () => (await v.reenvio.ejecutar()).ok} />
        </div>
      </form>
    </LayoutCuenta>
  );
}

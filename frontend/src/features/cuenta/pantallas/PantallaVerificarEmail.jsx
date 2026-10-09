import { useState } from 'react';
import { useLocation } from 'react-router';
import { useAccion } from '../../../shared/api/useAccion.js';
import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import { CodigoDigitos } from '../../../shared/ui/CodigoDigitos.jsx';
import { cuentaApi } from '../api/cuenta.js';
import { BotonReenviar } from '../components/BotonReenviar.jsx';
import { CabeceraIcono } from '../components/CabeceraIcono.jsx';
import { EmailVerificado } from '../components/EmailVerificado.jsx';
import { LayoutCuenta } from '../components/LayoutCuenta.jsx';
import css from './Cuenta.module.css';

// Verificación del email con el código de 6 dígitos (Stitch 05, sección 13).
export function PantallaVerificarEmail() {
  const { state } = useLocation();
  const [email, setEmail] = useState(state?.email ?? '');
  const [codigo, setCodigo] = useState('');
  const [listo, setListo] = useState(false);
  const verificar = useAccion(() => cuentaApi.verificarEmail(email, codigo));
  const reenvio = useAccion(() => cuentaApi.reenviarVerificacion(email), {
    exito: 'Te mandamos otro código',
  });
  const enviar = async (e) => {
    e.preventDefault();
    if ((await verificar.ejecutar()).ok) setListo(true);
  };
  if (listo) return <EmailVerificado slug={state?.slug} />;
  return (
    <LayoutCuenta volver="/registro">
      <form className={css.form} onSubmit={enviar} noValidate>
        <CabeceraIcono icono="mail" titulo="Revisá tu email">
          Te mandamos un código de 6 dígitos. Vence en 10 minutos.
        </CabeceraIcono>
        <AvisoError error={verificar.error ?? reenvio.error} />
        <Campo etiqueta="Email">
          {(c) => (
            <Entrada
              c={c}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}
        </Campo>
        <CodigoDigitos
          valor={codigo}
          onCambio={setCodigo}
          etiqueta="Código de verificación"
        />
        <Boton
          type="submit"
          variante="principal"
          tamano="lg"
          anchoCompleto
          cargando={verificar.enviando}
          disabled={codigo.length !== 6}
        >
          Verificar
        </Boton>
        <div className={css.links}>
          <BotonReenviar onReenviar={async () => (await reenvio.ejecutar()).ok} />
        </div>
      </form>
    </LayoutCuenta>
  );
}

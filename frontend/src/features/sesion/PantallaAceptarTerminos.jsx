import { useAccion } from '../../shared/api/useAccion.js';
import { urlPrivacidad, urlTerminos, VERSION_LEGAL } from '../../shared/lib/legal.js';
import { AvisoError } from '../../shared/ui/AvisoError.jsx';
import { Boton } from '../../shared/ui/Boton.jsx';
import { TituloPagina } from '../../shared/ui/TituloPagina.jsx';
import { cuentaApi } from '../cuenta/api/cuenta.js';
import { LayoutCuenta } from '../cuenta/components/LayoutCuenta.jsx';
import css from '../cuenta/pantallas/Cuenta.module.css';

// S2: los términos o la privacidad cambiaron (o la cuenta es de antes de que se
// guardara la aceptación). Antes de seguir al panel, los acepta una vez.
export function PantallaAceptarTerminos({ alTerminar }) {
  const accion = useAccion(cuentaApi.aceptarTerminos);
  async function aceptar() {
    if ((await accion.ejecutar(VERSION_LEGAL)).ok) alTerminar();
  }
  return (
    <LayoutCuenta>
      <TituloPagina
        titulo="Actualizamos los términos"
        bajada="Para seguir usando Mostry, leé y aceptá los términos y la política de privacidad."
      />
      <div className={css.form}>
        <AvisoError error={accion.error} />
        <p>
          <a href={urlTerminos()} target="_blank" rel="noopener noreferrer">
            Términos y condiciones
          </a>{' '}
          ·{' '}
          <a href={urlPrivacidad()} target="_blank" rel="noopener noreferrer">
            Política de privacidad
          </a>
        </p>
        <Boton
          variante="principal"
          tamano="lg"
          anchoCompleto
          onClick={aceptar}
          cargando={accion.enviando}
          textoCargando="Guardando…"
        >
          Leí y acepto
        </Boton>
      </div>
    </LayoutCuenta>
  );
}

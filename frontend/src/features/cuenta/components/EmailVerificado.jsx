import { urlTienda } from '../../../shared/lib/urls.js';
import { Aviso } from '../../../shared/ui/Aviso.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { LayoutCuenta } from './LayoutCuenta.jsx';

// Después de verificar: el ingreso se hace desde la tienda.
export function EmailVerificado({ slug }) {
  return (
    <LayoutCuenta>
      <Aviso tipo="ok" titulo="¡Listo! Tu email quedó verificado." />
      <p>Ya podés entrar a tu panel con tu email y tu contraseña.</p>
      <Boton
        variante="principal"
        tamano="lg"
        anchoCompleto
        href={slug ? urlTienda(slug, '/panel/ingresar') : undefined}
        to={slug ? undefined : '/ingresar'}
      >
        Ir a mi tienda
      </Boton>
    </LayoutCuenta>
  );
}

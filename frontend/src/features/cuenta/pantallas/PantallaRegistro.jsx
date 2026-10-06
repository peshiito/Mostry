import { Link } from 'react-router';
import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { CamposRegistro } from '../components/CamposRegistro.jsx';
import { LayoutCuenta } from '../components/LayoutCuenta.jsx';
import { useRegistro } from '../hooks/useRegistro.js';
import css from './Cuenta.module.css';

// Registro de comerciante (Stitch 04). Se hace desde el sitio (mostry.com.ar).
export function PantallaRegistro() {
  const r = useRegistro();
  return (
    <LayoutCuenta volver="/">
      <TituloPagina titulo="Creá tu tienda" bajada="10 días gratis, sin tarjeta." />
      <form className={css.form} onSubmit={r.enviar} noValidate>
        <AvisoError error={r.accion.error} />
        <CamposRegistro
          f={r.f}
          cambiar={r.cambiar}
          errores={r.errores}
          errSlug={r.errSlug}
        />
        <Boton
          type="submit"
          variante="principal"
          tamano="lg"
          anchoCompleto
          cargando={r.accion.enviando}
        >
          Crear mi tienda
        </Boton>
      </form>
      <p className={css.alternativa}>
        ¿Ya tenés cuenta? <Link to="/ingresar">Ingresá</Link>
      </p>
    </LayoutCuenta>
  );
}

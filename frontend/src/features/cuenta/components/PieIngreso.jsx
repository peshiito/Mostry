import { Link } from 'react-router';
import { urlSitio } from '../../../shared/lib/urls.js';
import css from '../pantallas/Cuenta.module.css';

// Debajo del formulario: crear tienda y, en la landing, entrar con el link de la tienda.
export function PieIngreso({ admin, sitio }) {
  if (admin) return null;
  return (
    <>
      <p className={css.alternativa}>
        ¿Todavía no tenés tienda? <a href={urlSitio('/registro')}>Creala gratis</a>
      </p>
      {sitio ? (
        <p className={css.alternativa}>
          <Link to="/ingresar/tienda">Entrar con el link de tu tienda</Link>
        </p>
      ) : null}
    </>
  );
}

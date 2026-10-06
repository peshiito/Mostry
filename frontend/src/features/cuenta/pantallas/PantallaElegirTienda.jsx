import { useState } from 'react';
import { Link } from 'react-router';
import { DOMINIO_BASE } from '../../../shared/lib/zonaActual.js';
import { urlTienda } from '../../../shared/lib/urls.js';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { LayoutCuenta } from '../components/LayoutCuenta.jsx';
import { limpiarSlug } from '../lib/slug.js';
import css from './Cuenta.module.css';

// En el sitio no se inicia sesión: cada comerciante entra desde su tienda.
export function PantallaElegirTienda() {
  const [slug, setSlug] = useState('');
  const ir = (e) => {
    e.preventDefault();
    if (slug.length >= 3) window.location.assign(urlTienda(slug, '/panel/ingresar'));
  };
  return (
    <LayoutCuenta volver="/">
      <TituloPagina
        titulo="Ingresá a tu panel"
        bajada="Escribí el link de tu tienda y te llevamos."
      />
      <form className={css.form} onSubmit={ir} noValidate>
        <Campo etiqueta="Tu tienda">
          {(c) => (
            <Entrada
              c={c}
              sufijo={`.${DOMINIO_BASE}`}
              autoCapitalize="none"
              value={slug}
              onChange={(e) => setSlug(limpiarSlug(e.target.value))}
            />
          )}
        </Campo>
        <Boton
          type="submit"
          variante="principal"
          tamano="lg"
          anchoCompleto
          iconoFin="arrow_forward"
          disabled={slug.length < 3}
        >
          Ir a mi panel
        </Boton>
      </form>
      <p className={css.alternativa}>
        ¿Todavía no tenés tienda? <Link to="/registro">Creala gratis</Link>
      </p>
    </LayoutCuenta>
  );
}

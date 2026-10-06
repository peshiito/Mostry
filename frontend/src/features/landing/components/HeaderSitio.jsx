import { Link } from 'react-router';
import { BotonTema } from '../../../shared/tema/BotonTema.jsx';
import { LogoMostry } from '../../../shared/ui/LogoMostry.jsx';
import { Toldo } from '../../../shared/ui/Toldo.jsx';
import css from './HeaderSitio.module.css';

// Header del sitio: toldo a rayas con festón (elemento firma) y acceso al panel.
export function HeaderSitio() {
  return (
    <>
      <header className={css.header}>
        <div className={css.interior}>
          <Link to="/" className={css.marca} aria-label="Mostry, inicio">
            <span className={css.logo}>
              <LogoMostry conTexto={false} tamano={30} />
            </span>
            <span className={css.nombre}>mostry</span>
          </Link>
          <div className={css.acciones}>
            <BotonTema tono="sobreVerde" />
            <Link to="/ingresar" className={css.ingresar}>
              Ingresar
            </Link>
          </div>
        </div>
      </header>
      <Toldo />
    </>
  );
}

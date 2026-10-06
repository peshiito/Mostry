import { BotonTema } from '../../../shared/tema/BotonTema.jsx';
import { BotonIcono } from '../../../shared/ui/BotonIcono.jsx';
import { LogoMostry } from '../../../shared/ui/LogoMostry.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import css from './LayoutCuenta.module.css';

// Marco de las pantallas de cuenta: logo arriba, tarjeta centrada y pie.
export function LayoutCuenta({ volver, extra, children }) {
  return (
    <div className={css.marco}>
      <header className={css.header}>
        {volver ? (
          <BotonIcono icono="arrow_back" etiqueta="Volver" tono="borde" to={volver} />
        ) : (
          <span />
        )}
        <LogoMostry />
        {extra ?? <BotonTema tono="borde" />}
      </header>
      <Pagina className={css.pagina}>{children}</Pagina>
      <footer className={css.pie}>
        Mostry · {new Date().getFullYear()} · Hecho para comercios de barrio
      </footer>
    </div>
  );
}

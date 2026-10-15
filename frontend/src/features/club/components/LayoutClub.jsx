import { useEffect } from 'react';
import { Outlet, useOutletContext } from 'react-router';
import { BotonTema } from '../../../shared/tema/BotonTema.jsx';
import { registrarPwa } from '../../../shared/pwa/registrarPwa.js';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { LogoInicio } from '../../cuenta/components/LogoInicio.jsx';
import css from './LayoutClub.module.css';
import { NavClub } from './NavClub.jsx';

// Marco de la app del Club (con sesión): logo, la pantalla y las 3 pestañas.
// Se puede instalar como app, con su propio manifest (solo desde /club).
export function LayoutClub() {
  // La cuenta que trae RequiereCliente sigue de largo hasta cada pantalla.
  const cuenta = useOutletContext();
  useEffect(() => {
    registrarPwa('/club.webmanifest');
  }, []);
  return (
    <div className={css.marco}>
      <header className={css.header}>
        <span className={css.marca}>
          <LogoInicio />
          <span className={css.club}>Club</span>
        </span>
        <BotonTema tono="borde" />
      </header>
      <Pagina className={css.pagina}>
        <Outlet context={cuenta} />
      </Pagina>
      <NavClub />
    </div>
  );
}

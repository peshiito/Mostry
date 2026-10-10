import { Suspense } from 'react';
import { NavLink, Outlet } from 'react-router';
import { Esqueleto } from '../../shared/ui/Esqueleto.jsx';
import { BotonTema } from '../../shared/tema/BotonTema.jsx';
import { Icono } from '../../shared/ui/Icono.jsx';
import { LogoMostry } from '../../shared/ui/LogoMostry.jsx';
import { PalabraMostry } from '../../shared/ui/logo/PalabraMostry.jsx';
import css from './LayoutAdmin.module.css';
import cel from './LayoutAdminCelular.module.css';

// Admin de Mostry (escritorio): barra lateral verde y contenido.
export function LayoutAdmin() {
  return (
    <div className={`${css.admin} ${cel.admin}`}>
      <aside className={`${css.lateral} ${cel.lateral}`}>
        <div className={css.marca}>
          <span className={css.logo}>
            <LogoMostry conTexto={false} tamano={30} />
          </span>
          <span className={css.nombre}>
            <PalabraMostry alto={22} />
          </span>
          <span className={css.chip}>Admin</span>
        </div>
        <nav aria-label="Administración" className={`${css.nav} ${cel.nav}`}>
          <NavLink to="/" end className={css.item}>
            <Icono nombre="storefront" /> Tiendas
          </NavLink>
          <NavLink to="/reportes" className={css.item}>
            <Icono nombre="support_agent" /> Reportes
          </NavLink>
          <NavLink to="/mensajes" className={css.item}>
            <Icono nombre="chat" /> Mensajes
          </NavLink>
          <NavLink to="/metricas" className={css.item}>
            <Icono nombre="bar_chart" /> Métricas
          </NavLink>
        </nav>
        <div className={css.tema}>
          <BotonTema tono="sobreVerde" />
        </div>
      </aside>
      <div className={css.contenido}>
        <Suspense fallback={<Esqueleto filas={5} />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}

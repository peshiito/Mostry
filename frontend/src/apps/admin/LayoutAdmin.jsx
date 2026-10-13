import { Suspense } from 'react';
import { TransicionRuta } from '../../shared/movimiento/TransicionRuta.jsx';
import { RedSeguridad } from '../../shared/errores/RedSeguridad.jsx';
import { EsqueletoLista } from '../../shared/ui/esqueletos/index.js';
import { BotonTema } from '../../shared/tema/BotonTema.jsx';
import { LogoMostry } from '../../shared/ui/LogoMostry.jsx';
import { PalabraMostry } from '../../shared/ui/logo/PalabraMostry.jsx';
import css from './LayoutAdmin.module.css';
import { MenuAdmin } from './MenuAdmin.jsx';
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
        <MenuAdmin />
        <div className={css.tema}>
          <BotonTema tono="sobreVerde" />
        </div>
      </aside>
      <div className={css.contenido}>
        <RedSeguridad>
          <Suspense fallback={<EsqueletoLista monto={false} />}>
            <TransicionRuta />
          </Suspense>
        </RedSeguridad>
      </div>
    </div>
  );
}

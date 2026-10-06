import { usePanel } from '../../features/panelBase/PanelContexto.jsx';
import { BotonTema } from '../../shared/tema/BotonTema.jsx';
import { BotonIcono } from '../../shared/ui/BotonIcono.jsx';
import { LogoMostry } from '../../shared/ui/LogoMostry.jsx';
import { LogoTienda } from '../../shared/ui/LogoTienda.jsx';
import css from './HeaderPanel.module.css';

// Header del panel con el logo y el nombre de la tienda (y Mostry si no tiene logo).
export function HeaderPanel() {
  const { tienda } = usePanel();
  return (
    <header className={css.header}>
      {tienda.logoUrl ? (
        <LogoTienda url={tienda.logoUrl} tamano={40} borde="claro" />
      ) : (
        <span className={css.logo}>
          <LogoMostry conTexto={false} tamano={28} />
        </span>
      )}
      <div className={css.textos}>
        <span className={css.tienda}>{tienda.nombre}</span>
        <span className={css.sub}>Panel de gestión · mostry</span>
      </div>
      <BotonTema tono="sobreVerde" />
      <BotonIcono icono="notifications" etiqueta="Avisos" tono="sobreVerde" to="/panel" />
    </header>
  );
}

import { PalabraMostry } from './logo/PalabraMostry.jsx';
import { Toldo } from './logo/Toldo.jsx';
import css from './LogoMostry.module.css';

// Logo oficial de Mostry (toldo + "mostry"), vectorial. `tamano`: ancho del toldo
// en px; la palabra mantiene la proporción del logo original. `claro`: para
// fondos oscuros o verdes (los colores del PNG oficial).
export function LogoMostry({ claro, conTexto = true, tamano = 56 }) {
  return (
    <span
      className={`${css.logo} ${claro ? css.claro : ''}`}
      style={{ gap: tamano * 0.15 }}
    >
      <Toldo ancho={tamano} />
      {conTexto ? <PalabraMostry alto={Math.round(tamano * 0.48)} /> : null}
    </span>
  );
}

import { FilasEsqueleto } from './EsqueletoLista.jsx';
import { Cargando, Hueso } from './Hueso.jsx';
import css from './esqueletos.module.css';

// Mientras arranca una zona (sesión, tienda, panel): la barra de arriba con el
// logo y una lista. Es lo primero que se ve, así que se parece a la app.
export function EsqueletoPantalla() {
  return (
    <Cargando>
      <div className={css.cabecera}>
        <Hueso ancho={40} alto={40} redondo />
        <Hueso ancho="40%" alto={20} />
      </div>
      <div className={css.caja}>
        <Hueso ancho="55%" alto={28} />
        <Hueso ancho="80%" alto={14} />
        <FilasEsqueleto filas={4} />
      </div>
    </Cargando>
  );
}

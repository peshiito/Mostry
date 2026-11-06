import { useTienda } from '../hooks/useTienda.js';
import css from './Cinta.module.css';

// Cinta que corre con el nombre y la frase (la firma de Calle, Kiosco y Bodega;
// los otros estilos la esconden). Decorativa: el texto ya está en la portada.
export function Cinta() {
  const { tienda } = useTienda();
  const texto = [tienda.nombre, tienda.frase].filter(Boolean).join(' /// ');
  return (
    <div className={css.cinta} data-v="cinta" aria-hidden="true">
      <div className={css.pista}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i}>{texto} ///&nbsp;</span>
        ))}
      </div>
    </div>
  );
}

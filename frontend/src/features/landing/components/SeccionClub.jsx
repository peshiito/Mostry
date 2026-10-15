import { Boton } from '../../../shared/ui/Boton.jsx';
import { Icono } from '../../../shared/ui/Icono.jsx';
import css from './SeccionClub.module.css';

// Para los compradores: el Club vive en mostry.com.ar/club (Lealtad).
export function SeccionClub() {
  return (
    <div className={css.club}>
      <span className={css.sello} aria-hidden="true">
        <Icono nombre="qr_code_2" tamano={36} />
      </span>
      <p className={css.texto}>Es gratis. Lo mostrás al pagar, online o en el local.</p>
      <Boton to="/club" variante="verde" tamano="lg" iconoFin="arrow_forward">
        Quiero mi QR
      </Boton>
    </div>
  );
}

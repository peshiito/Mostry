import { Boton } from '../../../shared/ui/Boton.jsx';
import { useTienda } from '../hooks/useTienda.js';
import css from './PieTienda.module.css';

// Pie: dirección, horario, WhatsApp y "Hecho con mostry".
export function PieTienda() {
  const { tienda } = useTienda();
  const wa = `https://wa.me/${tienda.whatsapp}`;
  return (
    <footer className={css.pie}>
      <p className={css.nombre}>{tienda.nombre}</p>
      <p>{tienda.direccion}</p>
      <p className={css.horario}>{tienda.horarioTexto}</p>
      <Boton icono="chat" href={wa}>
        Escribile a {tienda.nombre} por WhatsApp
      </Boton>
      <p className={css.mostry}>
        Hecho con <a href="https://mostry.com.ar">mostry</a> · ©{' '}
        {new Date().getFullYear()}
      </p>
    </footer>
  );
}

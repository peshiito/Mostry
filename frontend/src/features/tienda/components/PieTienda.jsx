import { linkWhatsapp } from '../../../shared/lib/linkSeguro.js';
import { urlPrivacidad } from '../../../shared/lib/legal.js';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { useTienda } from '../hooks/useTienda.js';
import { Horarios } from '../vitrina/Horarios.jsx';
import { Redes } from '../vitrina/Redes.jsx';
import css from './PieTienda.module.css';

// Pie: dónde estamos, horarios, cómo escribirnos y "Hecho con mostry".
export function PieTienda() {
  const { tienda } = useTienda();
  const wa = linkWhatsapp(tienda.whatsapp);
  const mapa = tienda.direccion
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tienda.direccion)}`
    : null;
  return (
    <footer className={css.pie} data-v="pie">
      <p className={css.nombre}>{tienda.nombre}</p>
      {mapa ? (
        <a
          href={mapa}
          className={css.direccion}
          rel="noopener noreferrer"
          target="_blank"
        >
          {tienda.direccion} · Cómo llegar
        </a>
      ) : null}
      <Redes redes={tienda.contenido?.redes} />
      {tienda.tramos ? <Horarios tramos={tienda.tramos} /> : null}
      {wa ? (
        <Boton icono="chat" href={wa} anchoCompleto>
          Escribile a {tienda.nombre} por WhatsApp
        </Boton>
      ) : null}
      <p className={css.mostry}>
        Hecho con <a href="https://mostry.com.ar">mostry</a> · ©{' '}
        {new Date().getFullYear()} · <a href={urlPrivacidad()}>Privacidad</a>
      </p>
    </footer>
  );
}

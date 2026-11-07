import { Link } from 'react-router';
import { linkWhatsapp } from '../../../shared/lib/linkSeguro.js';
import { urlPrivacidad } from '../../../shared/lib/legal.js';
import { LogoTienda } from '../../../shared/ui/LogoTienda.jsx';
import { useTienda } from '../hooks/useTienda.js';
import { Horarios } from '../vitrina/Horarios.jsx';
import { Redes } from '../vitrina/Redes.jsx';
import { useAjustes } from '../../pagina/AjustesPagina.jsx';
import css from './PieTienda.module.css';

const mapaDe = (d) =>
  d ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d)}` : null;

// Pie de página en columnas, como el de cualquier tienda online: la marca, dónde
// estamos y los horarios, y cómo comprar. Abajo, "Hecho con mostry".
export function PieTienda() {
  const { tienda } = useTienda();
  const { carrito } = useAjustes();
  const wa = linkWhatsapp(tienda.whatsapp);
  const mapa = mapaDe(tienda.direccion);
  return (
    <footer className={css.pie} data-v="pie">
      <div className={css.columnas}>
        <div className={css.marca}>
          <LogoTienda url={tienda.logoUrl} tamano={48} borde="ninguno" />
          <p className={css.nombre}>{tienda.nombre}</p>
          {tienda.frase ? <p className={css.frase}>{tienda.frase}</p> : null}
          <Redes redes={tienda.contenido?.redes} />
        </div>
        <div className={css.columna}>
          <h2 className={css.titulo}>Visitanos</h2>
          {mapa ? (
            <a href={mapa} rel="noopener noreferrer" target="_blank">
              {tienda.direccion} · Cómo llegar
            </a>
          ) : null}
          {tienda.tramos ? <Horarios tramos={tienda.tramos} /> : null}
        </div>
        <div className={css.columna}>
          <h2 className={css.titulo}>Comprar</h2>
          <Link to="/catalogo">Todos los productos</Link>
          {carrito ? <Link to="/carrito">Tu carrito</Link> : null}
          {wa ? (
            <a href={wa} rel="noopener noreferrer">
              WhatsApp
            </a>
          ) : null}
        </div>
      </div>
      <p className={css.mostry}>
        © {new Date().getFullYear()} {tienda.nombre} · Hecho con{' '}
        <a href="https://mostry.com.ar">mostry</a> ·{' '}
        <a href={urlPrivacidad()}>Privacidad</a>
      </p>
    </footer>
  );
}

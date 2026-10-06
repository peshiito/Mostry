import { Icono } from './Icono.jsx';
import css from './LogoTienda.module.css';

// Logo de una tienda, siempre del mismo tamaño y en el mismo círculo.
// La imagen va entera adentro (sin recortes), sea redonda, cuadrada o apaisada:
// el servidor ya le saca el borde vacío y la centra en un cuadrado.
// borde: 'mostaza' (vidriera), 'claro' (sobre el header del panel) o ninguno.
export function LogoTienda({ url, tamano = 72, borde = 'mostaza', className = '' }) {
  return (
    <span
      className={`${css.logo} ${css[borde] ?? ''} ${className}`}
      style={{ '--tam': `${tamano}px` }}
      aria-hidden="true"
    >
      {url ? (
        <img src={url} alt="" className={css.imagen} loading="lazy" decoding="async" />
      ) : (
        <Icono nombre="storefront" tamano={Math.round(tamano * 0.46)} />
      )}
    </span>
  );
}

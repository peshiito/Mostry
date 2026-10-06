import css from './Avatar.module.css';

// Inicial en círculo para clientes de la libreta y proveedores.
export function Avatar({ nombre, tono = 'verde' }) {
  return (
    <span className={`${css.avatar} ${css[tono]}`} aria-hidden="true">
      {nombre.trim().charAt(0).toUpperCase()}
    </span>
  );
}

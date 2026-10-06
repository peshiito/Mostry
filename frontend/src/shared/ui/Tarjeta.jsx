import css from './Tarjeta.module.css';

// Superficie de papel con borde de 1 px (sin sombras flotantes).
export function Tarjeta({
  as: Tag = 'section',
  relleno = true,
  tono,
  className = '',
  ...p
}) {
  const clases = [
    css.tarjeta,
    relleno ? css.relleno : '',
    tono ? css[tono] : '',
    className,
  ];
  return <Tag className={clases.join(' ')} {...p} />;
}

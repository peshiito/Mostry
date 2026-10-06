import css from './Pagina.module.css';

// Cuerpo de una pantalla: columna centrada, margen de 16 px y separación pareja.
// ancho: app (celular, 480 px) · lectura (680 px) · completo (escritorio).
export function Pagina({
  children,
  ancho = 'app',
  espacio = 'md',
  as: Tag = 'main',
  className = '',
  ...resto
}) {
  const clases = [css.pagina, css[ancho], css[espacio], className].join(' ');
  return (
    <Tag className={clases} {...resto}>
      {children}
    </Tag>
  );
}

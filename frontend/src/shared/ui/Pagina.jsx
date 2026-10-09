import css from './Pagina.module.css';

// Cuerpo de una pantalla: columna centrada, margen de 16 px y separación pareja.
// ancho: app (celular, 480 px) · lectura (680 px) · completo (escritorio).
// Siempre hay un <main id="contenido"> (destino de "Saltar al contenido"): con
// as="form", el formulario va adentro del main.
export function Pagina({
  children,
  ancho = 'app',
  espacio = 'md',
  as: Tag = 'main',
  className = '',
  ...resto
}) {
  const clases = [css.pagina, css[ancho], css[espacio], className].join(' ');
  if (Tag === 'form') {
    return (
      <main id="contenido" tabIndex={-1} className={css.main}>
        <form className={clases} {...resto}>
          {children}
        </form>
      </main>
    );
  }
  const principal = Tag === 'main' ? { id: 'contenido', tabIndex: -1 } : {};
  return (
    <Tag className={clases} {...principal} {...resto}>
      {children}
    </Tag>
  );
}

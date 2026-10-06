import { Boton } from './Boton.jsx';
import css from './Paginador.module.css';

// Anterior / siguiente para listas paginadas por la API.
export function Paginador({ pagina, paginas, onCambio }) {
  if (paginas <= 1) return null;
  return (
    <nav className={css.paginador} aria-label="Páginas">
      <Boton
        tamano="sm"
        icono="chevron_left"
        disabled={pagina <= 1}
        onClick={() => onCambio(pagina - 1)}
      >
        Anterior
      </Boton>
      <span>
        Página {pagina} de {paginas}
      </span>
      <Boton
        tamano="sm"
        iconoFin="chevron_right"
        disabled={pagina >= paginas}
        onClick={() => onCambio(pagina + 1)}
      >
        Siguiente
      </Boton>
    </nav>
  );
}

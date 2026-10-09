import { Boton } from './Boton.jsx';
import { Estado } from './Estado.jsx';
import { Pagina } from './Pagina.jsx';

// Cuando falla la carga de una pantalla: nunca mostrar datos vacíos como si
// fueran reales (por ejemplo, unos horarios en blanco que se pueden guardar).
export function ErrorCarga({ que = 'esta pantalla', onReintentar, conPagina = true }) {
  const estado = (
    <Estado
      error
      titulo={`No pudimos cargar ${que}`}
      accion={onReintentar ? <Boton onClick={onReintentar}>Reintentar</Boton> : null}
    >
      Revisá tu conexión y probá de nuevo.
    </Estado>
  );
  return conPagina ? <Pagina>{estado}</Pagina> : estado;
}

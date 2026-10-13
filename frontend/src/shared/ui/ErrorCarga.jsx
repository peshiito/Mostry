import { textoError } from '../errores/textos.js';
import { tipoError } from '../errores/tipoError.js';
import { Boton } from './Boton.jsx';
import { Estado } from './Estado.jsx';
import { Pagina } from './Pagina.jsx';

// Cuando falla la carga de una pantalla: nunca mostrar datos vacíos como si
// fueran reales (por ejemplo, unos horarios en blanco que se pueden guardar).
// El texto depende del tipo de error: un corte de internet no es un error del
// servidor, ni un "no tenés acceso". La sesión vencida la maneja VigiaSesion.
export function ErrorCarga({
  que = 'esta pantalla',
  error,
  onReintentar,
  conPagina = true,
}) {
  const tipo = tipoError(error) ?? 'desconocido';
  const t = textoError(tipo);
  const titulo = tipo === 'desconocido' ? `No pudimos cargar ${que}` : t.titulo;
  const estado = (
    <Estado
      error
      icono={t.icono}
      titulo={titulo}
      accion={
        onReintentar && t.reintentar ? (
          <Boton onClick={onReintentar}>Reintentar</Boton>
        ) : null
      }
    >
      {t.texto}
    </Estado>
  );
  return conPagina ? <Pagina>{estado}</Pagina> : estado;
}

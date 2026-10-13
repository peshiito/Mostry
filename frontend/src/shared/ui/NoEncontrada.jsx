import { Boton } from './Boton.jsx';
import { ErrorCarga } from './ErrorCarga.jsx';
import { Estado } from './Estado.jsx';
import { Pagina } from './Pagina.jsx';

const TEXTOS = {
  sitio: ['Acá no hay nada', 'La dirección no existe o cambió.', 'Ir al inicio'],
  tienda: [
    'Esta página no está en la tienda',
    'Puede que el link esté mal escrito o que la hayan sacado.',
    'Ver la tienda',
  ],
  panel: [
    'Esta parte del panel no existe',
    'Puede que el link esté mal o que lo hayan borrado.',
    'Volver al panel',
  ],
  admin: ['Acá no hay nada', 'La dirección no existe o cambió.', 'Volver a las tiendas'],
};

// 404 de cada zona, o de un detalle (`titulo`: "No encontramos ese pedido").
// `consulta` ({ error, recargar }): si la API no dijo 404, es un corte o un error
// del servidor y se muestra eso, porque el dato puede seguir existiendo.
export function NoEncontrada({ zona = 'sitio', volver = '/', titulo, consulta }) {
  const error = consulta?.error;
  if (error && error.status !== 404) {
    return <ErrorCarga error={error} onReintentar={consulta.recargar} />;
  }
  const [tituloZona, texto, boton] = TEXTOS[zona];
  return (
    <Pagina>
      <Estado
        nivel={1}
        icono="search_off"
        titulo={titulo ?? tituloZona}
        accion={<Boton to={volver}>{boton}</Boton>}
      >
        {texto}
      </Estado>
    </Pagina>
  );
}

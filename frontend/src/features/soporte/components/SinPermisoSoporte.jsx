import { Boton } from '../../../shared/ui/Boton.jsx';
import { Estado } from '../../../shared/ui/Estado.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';

// El comercio no dio permiso (o ya venció): no se muestra nada de su tienda.
export function SinPermisoSoporte({ volver }) {
  return (
    <Pagina>
      <Estado icono="lock" titulo="Esta tienda no te dio acceso de soporte" nivel={1}>
        Pedile que entre a Más → Acceso de soporte y te dé permiso por una hora.
      </Estado>
      <Boton to={volver} icono="arrow_back">
        Volver a la tienda
      </Boton>
    </Pagina>
  );
}

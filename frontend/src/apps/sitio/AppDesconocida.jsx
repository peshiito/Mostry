import { Boton } from '../../shared/ui/Boton.jsx';
import { Estado } from '../../shared/ui/Estado.jsx';
import { LogoMostry } from '../../shared/ui/LogoMostry.jsx';
import { Pagina } from '../../shared/ui/Pagina.jsx';
import { urlSitio } from '../../shared/lib/urls.js';

// Subdominio que no es una tienda (Stitch 23). En la Etapa 11 también se usa
// cuando la API responde que el slug no existe.
export default function AppDesconocida() {
  return (
    <Pagina>
      <a href={urlSitio('/')} aria-label="Ir al inicio de Mostry">
        <LogoMostry />
      </a>
      <Estado
        nivel={1}
        icono="storefront"
        titulo="Esta tienda no existe"
        accion={
          <>
            <Boton variante="principal" tamano="lg" to={urlSitio('/registro')}>
              Crear mi tienda
            </Boton>
            <Boton variante="texto" icono="arrow_back" to={urlSitio('/')}>
              Conocer Mostry
            </Boton>
          </>
        }
      >
        Revisá que el link esté bien escrito. ¿Querés tener la tuya?
      </Estado>
    </Pagina>
  );
}

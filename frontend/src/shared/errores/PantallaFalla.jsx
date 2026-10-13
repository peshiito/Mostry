import { Boton } from '../ui/Boton.jsx';
import { Estado } from '../ui/Estado.jsx';
import { Pagina } from '../ui/Pagina.jsx';

const recargar = () => window.location.reload();

// Lo que se ve cuando una pantalla se rompe (RedSeguridad). `version`: no se
// pudo bajar la pantalla porque hay una versión nueva de Mostry.
export function PantallaFalla({ version, inicio }) {
  return (
    <Pagina>
      <Estado
        error
        nivel={1}
        icono={version ? 'update' : 'running_with_errors'}
        titulo={
          version ? 'Hay una versión nueva de Mostry' : 'Algo se rompió en esta pantalla'
        }
        accion={
          <>
            <Boton variante="principal" tamano="lg" icono="refresh" onClick={recargar}>
              Recargar
            </Boton>
            {version ? null : (
              <Boton variante="texto" icono="home" to={inicio}>
                Volver al inicio
              </Boton>
            )}
          </>
        }
      >
        {version
          ? 'Recargá la página para seguir con la última versión.'
          : 'Recargá la página. Si sigue pasando, avisanos y lo revisamos.'}
      </Estado>
    </Pagina>
  );
}

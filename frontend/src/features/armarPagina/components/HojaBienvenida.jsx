import { Boton } from '../../../shared/ui/Boton.jsx';
import { Hoja } from '../../../shared/ui/Hoja.jsx';
import css from './HojaPlantillas.module.css';
import { TarjetaPlantilla } from './TarjetaPlantilla.jsx';

// La primera vez que se abre el editor: arrancar con la plantilla de su estilo,
// elegir otra, empezar de cero o seguir con la página de siempre.
export function HojaBienvenida({ abierta, sugerida, onElegir, onVerTodas, onCerrar }) {
  return (
    <Hoja
      abierta={abierta}
      onCerrar={onCerrar}
      titulo={sugerida ? 'Tu página, armada para tu rubro' : 'Elegí cómo arrancar'}
    >
      <p className={css.bajada}>
        Después cambiás todo lo que quieras. Nada se publica hasta que toques Publicar.
      </p>
      <div className={css.acciones}>
        {sugerida ? (
          <>
            <TarjetaPlantilla p={sugerida} tuya onElegir={onElegir} />
            <Boton
              variante="verde"
              anchoCompleto
              onClick={() => onElegir(sugerida.clave)}
            >
              Arrancar con la de {sugerida.nombre}
            </Boton>
          </>
        ) : (
          <Boton variante="verde" anchoCompleto onClick={onVerTodas}>
            Ver las plantillas
          </Boton>
        )}
        <div className={css.otras}>
          {sugerida ? (
            <Boton variante="texto" onClick={onVerTodas}>
              Ver otras plantillas
            </Boton>
          ) : null}
          <Boton variante="texto" onClick={() => onElegir('cero')}>
            Empezar de cero
          </Boton>
          <Boton variante="texto" onClick={() => onElegir(null)}>
            Seguir con la de siempre
          </Boton>
        </div>
      </div>
    </Hoja>
  );
}

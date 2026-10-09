import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { ErrorCarga } from '../../../shared/ui/ErrorCarga.jsx';
import { Esqueleto } from '../../../shared/ui/Esqueleto.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { EditorPlantilla } from '../components/EditorPlantilla.jsx';
import { usePlantillas } from '../hooks/usePlantillas.js';
import { VARIABLES } from '../lib/mensaje.js';
import css from './PantallaMensajes.module.css';

// Plantillas de WhatsApp para escribirle a cada comercio (Etapa 14.5, parte C).
export function PantallaMensajes() {
  const p = usePlantillas();
  if (p.cargando && !p.plantillas.length) return <Esqueleto filas={4} />;
  if (p.error) return <ErrorCarga que="las plantillas" onReintentar={p.recargar} />;
  return (
    <Pagina ancho="completo">
      <TituloPagina
        migas="Administración"
        titulo="Mensajes"
        bajada="Los textos que usás para escribirle a cada tienda por WhatsApp."
      />
      <AvisoError error={p.accion.error} />
      <Tarjeta className={css.variables}>
        <h2 className={css.titulo}>Variables</h2>
        <dl className={css.lista}>
          {VARIABLES.map(([v, d]) => (
            <div key={v}>
              <dt>{v}</dt>
              <dd>{d}</dd>
            </div>
          ))}
        </dl>
      </Tarjeta>
      {p.plantillas.map((pl) => (
        <EditorPlantilla
          key={`${pl.clave}-${pl.editada}`}
          plantilla={pl}
          datos={p.datos}
          enviando={p.accion.enviando}
          onGuardar={(texto) => p.guardar(pl.clave, texto)}
          onRestaurar={() => p.restaurar(pl.clave)}
        />
      ))}
    </Pagina>
  );
}

import { AreaTexto, Campo } from '../../../shared/ui/Campo.jsx';
import { Selector } from '../../../shared/ui/Selector.jsx';
import { SubirArchivo } from '../../../shared/ui/SubirArchivo.jsx';
import { PANTALLAS } from '../lib/pantallas.js';

const OPCIONES = [
  { valor: '', texto: 'Elegí una sección' },
  ...PANTALLAS.map(([valor, texto]) => ({ valor, texto })),
];

// Dónde pasó, qué pasó y la captura opcional.
export function CamposReporte({ r }) {
  return (
    <>
      <Campo etiqueta="¿Dónde pasó?" error={r.accion.campos.pantalla}>
        {(c) => (
          <Selector
            c={c}
            opciones={OPCIONES}
            value={r.pantalla}
            onChange={(e) => r.setPantalla(e.target.value)}
          />
        )}
      </Campo>
      <Campo
        etiqueta="¿Qué pasó?"
        ayuda="Qué estabas haciendo y qué viste. 10 letras como mínimo."
        error={r.accion.campos.descripcion}
      >
        {(c) => (
          <AreaTexto
            c={c}
            rows={6}
            maxLength={2000}
            value={r.descripcion}
            onChange={(e) => r.setDescripcion(e.target.value)}
          />
        )}
      </Campo>
      <SubirArchivo
        archivo={r.captura}
        onArchivo={r.setCaptura}
        tipos={['image/jpeg', 'image/png']}
        titulo="Adjuntá una captura (opcional)"
        ayuda="JPG o PNG, hasta 5 MB"
        errorTipo="Tiene que ser una imagen JPG o PNG."
      />
    </>
  );
}

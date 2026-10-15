import { AreaTexto, Campo } from '../../../shared/ui/Campo.jsx';
import { SubirArchivo } from '../../../shared/ui/SubirArchivo.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import css from './Personalizar.module.css';

// Encargos 2: por cada producto que se personaliza, cómo lo quiere el
// comprador (obligatorio) y una foto de referencia (opcional, privada).
// `valores`: { [productoId]: { texto, foto } }.
export function Personalizar({ items, valores, onCambio }) {
  const personalizables = items.filter((i) => i.pidePersonalizacion);
  if (personalizables.length === 0) return null;
  const set = (id, campo) => (v) =>
    onCambio({ ...valores, [id]: { ...valores[id], [campo]: v } });
  return personalizables.map((i) => (
    <Tarjeta key={i.id} className={css.bloque}>
      <h2 className={css.titulo}>{i.nombre}</h2>
      <Campo
        etiqueta={i.indicacionPersonalizacion || 'Contanos cómo lo querés'}
        ayuda="La tienda lo lee antes de aceptar tu encargo"
      >
        {(c) => (
          <AreaTexto
            c={c}
            maxLength={500}
            value={valores[i.id]?.texto ?? ''}
            onChange={(e) => set(i.id, 'texto')(e.target.value)}
          />
        )}
      </Campo>
      <SubirArchivo
        archivo={valores[i.id]?.foto ?? null}
        onArchivo={set(i.id, 'foto')}
        tipos={['image/jpeg', 'image/png']}
        titulo="Sumar una foto de referencia (opcional)"
        ayuda="JPG o PNG, hasta 5 MB"
        errorTipo="Tiene que ser una foto JPG o PNG."
      />
    </Tarjeta>
  ));
}

// Falta el texto de algún producto que se personaliza.
export const faltaPersonalizar = (items, valores) =>
  items.some((i) => i.pidePersonalizacion && !valores[i.id]?.texto?.trim());

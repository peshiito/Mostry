import { Cargando, Hueso } from './Hueso.jsx';
import css from './esqueletos.module.css';

// Formularios (horarios, editar producto, configuración): etiqueta + campo.
export function EsqueletoFormulario({ campos = 4 }) {
  return (
    <Cargando className={css.caja}>
      <Hueso ancho="50%" alto={28} />
      {Array.from({ length: campos }, (_, i) => (
        <div key={i} className={css.textos}>
          <Hueso ancho="30%" alto={12} />
          <Hueso alto={48} />
        </div>
      ))}
    </Cargando>
  );
}

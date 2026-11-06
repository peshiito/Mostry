import { Boton } from '../../../shared/ui/Boton.jsx';
import { REGISTRO } from '../../pagina/bloques/registro.js';
import { FORMULARIOS } from '../formularios/index.js';
import css from './PanelBloque.module.css';

// El formulario del bloque elegido y sus acciones. En el celu va dentro de una
// hoja; en la compu, en la columna de la derecha.
export function PanelBloque({ bloque, despachar, ctx, onListo }) {
  const Form = FORMULARIOS[bloque.tipo];
  const cambiar = (datos) => despachar({ tipo: 'datos', id: bloque.id, datos });
  return (
    <div className={css.panel}>
      <Form datos={bloque.datos} cambiar={cambiar} ctx={ctx} />
      <div className={css.acciones}>
        <Boton
          icono="content_copy"
          onClick={() => despachar({ tipo: 'duplicar', id: bloque.id })}
        >
          Duplicar
        </Boton>
        <Boton
          icono="delete"
          onClick={() => {
            despachar({ tipo: 'quitar', id: bloque.id });
            onListo();
          }}
        >
          Sacar {REGISTRO[bloque.tipo].nombre.toLowerCase()}
        </Boton>
      </div>
    </div>
  );
}

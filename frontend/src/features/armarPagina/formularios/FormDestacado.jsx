import { Opcion, TextoOpcional } from './campos.jsx';
import css from './Formularios.module.css';

const LADO = [
  ['izquierda', 'Foto a la izquierda'],
  ['derecha', 'Foto a la derecha'],
];

// Producto destacado: cuál, y si querés otro título o texto que los suyos.
export function FormDestacado({ datos, cambiar, ctx }) {
  const p = ctx.c.productos.find((x) => x.id === datos.productoId);
  return (
    <div className={css.form}>
      <Opcion
        etiqueta="Producto"
        opciones={ctx.c.productos.map((x) => [x.id, x.nombre])}
        valor={datos.productoId}
        onCambio={(id) => cambiar({ productoId: Number(id) })}
      />
      <TextoOpcional
        etiqueta="Título"
        valor={datos.titulo}
        defecto={p?.nombre}
        max={80}
        onCambio={(titulo) => cambiar({ titulo })}
      />
      <TextoOpcional
        etiqueta="Texto"
        valor={datos.texto}
        max={300}
        largo
        onCambio={(texto) => cambiar({ texto })}
        ayuda="Vacío: la descripción del producto"
      />
      <Opcion
        etiqueta="Dónde va la foto (en la compu)"
        opciones={LADO}
        valor={datos.lado}
        onCambio={(lado) => cambiar({ lado })}
      />
    </div>
  );
}

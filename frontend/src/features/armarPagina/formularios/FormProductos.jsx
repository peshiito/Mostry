import { CampoElegidos } from './CampoElegidos.jsx';
import { Opcion, TextoOpcional } from './campos.jsx';
import css from './Formularios.module.css';
import { CANTIDAD, FUENTES, fuenteNueva } from './fuentesProductos.js';

export function FormProductos({ datos, cambiar, ctx }) {
  const f = datos.fuente;
  return (
    <div className={css.form}>
      <TextoOpcional
        etiqueta="Título"
        valor={datos.titulo}
        max={60}
        onCambio={(titulo) => cambiar({ titulo })}
        ayuda="Vacío: un título automático según los productos"
      />
      <TextoOpcional
        etiqueta="Bajada"
        valor={datos.bajada}
        max={120}
        onCambio={(bajada) => cambiar({ bajada })}
        ayuda="Una línea chica debajo del título (opcional)"
      />
      <Opcion
        etiqueta="Cómo se muestran"
        opciones={[
          ['carrusel', 'Carrusel'],
          ['grilla', 'Grilla'],
        ]}
        valor={datos.vista}
        onCambio={(vista) => cambiar({ vista })}
      />
      <Opcion
        etiqueta="Qué productos"
        opciones={FUENTES}
        valor={f.tipo}
        onCambio={(t) => cambiar({ fuente: fuenteNueva(t, ctx) })}
      />
      {f.tipo === 'categoria' ? (
        <Opcion
          etiqueta="Categoría"
          opciones={ctx.c.categorias.map((k) => [k.id, k.nombre])}
          valor={f.id}
          onCambio={(id) => cambiar({ fuente: { ...f, id: Number(id) } })}
        />
      ) : null}
      {f.tipo === 'elegidos' ? (
        <CampoElegidos
          ids={f.ids}
          productos={ctx.c.productos}
          onCambio={(ids) => cambiar({ fuente: { ...f, ids } })}
        />
      ) : null}
      <Opcion
        etiqueta="Cuántos"
        opciones={CANTIDAD}
        valor={datos.cantidad}
        onCambio={(n) => cambiar({ cantidad: Number(n) })}
      />
    </div>
  );
}

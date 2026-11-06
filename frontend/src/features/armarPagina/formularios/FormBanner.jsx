import { CampoBotones } from './CampoBotones.jsx';
import { ImagenBanner } from './ImagenBanner.jsx';
import { Opcion, TextoOpcional } from './campos.jsx';
import css from './Formularios.module.css';

export function FormBanner({ datos, cambiar, ctx }) {
  const promo = datos.origen === 'promo';
  return (
    <div className={css.form}>
      <Opcion
        etiqueta="Qué muestra"
        opciones={[
          ['promo', 'Tu promo vigente'],
          ['propio', 'Un anuncio propio'],
        ]}
        valor={datos.origen}
        onCambio={(origen) =>
          cambiar({
            origen,
            titulo: origen === 'propio' ? (datos.titulo ?? 'Tu anuncio acá') : null,
          })
        }
      />
      {promo ? (
        <p className={css.nota}>
          Muestra la promo que cargás en Panel → Promociones. Si no hay ninguna, no se ve.
        </p>
      ) : (
        <>
          <TextoOpcional
            etiqueta="Título"
            valor={datos.titulo}
            max={80}
            onCambio={(titulo) => cambiar({ titulo })}
          />
          <TextoOpcional
            etiqueta="Texto"
            valor={datos.texto}
            max={240}
            largo
            onCambio={(texto) => cambiar({ texto })}
          />
        </>
      )}
      <ImagenBanner datos={datos} cambiar={cambiar} ctx={ctx} />
      <CampoBotones
        botones={datos.boton ? [datos.boton] : []}
        max={1}
        ctx={ctx}
        onCambio={([boton]) => cambiar({ boton: boton ?? null })}
      />
    </div>
  );
}

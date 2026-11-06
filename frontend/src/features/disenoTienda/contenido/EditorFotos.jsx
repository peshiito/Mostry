import { BotonIcono } from '../../../shared/ui/BotonIcono.jsx';
import { SubirFoto } from './SubirFoto.jsx';
import css from './Contenido.module.css';

// Portada y galería del local: las fotos que hacen que la tienda se vea suya.
export function EditorFotos({ v }) {
  const fotos = v.galeria.datos ?? [];
  return (
    <fieldset className={css.grupo}>
      <legend className={css.leyenda}>Fotos de tu negocio</legend>
      <p className={css.etiqueta}>Portada</p>
      {v.tienda.portadaUrl ? (
        <img src={v.tienda.portadaUrl} alt="Tu portada" className={css.portada} />
      ) : (
        <p className={css.nota}>Una foto de tu local o de tus productos, apaisada.</p>
      )}
      <SubirFoto
        texto={v.tienda.portadaUrl ? 'Cambiar portada' : 'Subir portada'}
        onArchivo={v.portada.ejecutar}
        subiendo={v.portada.enviando ? (v.portada.progreso ?? 0) : null}
      />
      <p className={css.etiqueta}>Galería del local ({fotos.length} de 8)</p>
      <ul className={css.galeria}>
        {fotos.map((f) => (
          <li key={f.id} className={css.miniatura}>
            <img src={f.url} alt="" />
            <BotonIcono
              icono="delete"
              etiqueta="Borrar foto"
              onClick={() => v.borrarFoto.ejecutar(f.id)}
            />
          </li>
        ))}
      </ul>
      <SubirFoto
        texto="Agregar foto"
        onArchivo={v.foto.ejecutar}
        subiendo={v.foto.enviando ? (v.foto.progreso ?? 0) : null}
        deshabilitado={fotos.length >= 8}
      />
    </fieldset>
  );
}

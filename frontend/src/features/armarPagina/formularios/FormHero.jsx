import { CampoBotones } from './CampoBotones.jsx';
import { CampoCarrusel } from './CampoCarrusel.jsx';
import { CampoMedios } from './CampoMedios.jsx';
import { Opcion, TextoOpcional } from './campos.jsx';
import css from './Formularios.module.css';

const IMAGEN = [
  ['portada', 'Tu foto de portada'],
  ['propia', 'Tus imágenes (foto, GIF o carrusel)'],
  ['producto', 'Un producto tuyo'],
  ['ninguna', 'Sin imagen'],
];

export function FormHero({ datos, cambiar, ctx }) {
  const medios = datos.medios ?? [];
  const carrusel = datos.carrusel ?? { segundos: 5, transicion: 'fundido' };
  return (
    <div className={css.form}>
      <TextoOpcional
        etiqueta="Título grande"
        valor={datos.titulo}
        defecto={ctx.tienda.nombre}
        max={80}
        onCambio={(titulo) => cambiar({ titulo })}
      />
      <TextoOpcional
        etiqueta="Frase"
        valor={datos.frase}
        defecto={ctx.tienda.frase}
        max={160}
        largo
        onCambio={(frase) => cambiar({ frase })}
      />
      <Opcion
        etiqueta="Imagen"
        opciones={IMAGEN}
        valor={datos.imagen}
        onCambio={(imagen) => cambiar({ imagen, medios, carrusel })}
      />
      {datos.imagen === 'propia' ? (
        <CampoMedios
          etiqueta="Imágenes (con 2 o más, van pasando solas)"
          ids={medios}
          max={6}
          ctx={ctx}
          onCambio={(m) => cambiar({ medios: m })}
        />
      ) : null}
      {datos.imagen === 'propia' && medios.length > 1 ? (
        <CampoCarrusel carrusel={carrusel} onCambio={(c) => cambiar({ carrusel: c })} />
      ) : null}
      <CampoBotones
        botones={datos.botones}
        ctx={ctx}
        onCambio={(botones) => cambiar({ botones })}
      />
    </div>
  );
}

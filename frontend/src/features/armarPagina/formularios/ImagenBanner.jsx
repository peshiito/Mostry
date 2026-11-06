import { CampoMedios } from './CampoMedios.jsx';
import { Opcion } from './campos.jsx';

// La imagen al costado del banner: un producto, una imagen propia o ninguna.
export function ImagenBanner({ datos, cambiar, ctx }) {
  return (
    <>
      <Opcion
        etiqueta="Imagen al costado"
        opciones={[
          ['producto', 'Un producto'],
          ['propia', 'Una imagen tuya'],
          ['ninguna', 'Sin imagen'],
        ]}
        valor={datos.imagen}
        onCambio={(imagen) => cambiar({ imagen, medio: datos.medio ?? null })}
      />
      {datos.imagen === 'propia' ? (
        <CampoMedios
          etiqueta="Imagen"
          ids={datos.medio ? [datos.medio] : []}
          max={1}
          ctx={ctx}
          onCambio={([medio]) => cambiar({ medio: medio ?? null })}
        />
      ) : null}
    </>
  );
}

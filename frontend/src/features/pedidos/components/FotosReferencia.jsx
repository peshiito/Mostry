import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { useAbrirFoto } from '../hooks/useAbrirFoto.js';

// Encargos 2: las fotos de referencia que mandó el comprador (privadas: se
// abren con una URL firmada de 5 minutos). Se borran 7 días después de cerrar.
export function FotosReferencia({ pedido }) {
  const abrir = useAbrirFoto(pedido.id);
  const conFoto = pedido.items.filter((i) => i.tieneFoto);
  if (conFoto.length === 0) return null;
  return (
    <>
      <AvisoError error={abrir.error} />
      {conFoto.map((i) => (
        <Boton
          key={i.itemId}
          icono="image"
          anchoCompleto
          cargando={abrir.enviando}
          onClick={() => abrir.ejecutar(i.itemId)}
        >
          Ver foto de referencia · {i.nombre}
        </Boton>
      ))}
    </>
  );
}

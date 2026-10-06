import { Boton } from '../../../shared/ui/Boton.jsx';
import { BotonIcono } from '../../../shared/ui/BotonIcono.jsx';
import { useCarrito } from '../../carrito/useCarrito.js';
import { useTienda } from '../hooks/useTienda.js';

// Acción de un producto según stock y horario (6.2 y 6.3):
// agotado → nada · fuera de horario o por encargo → "Encargar" · si no → "+".
export function BotonAgregar({ producto, conTexto }) {
  const { estado } = useTienda();
  const { cambiar } = useCarrito();
  const soloEncargo =
    estado === 'cerrada' || (producto.aceptaEncargo && producto.stock === 0);
  if (soloEncargo && !producto.aceptaEncargo) return null;
  if (soloEncargo) {
    return (
      <Boton tamano="sm" icono="schedule" to={`/producto/${producto.id}`}>
        Encargar
      </Boton>
    );
  }
  if (producto.agotado || producto.stock === 0) return null;
  if (conTexto) {
    return (
      <Boton tamano="sm" icono="add" onClick={() => cambiar(producto, 1)}>
        Sumar
      </Boton>
    );
  }
  return (
    <BotonIcono
      icono="add"
      etiqueta={`Agregar ${producto.nombre}`}
      onClick={() => cambiar(producto, 1)}
      tono="verdeLleno"
    />
  );
}

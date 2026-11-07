import { Boton } from '../../../shared/ui/Boton.jsx';
import { useAjustes } from '../../pagina/AjustesPagina.jsx';
import { BotonConsultar } from '../../pagina/BotonConsultar.jsx';
import { BotonAgregar } from '../components/BotonAgregar.jsx';

// Los botones de la tarjeta que eligió el comercio: Agregar, Ver o Consultar por
// WhatsApp. Sin carrito, "Agregar" se vuelve "Consultar" (y no se repite).
export function BotonesTarjeta({ producto }) {
  const { carrito, tarjeta } = useAjustes();
  const tipos = [
    ...new Set(
      tarjeta.botones.map((b) => (b === 'agregar' && !carrito ? 'whatsapp' : b)),
    ),
  ];
  return tipos.map((tipo) =>
    tipo === 'agregar' ? (
      <BotonAgregar key={tipo} producto={producto} />
    ) : tipo === 'ver' ? (
      <Boton key={tipo} tamano="sm" to={`/producto/${producto.id}`}>
        Ver
      </Boton>
    ) : (
      <BotonConsultar key={tipo} producto={producto} />
    ),
  );
}

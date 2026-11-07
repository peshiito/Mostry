import { Boton } from '../../shared/ui/Boton.jsx';
import { useTienda } from '../tienda/hooks/useTienda.js';
import { linkConsulta } from './lib/consulta.js';

// "Consultar por WhatsApp": en las tiendas que venden por WhatsApp reemplaza a
// "Agregar". Si la tienda no cargó su WhatsApp, no se muestra.
export function BotonConsultar({ producto, grande, texto = 'Consultar' }) {
  const { tienda } = useTienda();
  const href = linkConsulta(tienda, producto);
  if (!href) return null;
  return (
    <Boton
      href={href}
      icono="chat"
      tamano={grande ? 'lg' : 'sm'}
      variante={grande ? 'principal' : undefined}
      anchoCompleto={grande}
      aria-label={`Consultar por ${producto.nombre} por WhatsApp`}
    >
      {texto}
    </Boton>
  );
}

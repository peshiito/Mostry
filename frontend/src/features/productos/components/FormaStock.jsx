import { OpcionTarjeta } from '../../../shared/ui/OpcionTarjeta.jsx';
import css from './CamposProducto.module.css';

// Las tres formas de manejar el stock, en palabras del comerciante (Mejoras 3).
export const FORMAS_STOCK = [
  {
    valor: 'unidades',
    titulo: 'Cuento unidades',
    detalle: 'Te avisamos cuando queda poco. Ej: gaseosas, ropa, almacén.',
  },
  {
    valor: 'simple',
    titulo: 'Solo marco si hay o no hay',
    detalle: 'Sin contar nada: lo pasás a "No hay" cuando se termina. Ej: pan, facturas.',
  },
  {
    valor: 'a_pedido',
    titulo: 'Lo hago a pedido',
    detalle: 'Se encarga con fecha y no lleva stock. Ej: tortas de cumpleaños.',
  },
];

export function FormaStock({ valor, onCambio, nombre = 'modoStock' }) {
  return (
    <fieldset className={css.formas}>
      <legend className={css.leyenda}>¿Cómo manejás el stock?</legend>
      {FORMAS_STOCK.map((f) => (
        <OpcionTarjeta
          key={f.valor}
          nombre={nombre}
          valor={f.valor}
          elegido={valor}
          onElegir={onCambio}
          titulo={f.titulo}
          detalle={f.detalle}
        />
      ))}
    </fieldset>
  );
}

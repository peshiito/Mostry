import { OpcionTarjeta } from '../../../shared/ui/OpcionTarjeta.jsx';
import { textoPremio } from '../../club/lib/textoPremio.js';
import css from './Bloque.module.css';

// "Usar un premio del Club": solo aparece si tiene premios para usar acá.
// Usarlo gasta los sellos (vuelven si el pedido se cancela).
export function ElegirPremio({ p }) {
  if (!p.opciones.length) return null;
  const opciones = [{ compras: 0, texto: 'Ahora no, sigo juntando' }, ...p.opciones];
  return (
    <fieldset className={css.bloque}>
      <legend className={css.titulo}>Tenés {p.sellos} sellos: ¿usás un premio?</legend>
      {opciones.map((o) => (
        <OpcionTarjeta
          key={o.compras}
          nombre="premio"
          valor={o.compras}
          elegido={p.premio?.compras ?? 0}
          onElegir={() => p.elegir(o.compras || null)}
          titulo={o.texto ?? textoPremio(o)}
          detalle={o.texto ? null : `Usa ${o.compras} sellos`}
        />
      ))}
    </fieldset>
  );
}

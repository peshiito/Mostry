import { Icono } from '../../../shared/ui/Icono.jsx';
import css from './Beneficios.module.css';

// Lo que tranquiliza antes de comprar, con los datos reales de la tienda
// (como "Envío gratis · Pago seguro" de las tiendas grandes).
function lista(tienda, hayEncargos) {
  return [
    tienda.aceptaEnvio && [
      'local_shipping',
      'Envío a domicilio',
      tienda.zonaEnvio || 'Consultá tu zona',
    ],
    tienda.aceptaRetiro && [
      'storefront',
      'Retiro en el local',
      tienda.direccion || 'Coordinamos por WhatsApp',
    ],
    ['account_balance', 'Pagás por transferencia', 'Y mandás el comprobante desde acá'],
    hayEncargos && ['calendar_month', 'Hacé tu encargo', 'Elegís el día y la hora'],
    tienda.club && ['loyalty', 'Club de clientes', 'Sumás sellos con cada compra'],
  ]
    .filter(Boolean)
    .slice(0, 4);
}

export function Beneficios({ tienda, productos }) {
  const items = lista(
    tienda,
    productos.some((p) => p.aceptaEncargo),
  );
  return (
    <ul className={css.franja} data-v="beneficios" aria-label="Cómo comprar">
      {items.map(([icono, titulo, detalle]) => (
        <li key={icono} className={css.item}>
          <span className={css.icono} data-v="beneficio-icono">
            <Icono nombre={icono} tamano={22} />
          </span>
          <span>
            <strong className={css.titulo}>{titulo}</strong>
            <span className={css.detalle}>{detalle}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

import { Boton } from '../../../shared/ui/Boton.jsx';
import { Icono } from '../../../shared/ui/Icono.jsx';
import { MockupTienda } from './MockupTienda.jsx';
import base from './Hero.module.css';
import datos from './HeroDatos.module.css';

const css = { ...base, ...datos };

const DATOS = [
  ['100 % tuyo', 'El cliente te paga a tu cuenta.'],
  ['0 % comisión', 'La ganancia queda en tu mostrador.'],
  ['Por WhatsApp', 'Avisás cada paso con un toque.'],
];

// Tesis: el negocio de barrio online en una tarde.
export function Hero() {
  return (
    <section className={css.hero}>
      <div className={css.texto}>
        <span className={css.cinta}>
          <Icono nombre="storefront" tamano={18} /> Para facturerías, almacenes y
          verdulerías
        </span>
        <h1 className={css.titulo}>Tu negocio, online en una tarde.</h1>
        <p className={css.bajada}>
          Tienda propia, pedidos con comprobante, caja, fiados y stock. Todo desde el
          celu, sin pagar comisiones por venta.
        </p>
        <div className={css.cta}>
          <Boton variante="principal" tamano="lg" iconoFin="arrow_forward" to="/registro">
            Probalo 10 días gratis
          </Boton>
          <span className={css.nota}>Sin tarjeta de crédito.</span>
        </div>
        <dl className={css.datos}>
          {DATOS.map(([t, d]) => (
            <div key={t}>
              <dt className={css.dato}>{t}</dt>
              <dd className={css.detalle}>{d}</dd>
            </div>
          ))}
        </dl>
      </div>
      <MockupTienda />
    </section>
  );
}

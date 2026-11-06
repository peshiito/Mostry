import { linkWhatsapp } from '../../../shared/lib/linkSeguro.js';
import { Icono } from '../../../shared/ui/Icono.jsx';
import css from './CierreContacto.module.css';

// Bloque oscuro antes del pie: la invitación a escribir (como el "Ready to get
// our new stuff?" de las tiendas grandes, pero con WhatsApp).
export function CierreContacto({ tienda, titulo, texto }) {
  const wa = linkWhatsapp(tienda.whatsapp);
  if (!wa) return null;
  return (
    <section className={css.cierre} data-v="cierre" aria-labelledby="cierre-titulo">
      <h2 id="cierre-titulo" className={css.titulo}>
        {titulo ?? '¿Buscás algo que no está?'}
      </h2>
      <p className={css.texto}>
        {texto ??
          `Escribile a ${tienda.nombre} y te lo preparan o te avisan cuando llega.`}
      </p>
      <a href={wa} className={css.boton} rel="noopener noreferrer">
        <Icono nombre="chat" tamano={20} /> Escribir por WhatsApp
      </a>
    </section>
  );
}

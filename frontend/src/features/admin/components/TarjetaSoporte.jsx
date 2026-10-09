import { useState } from 'react';
import { hora } from '../../../shared/lib/fechas.js';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { HojaWhatsapp } from './HojaWhatsapp.jsx';
import css from './TarjetaSoporte.module.css';

// Contacto y ayuda: escribirle por WhatsApp y, si la tienda dio permiso, entrar
// en modo soporte (solo catálogo, horarios y datos; nunca ventas ni caja).
export function TarjetaSoporte({ tienda: t }) {
  const [escribir, setEscribir] = useState(false);
  return (
    <Tarjeta className={css.tarjeta}>
      <h2 className={css.titulo}>Contacto y soporte</h2>
      {t.soporte ? (
        <p className={css.texto}>
          <strong>Te dio acceso de soporte hasta las {hora(t.soporte.venceEn)}.</strong>{' '}
          Podés revisar y corregir su catálogo, horarios y datos de la tienda. Todo lo que
          cambies queda anotado y lo ve.
        </p>
      ) : (
        <p className={css.texto}>
          Para ayudarla con su tienda, pedile que entre a{' '}
          <strong>Más → Acceso de soporte</strong> y te dé permiso por una hora. Sin
          permiso no podés tocar nada.
        </p>
      )}
      <div className={css.acciones}>
        {t.soporte ? (
          <Boton
            variante="verde"
            icono="shield_person"
            to={`/tiendas/${t.id}/soporte/productos`}
          >
            Entrar en modo soporte
          </Boton>
        ) : null}
        <Boton icono="chat" onClick={() => setEscribir(true)}>
          Mandar WhatsApp
        </Boton>
      </div>
      <HojaWhatsapp tienda={escribir ? t : null} onCerrar={() => setEscribir(false)} />
    </Tarjeta>
  );
}

import { linkWhatsapp } from '../../../shared/lib/linkSeguro.js';
import { plata } from '../../../shared/lib/plata.js';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { CopiarDato } from '../../../shared/ui/CopiarDato.jsx';
import { Monto } from '../../../shared/ui/Monto.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { usePanel } from '../../panelBase/PanelContexto.jsx';
import { useSuscripcion } from '../hooks/useSuscripcion.js';
import css from './TarjetaPagar.module.css';

// WhatsApp de Mostry para avisar el pago (lo configura Pedro en el .env del frontend).
const WA_MOSTRY = import.meta.env.VITE_WHATSAPP_MOSTRY;

// Datos para pagar el plan y aviso por WhatsApp (el admin activa a mano, sección 3).
export function TarjetaPagar({ tono }) {
  const s = useSuscripcion();
  const { tienda } = usePanel();
  // Sin número configurado no se muestra el botón (sería un link roto).
  const aviso = linkWhatsapp(
    WA_MOSTRY,
    `Hola, pagué el plan de Mostry de ${tienda.nombre} (${plata(s.precio)}).`,
  );
  return (
    <Tarjeta tono={tono} className={css.tarjeta}>
      <div className={css.precio}>
        <Monto centavos={s.precio} tamano="lg" />
        <span>por mes</span>
      </div>
      <CopiarDato etiqueta="Alias de Mostry" valor={s.aliasMostry} mono />
      <p className={css.titular}>Titular: {s.titularMostry}</p>
      {aviso ? (
        <Boton variante="principal" tamano="lg" icono="chat" anchoCompleto href={aviso}>
          Avisar que pagué
        </Boton>
      ) : null}
    </Tarjeta>
  );
}

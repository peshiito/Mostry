import { fotoEstrella } from '../../tienda/lib/fotoEstrella.js';
import { PromoVitrina } from '../../tienda/vitrina/PromoVitrina.jsx';
import { botonesListos } from '../lib/destino.js';
import { urlsDeMedios } from '../lib/medios.js';

const VER = { texto: 'Aprovechar', destino: { tipo: 'catalogo' } };

// Banner: la promo vigente de la tienda (si no hay, no se ve) o uno propio.
export function BloqueBanner({ datos, tienda, c }) {
  const promo = datos.origen === 'promo' ? tienda.promo : null;
  if (datos.origen === 'promo' && !promo) return null;
  const [boton] = botonesListos([datos.boton ?? VER], tienda);
  return (
    <PromoVitrina
      sello={promo ? 'Promo' : null}
      titulo={datos.titulo ?? promo?.titulo}
      texto={datos.texto ?? promo?.descripcion}
      boton={boton}
      imagen={
        datos.imagen === 'propia'
          ? (urlsDeMedios(tienda, [datos.medio], true)[0] ?? null)
          : datos.imagen === 'producto'
            ? fotoEstrella(c, 1)
            : null
      }
    />
  );
}

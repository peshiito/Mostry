import { FranjaClub } from '../components/FranjaClub.jsx';
import { fotoEstrella } from '../lib/fotoEstrella.js';
import { Margen } from './AvisosVitrina.jsx';
import { GaleriaLocal } from './GaleriaLocal.jsx';
import { PromoVitrina } from './PromoVitrina.jsx';
import { SobreNosotros } from './SobreNosotros.jsx';

// Las secciones del inicio que no son productos: promo, club, historia y fotos.
export const PIEZAS_EXTRA = {
  promo: ({ tienda, c }) => (
    <PromoVitrina promo={tienda.promo} imagen={fotoEstrella(c, 1)} />
  ),
  club: ({ tienda }) =>
    tienda.club ? (
      <Margen>
        <FranjaClub club={tienda.club} />
      </Margen>
    ) : null,
  nosotros: ({ tienda, titulo }) => (
    <SobreNosotros
      texto={tienda.contenido?.sobreNosotros}
      titulo={titulo}
      foto={tienda.galeria?.[0]?.url}
    />
  ),
  galeria: ({ tienda, titulo }) => (
    <GaleriaLocal fotos={tienda.galeria} titulo={titulo} />
  ),
  envios: () => null, // el envío ya está en los beneficios, arriba
};

import { FranjaClub } from '../../tienda/components/FranjaClub.jsx';
import { Beneficios } from '../../tienda/sitio/Beneficios.jsx';
import { CierreContacto } from '../../tienda/sitio/CierreContacto.jsx';
import { Margen } from '../../tienda/vitrina/AvisosVitrina.jsx';
import { CategoriasVitrina } from '../../tienda/vitrina/CategoriasVitrina.jsx';
import { GaleriaLocal } from '../../tienda/vitrina/GaleriaLocal.jsx';
import { SobreNosotros } from '../../tienda/vitrina/SobreNosotros.jsx';
import css from './Bloques.module.css';

// Bloques chicos: cada uno arma una pieza de la vidriera con sus datos.
export const BloqueBeneficios = ({ tienda, c }) => (
  <Beneficios tienda={tienda} productos={c.productos} />
);

export const BloqueCategorias = ({ c }) =>
  c.cargando ? null : (
    <CategoriasVitrina categorias={c.categorias} productos={c.productos} />
  );

export const BloqueNosotros = ({ datos, tienda }) => (
  <SobreNosotros
    texto={tienda.contenido?.sobreNosotros}
    titulo={datos.titulo ?? undefined}
    foto={tienda.galeria?.[0]?.url}
  />
);

export const BloqueGaleria = ({ datos, tienda }) => (
  <GaleriaLocal fotos={tienda.galeria} titulo={datos.titulo ?? undefined} />
);

export const BloqueCierre = ({ datos, tienda }) => (
  <CierreContacto tienda={tienda} titulo={datos.titulo} texto={datos.texto} />
);

export const BloqueClub = ({ tienda }) =>
  tienda.club ? (
    <Margen>
      <FranjaClub club={tienda.club} />
    </Margen>
  ) : null;

export const BloqueTexto = ({ datos }) => (
  <section className={css.texto} data-alineacion={datos.alineacion} data-v="bloque-texto">
    {datos.titulo ? (
      <h2 className={css.titulo} data-v="titulo">
        {datos.titulo}
      </h2>
    ) : null}
    <p className={css.cuerpo}>{datos.cuerpo}</p>
  </section>
);

export const BloqueSeparador = ({ datos }) => (
  <div
    className={css.separador}
    data-tamano={datos.tamano}
    data-linea={datos.linea ? 'si' : 'no'}
    aria-hidden="true"
  />
);

import { Icono } from '../../../shared/ui/Icono.jsx';
import { EstadoApertura } from '../components/EstadoApertura.jsx';
import { BotonPortada as Boton } from './BotonPortada.jsx';
import { CarruselFotos } from './CarruselFotos.jsx';
import css from './Portada.module.css';

// El hero de la tienda: nombre grande, frase, estado y sus botones, con una
// imagen. `aLoAncho` pone la foto detrás del texto (la portada que subió el
// comercio); si no, va al lado (estilos/portadas.css). Los datos los arma el
// bloque Hero (features/pagina).
export function Portada({
  titulo,
  frase,
  foto,
  fotos,
  carrusel,
  aLoAncho,
  botones = [],
}) {
  return (
    <section
      className={css.hero}
      data-v="portada"
      data-foto={aLoAncho ? 'si' : 'no'}
      aria-labelledby="nombre-tienda"
    >
      <div className={css.texto} data-v="texto">
        <span data-v="estado">
          <EstadoApertura />
        </span>
        <h1 id="nombre-tienda" className={css.nombre} data-v="nombre">
          {titulo}
        </h1>
        {frase ? (
          <p className={css.frase} data-v="frase">
            {frase}
          </p>
        ) : null}
        {botones.length ? (
          <div className={css.acciones} data-v="acciones">
            {botones.map((b, i) => (
              <Boton
                key={i}
                b={b}
                className={i === 0 ? css.cta : css.cta2}
                data-v={i === 0 ? 'cta' : 'cta2'}
              >
                {i > 0 && b.icono ? <Icono nombre={b.icono} tamano={18} /> : null}
                {b.texto}
                {i === 0 ? <Icono nombre="arrow_forward" tamano={18} /> : null}
              </Boton>
            ))}
          </div>
        ) : null}
      </div>
      {fotos?.length > 1 ? (
        <div className={css.imagen} data-v="imagen">
          <CarruselFotos fotos={fotos} {...carrusel} />
        </div>
      ) : foto ? (
        <div className={css.imagen} data-v="imagen">
          <img src={foto} alt="" decoding="async" fetchPriority="high" />
        </div>
      ) : null}
    </section>
  );
}

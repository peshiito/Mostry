import { fotoEstrella } from '../../tienda/lib/fotoEstrella.js';
import { Portada } from '../../tienda/vitrina/Portada.jsx';
import { botonesListos } from '../lib/destino.js';
import { urlsDeMedios } from '../lib/medios.js';

// Portada: el nombre (o el título que eligió), su frase, botones y la imagen.
// "portada": la foto que subió (a lo ancho) o su producto estrella. "propia":
// sus imágenes de la biblioteca, a lo ancho (con 2 o más, carrusel).
export function BloqueHero({ datos, tienda, c }) {
  const propias = datos.imagen === 'propia' ? urlsDeMedios(tienda, datos.medios) : [];
  const conPortada = datos.imagen === 'portada' && tienda.portadaUrl;
  const foto = propias[0] ?? (conPortada ? tienda.portadaUrl : null);
  const deRespaldo =
    datos.imagen === 'ninguna' || propias.length ? null : fotoEstrella(c);
  return (
    <Portada
      titulo={datos.titulo ?? tienda.nombre}
      frase={datos.frase ?? tienda.frase}
      foto={foto ?? deRespaldo}
      fotos={propias}
      carrusel={datos.carrusel}
      aLoAncho={Boolean(foto)}
      botones={botonesListos(datos.botones, tienda)}
    />
  );
}

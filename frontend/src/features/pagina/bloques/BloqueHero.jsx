import { fotoEstrella } from '../../tienda/lib/fotoEstrella.js';
import { Portada } from '../../tienda/vitrina/Portada.jsx';
import { botonesListos } from '../lib/destino.js';

// Portada: el nombre (o el título que eligió), su frase, botones y la imagen.
// "portada" usa la foto que subió (a lo ancho) o, si no tiene, su producto estrella.
export function BloqueHero({ datos, tienda, c }) {
  const conFoto = datos.imagen === 'portada' && tienda.portadaUrl;
  const foto = conFoto
    ? tienda.portadaUrl
    : datos.imagen === 'ninguna'
      ? null
      : fotoEstrella(c);
  return (
    <Portada
      titulo={datos.titulo ?? tienda.nombre}
      frase={datos.frase ?? tienda.frase}
      foto={foto}
      aLoAncho={Boolean(conFoto)}
      botones={botonesListos(datos.botones, tienda)}
    />
  );
}

import { BloqueBanner } from './BloqueBanner.jsx';
import { BloqueHero } from './BloqueHero.jsx';
import { BloqueProductos } from './BloqueProductos.jsx';
import * as S from './simples.jsx';

// Registro de bloques de "Armá tu página": cada tipo con su componente, su nombre
// e ícono (para el editor). La vidriera y el editor usan este mismo registro.
export const REGISTRO = {
  hero: { nombre: 'Portada', icono: 'image', Componente: BloqueHero },
  beneficios: {
    nombre: 'Beneficios',
    icono: 'local_shipping',
    Componente: S.BloqueBeneficios,
  },
  categorias: { nombre: 'Categorías', icono: 'category', Componente: S.BloqueCategorias },
  productos: { nombre: 'Productos', icono: 'local_mall', Componente: BloqueProductos },
  banner: { nombre: 'Banner', icono: 'sell', Componente: BloqueBanner },
  texto: { nombre: 'Texto', icono: 'description', Componente: S.BloqueTexto },
  nosotros: { nombre: 'Sobre nosotros', icono: 'store', Componente: S.BloqueNosotros },
  galeria: { nombre: 'Galería', icono: 'image', Componente: S.BloqueGaleria },
  cierre: { nombre: 'Contacto por WhatsApp', icono: 'chat', Componente: S.BloqueCierre },
  club: { nombre: 'Club de clientes', icono: 'loyalty', Componente: S.BloqueClub },
  separador: { nombre: 'Espacio', icono: 'more_horiz', Componente: S.BloqueSeparador },
};

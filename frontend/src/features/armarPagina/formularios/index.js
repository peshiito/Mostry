import { FormBanner } from './FormBanner.jsx';
import { FormCategorias } from './FormCategorias.jsx';
import { FormDestacado } from './FormDestacado.jsx';
import { FormHero } from './FormHero.jsx';
import { FormProductos } from './FormProductos.jsx';
import * as O from './FormsOtros.jsx';
import * as F from './FormsTexto.jsx';

// El formulario de cada tipo de bloque.
export const FORMULARIOS = {
  hero: FormHero,
  productos: FormProductos,
  banner: FormBanner,
  texto: F.FormTexto,
  categorias: FormCategorias,
  destacado: FormDestacado,
  nosotros: F.FormTitulo,
  galeria: F.FormTitulo,
  cierre: F.FormCierre,
  separador: O.FormSeparador,
  beneficios: O.SinFormulario,
  club: O.SinFormulario,
};

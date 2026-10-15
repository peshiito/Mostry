import { ayuda } from './ayuda.js';
import { club } from './club.js';
import { comercio } from './comercio.js';
import { errores } from './errores.js';
import { estados } from './estados.js';
import { navegacion } from './navegacion.js';
import { objetos } from './objetos.js';
import { tema } from './tema.js';

export const ICONOS = {
  ...navegacion,
  ...estados,
  ...comercio,
  ...objetos,
  ...tema,
  ...ayuda,
  ...errores,
  ...club,
};

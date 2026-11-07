import { avisar } from '../../../shared/avisos/avisos.js';
import { REGISTRO } from '../../pagina/bloques/registro.js';

// Saca un bloque de la página y avisa con "Deshacer" (por si fue sin querer).
export function quitar(id, despachar, bloques) {
  const tipo = bloques.find((b) => b.id === id)?.tipo;
  despachar({ tipo: 'quitar', id });
  avisar.info(`Sacaste ${REGISTRO[tipo]?.nombre ?? 'el bloque'}`, {
    accion: { texto: 'Deshacer', alHacer: () => despachar({ tipo: 'deshacer' }) },
  });
}

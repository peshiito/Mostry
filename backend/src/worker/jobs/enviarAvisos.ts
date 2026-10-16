import { colaRepo } from '../../modules/avisos/cola.repository.js';
import { enviarAvisos } from '../../modules/avisos/enviar.js';

// Job (cada minuto): la red de seguridad de los avisos push. La API los manda
// al toque; acá van los que quedaron (la API se cayó, falló el servicio de
// push). Deja 20 s a la API y no repite: cada aviso se reclama una sola vez.
export async function enviarAvisosPendientes(ahora = new Date()) {
  const r = await enviarAvisos({ ahora, soloViejos: true });
  await colaRepo.limpiar(ahora);
  return r;
}

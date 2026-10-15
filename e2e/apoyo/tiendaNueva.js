import { CLAVE, PUERTO_API, URL_SITIO } from './entorno.js';
import { ultimoCodigo } from './mailpit.js';

const API = `http://localhost:${PUERTO_API}`;

async function postear(ruta, cuerpo) {
  const r = await fetch(API + ruta, {
    method: 'POST',
    headers: { Origin: URL_SITIO, 'Content-Type': 'application/json' },
    body: JSON.stringify(cuerpo),
  });
  if (!r.ok) throw new Error(`${ruta} → ${r.status} ${await r.text()}`);
}

// Registra y verifica una tienda nueva por la API (como lo haría alguien desde la
// landing). Cada prueba usa la suya: así no toca las tiendas del seed.
export async function tiendaNueva(prefijo) {
  const n = Date.now().toString(36);
  const slug = `${prefijo}-${n}`;
  const email = `${slug}@e2e.test`;
  const nombreNegocio = `Prueba ${prefijo} ${n}`;
  await postear('/auth/registro', {
    email,
    clave: CLAVE,
    nombre: 'Dueña',
    nombreNegocio,
    slug,
  });
  await postear('/auth/verificar-email', { email, codigo: await ultimoCodigo(email) });
  return { slug, email, nombreNegocio };
}

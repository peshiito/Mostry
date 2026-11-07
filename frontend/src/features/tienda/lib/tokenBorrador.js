// "Mirala en tu celu": el token del borrador llega en ?borrador= y se guarda en
// la pestaña (por tienda), así sigue al navegar al catálogo o a un producto. Si
// el navegador no deja guardar, vale igual mientras la URL lo tenga.
const clave = (slug) => `mostry:borrador:${slug}`;
const FORMA = /^\d{1,16}\.[a-f0-9]{64}$/;

export function tokenBorrador(slug, busqueda = window.location.search) {
  const enUrl = new URLSearchParams(busqueda).get('borrador');
  if (enUrl && FORMA.test(enUrl)) {
    try {
      sessionStorage.setItem(clave(slug), enUrl);
    } catch {
      /* sin almacenamiento: alcanza con la URL */
    }
    return enUrl;
  }
  try {
    const guardado = sessionStorage.getItem(clave(slug));
    return guardado && FORMA.test(guardado) ? guardado : null;
  } catch {
    return null;
  }
}

export function salirDelBorrador(slug) {
  try {
    sessionStorage.removeItem(clave(slug));
  } catch {
    /* nada que borrar */
  }
}

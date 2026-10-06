// Modo claro / oscuro. La preferencia ('sistema' | 'claro' | 'oscuro') se guarda
// en este navegador; con 'sistema' sigue al celular o la compu (y a sus cambios).
const CLAVE = 'mostry:tema';
const COLOR_BARRA = { claro: '#0E5A4A', oscuro: '#0F1714' };
// Sin matchMedia (tests en jsdom) se comporta como un sistema en modo claro.
const consulta =
  typeof matchMedia === 'function'
    ? matchMedia('(prefers-color-scheme: dark)')
    : { matches: false, addEventListener() {} };
const oyentes = new Set();

function leer() {
  try {
    const v = localStorage.getItem(CLAVE);
    return ['claro', 'oscuro'].includes(v) ? v : 'sistema';
  } catch {
    return 'sistema';
  }
}

let preferencia = leer();

export const resolver = (p, sistemaOscuro) =>
  p === 'sistema' ? (sistemaOscuro ? 'oscuro' : 'claro') : p;

function aplicar() {
  const modo = resolver(preferencia, consulta.matches);
  document.documentElement.dataset.tema = modo;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', COLOR_BARRA[modo]);
  oyentes.forEach((o) => o());
}

consulta.addEventListener('change', () => preferencia === 'sistema' && aplicar());
aplicar();

export const almacenTema = {
  leer: () => preferencia,
  suscribir(oyente) {
    oyentes.add(oyente);
    return () => oyentes.delete(oyente);
  },
};

export function elegirTema(nueva) {
  preferencia = nueva;
  try {
    if (nueva === 'sistema') localStorage.removeItem(CLAVE);
    else localStorage.setItem(CLAVE, nueva);
  } catch {
    /* sin almacenamiento (modo privado): vale para esta visita */
  }
  aplicar();
}

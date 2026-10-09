import { fechaCorta } from '../../../shared/lib/fechas.js';
import { plata } from '../../../shared/lib/plata.js';
import { urlTienda } from '../../../shared/lib/urls.js';

// "{dias}" en lenguaje de todos los días.
export function textoDias(dias) {
  if (dias === null || dias === undefined) return 'sin fecha de vencimiento';
  if (dias <= 0) return 'vence hoy';
  if (dias === 1) return 'vence mañana';
  return `te quedan ${dias} días`;
}

// Saludo con el nombre de pila del dueño (si no hay nombre, sin nombre).
const pila = (nombre) => (nombre ?? '').trim().split(/\s+/)[0] ?? '';

// Reemplaza las variables de una plantilla con los datos de la tienda y de Mostry.
// Una variable desconocida queda tal cual, así se nota y se corrige a mano.
export function armarMensaje(texto, tienda, datos) {
  const valores = {
    dueno: pila(tienda.nombreDueno),
    tienda: tienda.nombre,
    vence: tienda.venceEl ? fechaCorta(tienda.venceEl) : '—',
    dias: textoDias(tienda.diasRestantes),
    precio: datos?.precio ? plata(datos.precio) : '',
    alias: datos?.alias ?? '',
    titular: datos?.titular ?? '',
    link: urlTienda(tienda.slug, '/'),
  };
  return texto
    .replace(/\{(\w+)\}/g, (todo, clave) => (clave in valores ? valores[clave] : todo))
    .replace(/Hola ,/, 'Hola,');
}

// Qué plantilla conviene según el momento de la tienda.
export function plantillaSugerida(tienda) {
  if (tienda.estado === 'prueba') return 'vence_prueba';
  if (tienda.estado === 'activa' || tienda.estado === 'gracia')
    return tienda.planHasta ? 'vence_plan' : 'vence_prueba';
  return 'personalizado';
}

export const VARIABLES = [
  ['{dueno}', 'Nombre del dueño'],
  ['{tienda}', 'Nombre de la tienda'],
  ['{vence}', 'Fecha de vencimiento'],
  ['{dias}', '"te quedan 2 días", "vence mañana"…'],
  ['{precio}', 'Precio del plan'],
  ['{alias}', 'Alias de Mostry'],
  ['{titular}', 'Titular del alias'],
  ['{link}', 'Link de la tienda'],
];

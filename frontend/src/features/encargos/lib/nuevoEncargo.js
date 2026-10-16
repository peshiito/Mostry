import { aCentavos } from '../../../shared/lib/plata.js';

// Encargos 3: el encargo que le llegó por WhatsApp, cargado desde el panel.
export const FORM_ENCARGO = {
  nombre: '',
  whatsapp: '',
  entrega: 'retiro',
  direccion: '',
  fecha: '',
  hora: '12:00',
  cantidades: {}, // { [productoId]: cantidad }
  notas: {}, // { [productoId]: personalización }
  conSena: false,
  sena: '',
  medio: 'efectivo',
};

// Total estimado (solo ayuda: el que vale lo calcula el servidor, 6.1).
export const totalEstimado = (f, productos, costoEnvio) =>
  productos.reduce((s, p) => s + p.precio * (f.cantidades[p.id] ?? 0), 0) +
  (f.entrega === 'envio' ? costoEnvio : 0);

// Lo que falta para poder guardar, o null si está todo.
export function faltante(f) {
  if (f.nombre.trim().length < 2) return 'Falta el nombre del cliente.';
  if (!f.whatsapp.trim()) return 'Falta el WhatsApp del cliente.';
  if (f.entrega === 'envio' && f.direccion.trim().length < 5)
    return 'Falta la dirección.';
  if (!f.fecha) return 'Elegí el día del encargo.';
  if (!Object.values(f.cantidades).some((c) => c > 0))
    return 'Sumá al menos un producto.';
  if (f.conSena && !(aCentavos(f.sena) > 0)) return 'Escribí cuánto te pagó de seña.';
  return null;
}

// Formulario → cuerpo de POST /panel/encargos. La hora es la de Argentina.
export function aCuerpo(f) {
  const items = Object.entries(f.cantidades)
    .filter(([, c]) => c > 0)
    .map(([id, cantidad]) => ({
      productoId: Number(id),
      cantidad,
      ...(f.notas[id]?.trim() ? { personalizacion: f.notas[id].trim() } : {}),
    }));
  return {
    clienteNombre: f.nombre.trim(),
    clienteWhatsapp: f.whatsapp.trim(),
    entrega: f.entrega,
    ...(f.entrega === 'envio' ? { direccion: f.direccion.trim() } : {}),
    fechaEncargo: new Date(`${f.fecha}T${f.hora}:00-03:00`).toISOString(),
    items,
    ...(f.conSena ? { sena: { monto: aCentavos(f.sena), medio: f.medio } } : {}),
  };
}

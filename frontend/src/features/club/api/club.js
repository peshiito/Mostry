import { api } from '../../../shared/api/cliente.js';

// Endpoints del Club Mostry (/club). Ver backend/src/modules/club.
const post = (ruta, cuerpo) => api(`/club${ruta}`, { metodo: 'POST', cuerpo });

export const clubApi = {
  registrar: (d) => post('/registro', d),
  verificarEmail: (email, codigo, clave) =>
    post('/verificar-email', { email, codigo, clave }),
  reenviarVerificacion: (email) => post('/verificar-email/reenviar', { email }),
  ingresar: (email, clave) => post('/login', { email, clave }),
  salir: () => post('/logout'),
  pedirRecuperacion: (email) => post('/recuperar', { email }),
  confirmarRecuperacion: (d) => post('/recuperar/confirmar', d),
  editar: (d) => api('/club/datos', { metodo: 'PATCH', cuerpo: d }),
  borrarCuenta: (clave) => api('/club/cuenta', { metodo: 'DELETE', cuerpo: { clave } }),
  qr: (senal) => api('/club/qr', { senal }),
};

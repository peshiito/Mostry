import { api } from '../../../shared/api/cliente.js';

// Endpoints de cuenta y sesión (/auth). Ver backend/src/modules/auth.
const post = (ruta, cuerpo) => api(`/auth${ruta}`, { metodo: 'POST', cuerpo });

export const cuentaApi = {
  registrar: (d) => post('/registro', d),
  verificarEmail: (email, codigo) => post('/verificar-email', { email, codigo }),
  reenviarVerificacion: (email) => post('/verificar-email/reenviar', { email }),
  ingresar: (email, clave) => post('/login', { email, clave }),
  salir: () => post('/logout'),
  pedirRecuperacion: (email) => post('/recuperar', { email }),
  confirmarRecuperacion: (d) => post('/recuperar/confirmar', d),
  cambiarClave: (d) => post('/cambiar-clave', d),
  yo: () => api('/auth/yo'),
};

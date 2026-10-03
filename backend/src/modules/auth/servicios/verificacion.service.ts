import type { Mailer } from '../../../shared/email/mailer.js';
import { tiendasRepo } from '../../tiendas/tiendas.repository.js';
import { codigoInvalido } from '../errores.js';
import { usuariosRepo } from '../repositorios/usuarios.repository.js';
import { emitirCodigo, verificarCodigo } from './codigosEmail.service.js';

const DIAS_PRUEBA = 10;

// Verifica el email y arranca los 10 días de prueba de su tienda.
export async function verificarEmail(email: string, codigo: string): Promise<void> {
  const usuario = await usuariosRepo.buscarPorEmail(email);
  if (!usuario || usuario.emailVerificadoEn) throw codigoInvalido();
  if (!(await verificarCodigo(usuario.id, 'verificar_email', codigo)))
    throw codigoInvalido();

  await usuariosRepo.marcarEmailVerificado(usuario.id);
  const hasta = new Date(Date.now() + DIAS_PRUEBA * 24 * 60 * 60 * 1000);
  await tiendasRepo.iniciarPruebasDeDueno(usuario.id, hasta);
}

// Siempre responde lo mismo; solo manda el email si corresponde.
export async function reenviarVerificacion(email: string, mailer: Mailer): Promise<void> {
  const usuario = await usuariosRepo.buscarPorEmail(email);
  if (usuario && !usuario.emailVerificadoEn)
    await emitirCodigo(mailer, usuario, 'verificar_email');
}

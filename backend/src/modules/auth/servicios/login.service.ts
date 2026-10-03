import { verificarClave } from '../../../shared/crypto/claves.js';
import type { EstadoSesion, TipoSesion } from '../../../shared/db/tipos/usuarios.js';
import { AppError } from '../../../shared/errors/AppError.js';
import type { Zona } from '../../../shared/utils/zonaDesdeOrigen.js';
import { miembrosRepo } from '../../tiendas/miembros.repository.js';
import { tiendasRepo } from '../../tiendas/tiendas.repository.js';
import { credencialesInvalidas } from '../errores.js';
import { usuariosRepo } from '../repositorios/usuarios.repository.js';

type Resultado = { usuarioId: number; tipo: TipoSesion; estado: EstadoSesion };

async function puedeEntrarA(zona: Zona, usuario: { id: number; esAdmin: boolean }) {
  if (zona.tipo === 'admin') return usuario.esAdmin;
  if (zona.tipo !== 'tienda') return false;
  const tienda = await tiendasRepo.buscarPorSlug(zona.slug);
  return tienda !== undefined && (await miembrosRepo.esMiembro(tienda.id, usuario.id));
}

// Primer paso del login (email + clave). El segundo es siempre el TOTP.
export async function autenticar(
  email: string,
  clave: string,
  zona: Zona | null,
): Promise<Resultado> {
  if (!zona || zona.tipo === 'sitio') {
    throw new AppError(400, 'zona_invalida', 'Iniciá sesión desde tu tienda.');
  }
  const usuario = await usuariosRepo.buscarPorEmail(email);
  const claveOk = await verificarClave(usuario?.hashClave, clave);
  // Mismo error si no existe, la clave es incorrecta o no es de esta tienda.
  if (!usuario || !claveOk || !usuario.activo || !(await puedeEntrarA(zona, usuario))) {
    throw credencialesInvalidas();
  }
  if (!usuario.emailVerificadoEn) {
    throw new AppError(403, 'email_sin_verificar', 'Verificá tu email antes de entrar.');
  }
  return {
    usuarioId: usuario.id,
    tipo: zona.tipo === 'admin' ? 'admin' : 'panel',
    estado: usuario.totpActivadoEn ? 'falta_totp' : 'falta_configurar_totp',
  };
}

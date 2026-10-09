import { verificarClave } from '../../../shared/crypto/claves.js';
import type { TipoSesion } from '../../../shared/db/tipos/usuarios.js';
import { AppError } from '../../../shared/errors/AppError.js';
import type { Zona } from '../../../shared/utils/zonaDesdeOrigen.js';
import { miembrosRepo } from '../../tiendas/miembros.repository.js';
import { tiendasRepo } from '../../tiendas/tiendas.repository.js';
import { credencialesInvalidas } from '../errores.js';
import { usuariosRepo } from '../repositorios/usuarios.repository.js';

type Resultado = { usuarioId: number; tipo: TipoSesion };

async function puedeEntrarA(zona: Zona, usuario: { id: number; esAdmin: boolean }) {
  if (zona.tipo === 'admin') return usuario.esAdmin;
  // Desde la landing entra el admin o quien tenga al menos una tienda.
  if (zona.tipo === 'sitio') {
    return (
      usuario.esAdmin || (await miembrosRepo.tiendasDeUsuario(usuario.id)).length > 0
    );
  }
  if (zona.tipo !== 'tienda') return false;
  const tienda = await tiendasRepo.buscarPorSlug(zona.slug);
  return tienda !== undefined && (await miembrosRepo.esMiembro(tienda.id, usuario.id));
}

// Login con email y contraseña, desde la landing, la tienda o el admin. Desde la
// landing, el admin recibe su sesión de admin (cookie aparte) y el resto la del panel.
export async function autenticar(
  email: string,
  clave: string,
  zona: Zona | null,
): Promise<Resultado> {
  if (!zona) throw new AppError(400, 'zona_invalida', 'Iniciá sesión desde Mostry.');
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
    tipo:
      zona.tipo === 'admin' || (zona.tipo === 'sitio' && usuario.esAdmin)
        ? 'admin'
        : 'panel',
  };
}

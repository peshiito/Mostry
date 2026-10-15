import { hashearClave, verificarClave } from '../../../shared/crypto/claves.js';
import { esDuplicado } from '../../../shared/db/esDuplicado.js';
import { enviarSinFallar } from '../../../shared/email/enviarSinFallar.js';
import type { Mailer } from '../../../shared/email/mailer.js';
import { codigoInvalido } from '../../auth/errores.js';
import { clientesRepo } from './clientes.repository.js';
import { emitirCodigoClub, verificarCodigoClub } from './codigosEmail.service.js';
import { plantillasClub } from './plantillas.js';
import type { DatosRegistroClub } from './schemas.js';

// Crea la cuenta del cliente y manda el código. Si el email ya está verificado,
// responde igual y avisa por mail (no revela qué emails tienen cuenta). Si existe
// sin verificar, valen los datos nuevos: quien tenga el mail decide la clave.
export async function registrarCliente(datos: DatosRegistroClub, mailer: Mailer) {
  // Se hashea siempre, antes de decidir: tarda lo mismo exista o no el email.
  const perfil = {
    hashClave: await hashearClave(datos.clave),
    nombre: datos.nombre,
    whatsapp: datos.whatsapp,
    direccion: datos.direccion || null,
  };
  const yaTenesCuenta = () =>
    enviarSinFallar(mailer, { para: datos.email, ...plantillasClub.yaTenesCuenta() });
  const existente = await clientesRepo.buscarPorEmail(datos.email);
  if (existente?.emailVerificadoEn) return yaTenesCuenta();
  if (existente) {
    await clientesRepo.pisarSinVerificar(existente.id, perfil);
    return emitirCodigoClub(mailer, existente, 'verificar_email');
  }

  let id: number;
  try {
    id = await clientesRepo.crear({ email: datos.email, ...perfil });
  } catch (err) {
    // Carrera: otro registro con el mismo email ganó entre el chequeo y el INSERT.
    if (esDuplicado(err, 'uq_clientes_email')) return yaTenesCuenta();
    throw err;
  }
  await emitirCodigoClub(mailer, { id, email: datos.email }, 'verificar_email');
}

export async function verificarEmailCliente(
  email: string,
  codigo: string,
  clave: string,
) {
  const cliente = await clientesRepo.buscarPorEmail(email);
  const claveOk = await verificarClave(cliente?.hashClave, clave);
  if (!cliente || cliente.emailVerificadoEn || !claveOk) throw codigoInvalido();
  if (!(await verificarCodigoClub(cliente.id, 'verificar_email', codigo)))
    throw codigoInvalido();
  await clientesRepo.marcarEmailVerificado(cliente.id);
  return cliente.id;
}

// Siempre responde lo mismo; solo manda el mail si corresponde.
export async function reenviarVerificacionCliente(email: string, mailer: Mailer) {
  const cliente = await clientesRepo.buscarPorEmail(email);
  if (cliente && !cliente.emailVerificadoEn)
    await emitirCodigoClub(mailer, cliente, 'verificar_email');
}

import { z } from 'zod';
import { hashearClave } from '../../../shared/crypto/claves.js';
import { db } from '../../../shared/db/db.js';
import { AppError } from '../../../shared/errors/AppError.js';

// Mismas reglas que el registro: email válido y contraseña de 10 a 128 caracteres.
const esquema = z.strictObject({
  email: z.string().trim().toLowerCase().max(254).pipe(z.email('Email inválido')),
  nombre: z.string().trim().min(2).max(100),
  clave: z
    .string()
    .min(10, 'La contraseña tiene que tener al menos 10 caracteres')
    .max(128),
});

// Crea la cuenta de administrador de Mostry (en producción no hay seed). Si el
// email ya existe, no lo toca: así nunca se convierte en admin a un comerciante.
export async function crearAdmin(datos: {
  email: string;
  nombre: string;
  clave: string;
}) {
  const { email, nombre, clave } = esquema.parse(datos);
  const existe = await db
    .selectFrom('usuarios')
    .select('id')
    .where('email', '=', email)
    .executeTakeFirst();
  if (existe)
    throw new AppError(409, 'email_en_uso', `Ya existe una cuenta con ${email}.`);
  const hashClave = await hashearClave(clave);
  await db
    .insertInto('usuarios')
    .values({ email, nombre, hashClave, esAdmin: true, emailVerificadoEn: new Date() })
    .execute();
  return email;
}

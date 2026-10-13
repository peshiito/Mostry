import { describe, expect, it } from 'vitest';
import { textoError } from './textos.js';
import { tipoError } from './tipoError.js';

const err = (status, codigo) => ({ status, codigo });

describe('tipoError', () => {
  it('sin error no hay tipo', () => {
    expect(tipoError(null)).toBeNull();
  });
  it.each([
    [err(0, 'sin_conexion'), 'sin_conexion'],
    [err(401, 'sin_sesion'), 'sesion'],
    [err(403, 'tienda_suspendida'), 'permiso'],
    [err(404, 'no_encontrado'), 'no_existe'],
    [err(429, 'demasiados_intentos'), 'limite'],
    [err(502), 'mantenimiento'],
    [err(503), 'mantenimiento'],
    [err(500, 'error_interno'), 'servidor'],
    [err(409, 'conflicto'), 'desconocido'],
  ])('%o → %s', (error, tipo) => {
    expect(tipoError(error)).toBe(tipo);
  });
  it('todo tipo tiene texto, y uno desconocido cae en el genérico', () => {
    expect(textoError('servidor').titulo).toMatch(/nuestro lado/);
    expect(textoError('raro')).toBe(textoError('desconocido'));
  });
});

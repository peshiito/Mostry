import type { Auto, Creado, Timestamps } from './comunes.js';

export type TipoSesion = 'panel' | 'admin';

export type UsuariosTabla = Timestamps & {
  id: Auto<number>;
  email: string;
  hashClave: string;
  nombre: string;
  esAdmin: Auto<boolean>;
  emailVerificadoEn: Date | null;
  activo: Auto<boolean>;
};

export type CodigosEmailTabla = Creado & {
  id: Auto<number>;
  usuarioId: number;
  proposito: 'verificar_email' | 'recuperar_clave' | 'confirmar_accion';
  hashCodigo: string;
  intentos: Auto<number>;
  expiraEn: Date;
  usadoEn: Date | null;
};

export type SesionesTabla = Creado & {
  id: Auto<number>;
  usuarioId: number;
  tipo: TipoSesion;
  hashToken: string;
  expiraEn: Date;
  ip: string | null;
  userAgent: string | null;
  ultimoUsoEn: Auto<Date>;
};

import type { Auto, Creado, Timestamps } from './comunes.js';

// Club Mostry (0043): cuentas de cliente, separadas de los usuarios del panel.
export type ClientesTabla = Timestamps & {
  id: Auto<number>;
  email: string;
  hashClave: string;
  nombre: string;
  whatsapp: string;
  direccion: string | null;
  emailVerificadoEn: Date | null;
  aceptoTerminosEn: Date;
  activo: Auto<boolean>;
};

export type SesionesClubTabla = Creado & {
  id: Auto<number>;
  clienteId: number;
  hashToken: string;
  expiraEn: Date;
  ip: string | null;
  userAgent: string | null;
  ultimoUsoEn: Auto<Date>;
};

export type CodigosEmailClubTabla = Creado & {
  id: Auto<number>;
  clienteId: number;
  proposito: 'verificar_email' | 'recuperar_clave';
  hashCodigo: string;
  intentos: Auto<number>;
  expiraEn: Date;
  usadoEn: Date | null;
};

export type CodigosClubTabla = Creado & {
  id: Auto<number>;
  clienteId: number;
  hashCodigo: string;
  expiraEn: Date;
};

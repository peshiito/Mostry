import type { Auto, Creado } from './comunes.js';

export type ArchivosPorBorrarTabla = Creado & {
  id: Auto<number>;
  bucket: Auto<'publico' | 'privado'>;
  clave: string;
  intentos: Auto<number>;
  reintentarEn: Auto<Date>;
  ultimoError: string | null;
};

export type AvisosSuscripcionTabla = {
  id: Auto<number>;
  tiendaId: number;
  tipo: 'prueba_3_dias' | 'prueba_1_dia' | 'gracia' | 'suspendida';
  vence: Date;
  enviadoEn: Auto<Date>;
};

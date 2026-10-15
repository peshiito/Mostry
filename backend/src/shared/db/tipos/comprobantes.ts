import type { Auto, Creado, DeTienda } from './comunes.js';

export type ComprobantesTabla = DeTienda &
  Creado & {
    pedidoId: number;
    tipo: 'pago' | 'sena';
    archivoClave: string | null;
    archivoTipo: 'jpg' | 'png' | 'pdf';
    estado: Auto<'pendiente' | 'aprobado' | 'rechazado'>;
    monto: number | null;
    fechaOperacion: Date | null;
    titular: string | null;
    numeroOperacion: string | null;
    motivoRechazo: string | null;
    revisadoPor: number | null;
    aprobadoEn: Date | null;
    rechazadoEn: Date | null;
    archivoBorrarEn: Date | null;
    archivoBorradoEn: Date | null;
  };

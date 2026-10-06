import type { EstadoTienda } from '../../shared/db/tipos/tiendas.js';
import type { AvisosSuscripcionTabla } from '../../shared/db/tipos/archivos.js';
import { formatearPlata } from '../../shared/utils/plata.js';

export type TipoAviso = AvisosSuscripcionTabla['tipo'];

// Qué aviso le toca a una tienda (sección 6.5: días 7 y 9 de la prueba, y al
// entrar en gracia o quedar suspendida). Por rangos de horas y no por días
// exactos: si un día el job no corrió, el aviso sale igual al siguiente (la
// tabla avisos_suscripcion evita duplicados).
export function avisoQueCorresponde(
  estado: EstadoTienda,
  horasRestantes: number | null,
): TipoAviso | null {
  if (estado === 'prueba' && horasRestantes !== null && horasRestantes <= 24)
    return 'prueba_1_dia';
  if (estado === 'prueba' && horasRestantes !== null && horasRestantes <= 72)
    return 'prueba_3_dias';
  if (estado === 'gracia') return 'gracia';
  if (estado === 'suspendida') return 'suspendida';
  return null;
}

const firma = '\n\n— El equipo de Mostry';

export function textoAviso(
  tipo: TipoAviso,
  tienda: string,
  pago: { alias: string; titular: string; monto: number },
) {
  const comoPagar = `Para seguir, transferí ${formatearPlata(pago.monto)} al alias ${pago.alias} (${pago.titular}) y avisanos.`;
  const textos: Record<TipoAviso, { asunto: string; texto: string }> = {
    prueba_3_dias: {
      asunto: `Quedan 3 días de prueba de ${tienda}`,
      texto: `Tu prueba gratis termina en 3 días.\n${comoPagar}`,
    },
    prueba_1_dia: {
      asunto: `Mañana termina la prueba de ${tienda}`,
      texto: `Tu prueba gratis termina mañana.\n${comoPagar}`,
    },
    gracia: {
      asunto: `${tienda}: tenés 3 días para pagar`,
      texto: `Tu plan venció. La tienda sigue funcionando 3 días más.\n${comoPagar}`,
    },
    suspendida: {
      asunto: `${tienda} quedó suspendida`,
      texto: `Tu tienda quedó cerrada temporalmente. No se borró ningún dato.\n${comoPagar}`,
    },
  };
  return { asunto: textos[tipo].asunto, texto: textos[tipo].texto + firma };
}

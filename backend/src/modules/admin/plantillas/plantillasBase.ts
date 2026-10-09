// Plantillas de WhatsApp para escribirle a cada comercio. El admin las edita
// desde el dashboard; si nunca las tocó, se usan estos textos.
// Variables (las completa el dashboard): {dueno} {tienda} {vence} {dias}
// {precio} {alias} {titular} {link}.
const SALUDO = 'Hola {dueno}, ¿cómo estás? Soy Pedro Báez, creador de Mostry.';

export const PLANTILLAS_BASE = {
  vence_prueba: {
    titulo: 'Vence la prueba gratis',
    texto: `${SALUDO} Te escribo porque la prueba gratis de {tienda} vence el {vence} ({dias}). Para seguir usando Mostry, transferí {precio} al alias {alias} (a nombre de {titular}) y avisame por acá. ¡Cualquier duda te ayudo!`,
  },
  vence_plan: {
    titulo: 'Vence el plan',
    texto: `${SALUDO} Te aviso que el plan de {tienda} vence el {vence} ({dias}). Para renovarlo, transferí {precio} al alias {alias} (a nombre de {titular}) y mandame el comprobante por acá. ¡Gracias por confiar en Mostry!`,
  },
  encuesta: {
    titulo: 'Encuesta: ¿cómo te va?',
    texto: `${SALUDO} Te escribo para saber cómo te está yendo con {tienda}. ¿Te resulta fácil de usar? ¿Hay algo que te gustaría que mejoremos o agreguemos? Tu opinión me ayuda un montón. ¡Gracias!`,
  },
  personalizado: {
    titulo: 'Mensaje personalizado',
    texto: `${SALUDO} Te escribo por el siguiente motivo: `,
  },
} as const;

export type ClavePlantilla = keyof typeof PLANTILLAS_BASE;
export const CLAVES_PLANTILLA = Object.keys(PLANTILLAS_BASE) as [
  ClavePlantilla,
  ...ClavePlantilla[],
];

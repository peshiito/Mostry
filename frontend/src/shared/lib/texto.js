// "1 producto" / "3 productos".
export const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

// El WhatsApp guardado ("5491155551234") como lo escribe la gente, con código
// de área y sin el 549: "1155551234" (el área puede ser de 2 a 4 cifras, así
// que no se adivinan espacios). Si no tiene esa forma, queda como vino.
export function whatsappLocal(n) {
  const m = /^549(\d{10})$/.exec(n ?? '');
  return m ? m[1] : (n ?? '');
}

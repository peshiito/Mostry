// Normaliza un celular argentino al formato de wa.me: 549 + área + número.
// Acepta "11 2345-6789", "011 2345 6789", "+54 9 11 2345-6789", "54 11 2345 6789".
export function normalizarWhatsapp(entrada: string): string | null {
  let digitos = entrada.replace(/\D/g, '');
  if (digitos.startsWith('549') && digitos.length === 13) return digitos;
  if (digitos.startsWith('54') && digitos.length === 12) return `549${digitos.slice(2)}`;
  if (digitos.startsWith('0')) digitos = digitos.slice(1);
  // Área + número siempre suman 10 dígitos, y ningún código de área empieza con 15.
  if (digitos.startsWith('15')) return null;
  return digitos.length === 10 ? `549${digitos}` : null;
}

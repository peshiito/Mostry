// Mails del Club Mostry. Cortos, en voseo y sin links (evita phishing).
const firma = '\n\n— Club Mostry';

export const plantillasClub = {
  verificarEmail: (codigo: string) => ({
    asunto: `${codigo} es tu código del Club Mostry`,
    texto: `¡Hola! Tu código para verificar tu email es ${codigo}.\nVence en 10 minutos.\n\nSi no te sumaste al Club Mostry, ignorá este mensaje.${firma}`,
  }),
  recuperarClave: (codigo: string) => ({
    asunto: `${codigo} es tu código para recuperar tu clave del Club`,
    texto: `Tu código es ${codigo}.\nVence en 10 minutos.\n\nSi no lo pediste vos, ignorá este mensaje: tu cuenta sigue segura.${firma}`,
  }),
  yaTenesCuenta: () => ({
    asunto: 'Ya tenés una cuenta en el Club Mostry',
    texto: `Alguien intentó sumarse al Club con este email, pero ya tenés una cuenta.\nSi fuiste vos, ingresá o recuperá tu clave.${firma}`,
  }),
  claveCambiada: () => ({
    asunto: 'Cambiaste tu clave del Club Mostry',
    texto: `Tu clave se cambió y cerramos tus sesiones.\nSi no fuiste vos, escribinos ya mismo.${firma}`,
  }),
  cuentaBorrada: () => ({
    asunto: 'Borraste tu cuenta del Club Mostry',
    texto: `Tu cuenta y tus datos se borraron. Si querés volver, te podés sumar de nuevo cuando quieras.${firma}`,
  }),
};

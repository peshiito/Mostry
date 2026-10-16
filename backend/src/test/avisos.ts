// Encargos y pedidos avisan al teléfono (Avisos 1): una suscripción como la que
// arma el navegador con pushManager.subscribe().
export const suscripcion = (n = 1, host = 'fcm.googleapis.com') => ({
  endpoint: `https://${host}/fcm/send/telefono-${n}`,
  keys: { p256dh: `B${'x'.repeat(86)}`, auth: 'a'.repeat(22) },
  dispositivo: 'Android · Chrome',
});

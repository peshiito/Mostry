import webpush from 'web-push';

// Genera las claves VAPID de los avisos push (una sola vez por entorno: si se
// cambian, los teléfonos suscriptos dejan de recibir avisos). Se pegan en el .env.
const { publicKey, privateKey } = webpush.generateVAPIDKeys();
process.stdout.write(`VAPID_PUBLICA=${publicKey}\nVAPID_PRIVADA=${privateKey}\n`);

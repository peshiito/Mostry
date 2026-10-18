# Mostry en producción — guía

Esta guía es para la **Etapa 16**. Acá está todo lo necesario para publicar Mostry; lo que tenés que hacer vos está marcado con 👤. Mientras tanto, la misma versión se puede probar entera en tu máquina (ver *Probar producción en local*).

## Cómo queda armado

```
                 Cloudflare (DNS, SSL, *.mostry.com.ar)
                         │
   mostry.com.ar ────────┼──── web      (frontend: sitio, tiendas, panel, admin)
   *.mostry.com.ar ──────┤
   admin.mostry.com.ar ──┘
   api.mostry.com.ar ───────── api      (Express)  ──┐
                               worker   (tareas)  ──┼── MySQL 8.4
                                                    └── Cloudflare R2 (fotos, comprobantes, backups)
                                                        Resend (mails)
```

- **Imágenes** (`docker-compose.prod.yml`):
  - `api`: `backend/Dockerfile`, destino `api`;
  - `worker`: `backend/Dockerfile`, destino `worker`, que trae `mysqldump` para los backups;
  - `web`: `frontend/Dockerfile`, con el servidor estático propio y la CSP;
  - `mysql`.
- **Producción Etapa 0:** Railway, con un servicio por imagen y su plugin de MySQL.
- **Producción Etapa 1:** un VPS con Coolify y el mismo compose.

## Variables

La plantilla con cada variable explicada está en [`.env.produccion.example`](../.env.produccion.example). Las reglas que exige la API (si no se cumplen, no arranca):

- `ORIGEN_PROTOCOLO=https`.
- `TRUST_PROXY` mayor a 0. Es la **cantidad de proxies** entre internet y la API; si está mal, el límite de intentos por IP o bloquea a todos juntos o se puede esquivar:

  | Armado | `TRUST_PROXY` |
  |---|---|
  | Cloudflare → Railway → API | `2` |
  | Cloudflare → Caddy o nginx (VM de Oracle o VPS) → API | `2` |
  | Solo Caddy, sin Cloudflare (la prueba en local) | `1` |

  **Cómo confirmarlo en staging:** cada request queda en el log con `ip` (la IP real que ve la API). Entrá desde tu celular con datos móviles y fijate que el `ip` del log sea la de tu celular (buscá "cuál es mi IP"), no una de Cloudflare (`104.x`, `172.64–71.x`) ni una interna. Si ves la de Cloudflare, subí `TRUST_PROXY` en 1; si ves una inventada, bajalo.
  No usamos el encabezado `CF-Connecting-IP`: solo sería confiable si el servidor aceptara tráfico exclusivamente de Cloudflare.
- `BACKUP_ENTORNO` definida: `produccion` o `staging`, así nunca comparten carpeta de backups.
- `SECRETO_HMAC` de 32 caracteres o más. Generala con `openssl rand -base64 48`.
- **Sin `SEED_CLAVE`**: en producción el seed no corre.
- `VAPID_PUBLICA`, `VAPID_PRIVADA` y `VAPID_CONTACTO` (avisos push): generalas una sola vez con `cd backend; and npm run avisos:claves`. **No las cambies después**: los teléfonos ya suscriptos dejarían de recibir avisos.

**Las claves reales se cargan en el panel de Railway (Variables), nunca en un archivo del repo.**

## Pasos para publicar

1. 👤 **Dominio:** registrar `mostry.com.ar` en NIC.ar y delegar los DNS a Cloudflare.
2. 👤 **Cloudflare** (S3):
   - **SSL/TLS → Overview:** modo **Full (strict)** (nunca "Flexible": entre Cloudflare y el servidor viajaría sin cifrar);
   - **SSL/TLS → Edge Certificates:** **Always Use HTTPS** activado, **Minimum TLS Version 1.2** y **Automatic HTTPS Rewrites** activado;
   - **HSTS de Cloudflare: apagado.** Lo mandan la API y el frontend (1 año con subdominios, sin preload); así no se duplica. El preload se pide después del piloto;
   - registros `mostry.com.ar`, `*.mostry.com.ar`, `admin` y `api` apuntando al hosting, con la nube naranja (proxy) prendida.
   - El frontend además redirige solo a https si algo llega por http (`frontend/servidor/seguridad.js`). Para eso el servicio `web` necesita `DOMINIO_BASE`.
3. 👤 **R2:**
   - crear los buckets `mostry-publico` (con dominio público `archivos.mostry.com.ar`), `mostry-privado` (**sin** acceso público) y `mostry-backups` (privado);
   - crear un token de API con permiso de lectura y escritura sobre los tres.
   - No hace falta configurar CORS: el navegador solo lee fotos con `<img>` y los comprobantes con URLs firmadas; las subidas pasan por la API.
4. 👤 **Resend:** verificar el dominio (registros DNS en Cloudflare) y crear la API key de SMTP.
5. 👤 **Railway:**
   - crear el proyecto con MySQL y tres servicios (`api`, `worker`, `web`) desde el repo;
   - cargar las variables de `.env.produccion.example`.
   - En `web` las `VITE_*` van como variables de **build**.
6. **Migraciones:** en la consola del servicio `api` correr `npm run db:migrar:prod`.
   Una sola vez, en la consola de MySQL como root, darle al usuario permiso sobre la base de la prueba mensual de restauración: ``GRANT ALL PRIVILEGES ON `mostry_restore_prueba`.* TO 'mostry'@'%';``. Con `docker-compose.prod.yml` lo hace solo el script `docker/mysql/init-prod`.
7. **Admin:** en la misma consola correr `npm run admin:crear:prod -- tu@email.com "Pedro Báez"`. Pide la contraseña sin mostrarla; sin teclado, se pasa por la variable `ADMIN_CLAVE`.
8. **Probar en staging** (mismo armado, `BACKUP_ENTORNO=staging`) y recién después en producción.

## Checklist antes de abrir

- [ ] `https://api.mostry.com.ar/health` responde 200.
- [ ] `http://mostry.com.ar` redirige a `https://` y las respuestas traen `Strict-Transport-Security: max-age=31536000; includeSubDomains` (API y frontend).
- [ ] El `ip` del log de la API es tu IP real (ver `TRUST_PROXY` arriba).
- [ ] Las respuestas del frontend traen la **CSP** con `script-src 'self' 'sha256-…'`, `X-Frame-Options: DENY` y `nosniff`. Lo hace `frontend/servidor/servir.js` con `encabezados.config.js`.
- [ ] `VITE_ORIGEN_ARCHIVOS` es el dominio público de R2. Si no, la CSP bloquea las fotos.
- [ ] El registro con verificación por mail anda (llega el código desde Resend).
- [ ] La tienda de prueba compra y el panel aprueba el comprobante (la URL firmada abre).
- [ ] El worker corrió `backup`, y en `mostry-backups/backups/produccion/` hay un `.sql.gz` del día.
- [ ] La PWA del panel se puede instalar y se ve la franja "Sin conexión" al cortar internet.
- [ ] Rotaste las claves que alguna vez anduvieron fuera de un `.env` (por ejemplo la de Resend).
- [ ] El repo de GitHub es **privado**.

## Backups

- **Automáticos:** todos los días a las 04:00 el worker sube `backups/<BACKUP_ENTORNO>/<fecha>.sql.gz` a R2.
  - Se conservan los últimos 14 días y el del día 1 de los últimos 6 meses.
  - El día 1 de cada mes a las 05:00, el worker prueba que el último backup se restaure bien.
- **Bajar uno a tu máquina:**
  1. descargalo de R2 a `Mostry-Backup/base/`;
  2. restauralo con `npm run restaurar -- <archivo>`, que lo deja en `mostry_restaurada` sin tocar tu base de trabajo.
- **Local:** `npm run backup` deja la base y los archivos en `../Mostry-Backup`.
- **Primer backup real (S4), antes de abrir:**
  1. correr el backup a mano en la consola del `worker`: `node dist/worker/cli/correrTarea.js backup` (o esperar a las 04:00);
  2. verificar que esté el `.sql.gz` del día en `mostry-backups/backups/<entorno>/`;
  3. correr la prueba de restauración a mano: `node dist/worker/cli/correrTarea.js probar-restauracion` (restaura en `mostry_restore_prueba` y compara);
  4. bajarlo una vez a tu máquina y restaurarlo con `npm run restaurar`, para saber hacerlo antes de necesitarlo.
- **Seguridad de los backups:** tienen datos personales de todas las tiendas.
  - el bucket `mostry-backups` **sin acceso público** y sin dominio;
  - el token de R2 solo lo tienen el worker y vos (en Railway y en tu gestor de contraseñas);
  - las copias que bajes a tu máquina quedan en `Mostry-Backup/`, nunca en el repo ni en la nube personal.

## Volver atrás (si algo sale mal)

- **Código:** en Railway, *Deployments → Redeploy* del deploy anterior, o desplegar el tag anterior (`v1.0.0`).
- **Base:** las migraciones tienen `down`. Para deshacer la última, `node dist/db/cli/migrar.js bajar` (nunca `bajar-todo`, que está prohibido en producción).
- **Datos:** restaurar el último backup en una base nueva, revisarlo y recién ahí apuntar la API a esa base.

## Probar producción en local

Es la misma receta, con https propio (Caddy hace de Cloudflare), RustFS en lugar de R2 y Mailpit en lugar de Resend:

```fish
docker compose up -d                                   # servicios de desarrollo
cp .env.prueba-prod.example .env.prueba-prod           # completá S3_ACCESS_KEY y S3_SECRET_KEY con los de tu .env
docker compose -f docker-compose.prod.yml -f docker-compose.prueba-prod.yml --env-file .env.prueba-prod up -d --build
docker compose -f docker-compose.prod.yml -f docker-compose.prueba-prod.yml --env-file .env.prueba-prod exec api npm run db:migrar:prod
docker compose -f docker-compose.prod.yml -f docker-compose.prueba-prod.yml --env-file .env.prueba-prod exec api npm run admin:crear:prod -- vos@mail.com "Tu Nombre"
```

Abrí **https://mostry.localhost**. El navegador avisa una vez por el certificado local.

- **Límites conocidos de esta prueba** (en producción no pasan):
  - el comprobante que se abre con URL firmada apunta a la red interna de Docker y no se ve desde el navegador;
  - Chrome no registra el service worker con un certificado local, así que la app no se instala. La PWA está probada en `e2e/pruebas/pwa.spec.js`.
- **Para bajarla:** el mismo comando terminado en `down`. Agregá `-v` para borrar también su base.

# Plan de salida de Mostry

Armado con Pedro el 2026-10-16. **Estado:** las funciones están completas para salir (no se suman funciones nuevas hasta el piloto). Lo que falta es preparar, publicar y probar con comercios reales. Cada etapa arranca en modo plan y termina con reporte, como siempre.

**Orden:** S1 → S2 → S3 → S4 → S5 → S6. S4 (producción) y S5 (piloto) van casi juntas: primero se publica y enseguida entra el primer comercio.

---

## S1 · Pre-salida: higiene y decisiones pendientes · HECHA (2026-10-16)
**Quedó afuera, por decisión de Pedro:** rotar las claves y pasar el repo a privado. Se hacen antes de la S4.

- **Rotar las claves que quedaron expuestas:** Resend (antes de producción) y ElevenLabs (quedó escrita en el chat).
- **Repo privado:** pasar `peshiito/mostry` a privado en GitHub (lo hace Pedro).
- **Prueba gratis de 7 días.** Decisión de Pedro: 10 días es mucho. Se cambia en el código, los avisos de los días 7 y 9, los textos de la landing y `CLAUDE.md` §6.5.
- **Días de cortesía** (pedido de Pedro).
  - **Qué es:** el admin le regala días a una tienda. Ejemplo: "esta semana tuviste problemas con Mostry; te regalo esa semana".
  - **Cómo funciona:**
    - suma N días a `plan_hasta` (o a `prueba_hasta` si está en prueba), desde la fecha que tenga;
    - el motivo es obligatorio y queda en `registro_admin`;
    - el comercio lo ve en Suscripción ("+7 días de cortesía").
- **Cancelar solos los pedidos gratis del Club que nadie confirmó** (explicado abajo).
- **Club:** confirmar que funciona como lo pensó Pedro (explicado abajo) y que la landing lo presente como una función de cada negocio, gratis dentro de Mostry.

## S2 · Legal y confianza · HECHA (2026-10-16), salvo la factura C
**La facturación queda para charlarla aparte** (decisión de Pedro).

- **Términos y condiciones** para el comercio: qué es Mostry, el precio, la prueba, la suspensión por falta de pago, qué pasa con los datos al darse de baja, y los límites de responsabilidad.
- **Política de privacidad** (Ley 25.326), escrita en lenguaje claro.
  - Qué datos guardamos: del comercio, de sus compradores y de los clientes del Club.
  - Para qué los usamos, dónde están guardados, cuánto tiempo, y cómo se piden o se borran.
  - **Qué acceso tiene Mostry a los datos, dicho con honestidad:** el panel de admin solo ve la suscripción y las fechas, nunca ventas, caja ni clientes. Como dueños del servidor, técnicamente podemos entrar a la base, y eso se hace solo para mantenimiento o soporte, con el permiso del comercio (el modo soporte, que queda registrado).
- **Cookies:** Mostry usa **solo cookies necesarias** (la sesión y el tema claro u oscuro), sin publicidad ni seguimiento. No hace falta un banner de consentimiento; va una sección de cookies en la política de privacidad.
- **Facturación de Mostry** (explicado abajo).
  - Por cada pago, Pedro emite su factura C de monotributista.
  - El admin anota el número de factura al registrar el pago y puede adjuntar el PDF.
  - El comercio la ve y la descarga en Suscripción.
- **Dónde va todo esto:**
  - en las páginas `/terminos` y `/privacidad` del sitio;
  - en un check "Acepto los términos" al registrarse (quedan guardados la fecha y la versión aceptada);
  - en links desde el pie y desde el Club.

## S3 · Seguridad de salida
- **HTTPS forzado:**
  - en Cloudflare, "Always Use HTTPS" y SSL "Full (strict)";
  - **HSTS**, con helmet y Cloudflare.
- **Repaso final** con `/security-review`, Semgrep, `npm audit` y gitleaks sobre `main`.
- **Límites de abuso en producción:** confirmar los rate limits detrás de Cloudflare (`TRUST_PROXY`).
- **Backups:** primer backup real y una prueba de restauración en el entorno nuevo.

## S4 · Producción (la Etapa 16 de siempre)
- **Hosting gratis o casi gratis**, como decidió Pedro: quedarse en lo gratuito mientras alcance. Cuando haya 3 o 4 comercios pagando, se pasa el backend y la base a un VPS. Se decide al empezar la etapa:
  - **Frontend:** Cloudflare Pages, gratis.
  - **Archivos:** Cloudflare R2, gratis hasta 10 GB.
  - **Backend, worker y base:** Railway ya no es gratis (unos 5 USD por mes). La alternativa gratis es una VM "Always Free" de Oracle Cloud, con Docker, la base y backups a R2. Pedro elige.
- **Mails en producción (Resend):**
  - verificar el dominio `mostry.com.ar` en Resend con los registros DNS en Cloudflare (SPF y DKIM); recién ahí se puede mandar a cualquier dirección;
  - el plan gratis alcanza de sobra para el piloto (cerca de 3.000 mails por mes y 100 por día; confirmarlo en su página al hacerlo);
  - remitente `Mostry <hola@mostry.com.ar>`.
- **Pasos:** dominio en NIC.ar → Cloudflare → **staging** → probar todo → **producción**.
- **Probar en teléfonos reales** (recién con https): instalar la PWA en Android e iPhone, los avisos push, la cámara del QR del Club y una Mac con Safari.
- **Monitoreo:** Sentry (gratis) y Uptime Kuma o el monitor gratis de Cloudflare.

## S5 · Piloto con comercios reales
- **Primer comercio: el negocio de la familia de Pedro (bebidas).**
  - **Qué vende:** Manaos y Placer (4 gustos), soda, vino, Coca retornable y cigarrillos (Lucky, Philip Morris, Red Point).
  - **Su problema:** anotan la inversión, pero no saben cuánto ganan de verdad.
  - **Lo que ya le sirve de Mostry:**
    - la venta en el mostrador, que va a la caja;
    - el stock por unidades, con aviso de stock bajo;
    - Gastos (tipo "inversión") para cada boleta de compra;
    - **ganancia real = ingresos − gastos del período** en el resumen de caja.
  - **A observar:** si la ganancia se entiende, y si les sirve ver la ganancia por compra ("esta boleta de $ 100.000 ya se cubrió").
- **Después, 2 o 3 comercios conocidos más** (por ejemplo, una panadería para probar encargos y el Club).
- **Ayudar en persona** la primera vez: instalar el panel en el celular, activar los avisos y cargar los primeros productos.
- **Anotar todo lo que no se entienda:** eso define las mejoras después de la salida.

## S6 · Lanzamiento
- **Video:** el video "Dos panaderías" como publicidad de la salida, con la voz regenerada con licencia comercial de ElevenLabs (un mes de Starter).
- **Guía corta para el comercio:** "Empezá en 10 minutos", con texto y capturas, más algún video corto.
- **Publicación** en Instagram y en la landing (con el texto de `publicacion.md`).

---

## Explicaciones que pidió Pedro

### Pedidos gratis del Club que nadie confirma
El caso es un pedido online que un premio del Club deja en $ 0:
- **Qué pasa:** un cliente del Club compra por la tienda online y canjea un premio que le cubre todo, por ejemplo "una docena de medialunas gratis". Como no hay nada que pagar, el pedido no pasa por "subir comprobante": queda **esperando que el comercio lo confirme**.
- **El problema:** mientras espera, esas medialunas quedan **reservadas** en el stock. Si el comercio no lo ve y nunca lo confirma ni lo cancela, el pedido queda colgado para siempre: las medialunas siguen reservadas (no se pueden vender) y el cliente no sabe nada.
- **El arreglo:** si nadie lo confirma en un plazo (por ejemplo, el mismo de los comprobantes, 2 h, o hasta el cierre del día), se cancela solo, el stock se libera y **los sellos le vuelven al cliente**. Es lo mismo que ya pasa con un pedido que no subió el comprobante.
- Con los avisos nuevos, además, al comercio le llega un aviso apenas entra.

### Cómo funciona el Club hoy (y si coincide con lo que pensó Pedro)
- Cada negocio decide si usa el Club, cuántas compras hacen falta para cada premio y qué premio da. Puede tener varios escalones (por ejemplo, a las 5 visitas una docena de medialunas y a las 10 un 20 % de descuento).
- Cada compra suma **un sello**, en el local con el QR o en la tienda online.
- **Si el negocio cambia el premio, vale el premio nuevo.** Cuando el cliente canjea, se le da lo que el negocio ofrece en ese momento, no lo que había antes. Es lo que quiere Pedro: si cambió de "docena de medialunas" a otra cosa y el cliente no la retiró, se lleva la nueva. El canje guarda una copia del premio que se entregó, para el historial.
- Para Mostry, el Club es una función más del sistema, gratis. El "premio" lo pone cada negocio.

### Facturación de Mostry (monotributo)
- Como Pedro es monotributista, por cada pago del plan (por ejemplo, $ 10.000 por transferencia al alias) emite una **factura C** electrónica desde ARCA (ex AFIP), con el facturador de ARCA ("Comprobantes en línea") o con una app de facturación.
- La factura va a nombre del comercio (con su CUIT o DNI) o como consumidor final. Conviene confirmarlo con el contador.
- **Sin Stripe ni Mercado Pago:** el comercio transfiere al alias de Mostry y Pedro registra el pago en el admin, como ya funciona hoy, sin comisiones.
- **Lo que suma Mostry** (en S2): un campo "N.º de factura" al registrar el pago y la opción de adjuntar el PDF. El comercio la ve en **Suscripción → Mis pagos**, así tiene la tranquilidad de una factura por cada pago.
- **Más adelante** se podría automatizar con el web service de ARCA, pero para el piloto alcanza con hacerlo a mano.
- **Ojo con el tope de facturación anual de la categoría del monotributo** a medida que crezcan los comercios: hablarlo con el contador.

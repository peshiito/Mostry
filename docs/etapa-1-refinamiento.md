# Etapa 1 – Refinar la idea

Cada punto tiene una **pregunta** y mi **propuesta**. Para responder alcanza con
algo tipo "1 ok, 2 ok, 3 prefiero X…". Las marcadas con ⚠️ bloquean la Etapa 2 o la 3.

---

## A. Stack (lo que el documento me pide proponer)

**1. ⚠️ ORM y migraciones.**
El documento exige que las migraciones "se puedan revertir" (Etapa 3). **Ni Prisma ni
Drizzle tienen migraciones "down"**: las dos solo van para adelante.

| Opción | A favor | En contra |
| --- | --- | --- |
| **Kysely** (query builder) + su `Migrator` | Migraciones `up`/`down` reales en TS. SQL explícito (el `UPDATE ... WHERE stock - stock_reservado >= ?`, `GET_LOCK` y las FK compuestas salen naturales). Tipado fuerte, sin motor extra, siempre parametrizado. | No es un ORM: los tipos de las tablas se escriben a mano o se generan con `kysely-codegen`. Más SQL a mano. |
| Drizzle (mysql2) | Esquema en TS, liviano, SQL-like. Migraciones SQL legibles. | Sin `down`: hay que escribir la reversión a mano aparte. |
| Prisma | El más conocido, buen tooling. | Sin `down`. Motor/cliente pesado. Las consultas atómicas y `GET_LOCK` terminan en `$queryRaw`. Esquema en un archivo `.prisma` que pasa las 70 líneas. |

**Propuesta: Kysely + mysql2.** Si preferís Drizzle o Prisma, la reversión la
resuelvo con scripts SQL `down` escritos a mano, pero ojo, se pueden desincronizar.

**2. Emails.** **Propuesta: nodemailer** detrás de un servicio `mailer`. En local,
**Mailpit** en Docker (bandeja web en `localhost:8025`, no sale nada a internet). En
producción, **Resend vía SMTP** (gratis hasta 3.000 por mes). Cambiar de proveedor
sería cambiar variables del `.env`.

**3. Cron.** **Propuesta: `node-cron`** (ya está en el documento), con un wrapper
`conLock(nombre, fn)` que usa `GET_LOCK`/`RELEASE_LOCK` y loguea la duración.

**4. Contraseñas.** **Propuesta: argon2id** (paquete `argon2`), con un mínimo de
10 caracteres y un máximo de 128.

**5. Versión de Node.** Tenés Node 26 en la máquina. **Propuesta:** fijar
**Node 24 LTS** en Docker y en `engines`, que es la que Railway y las imágenes
oficiales soportan con más tiempo. El 26 te sirve igual en local.

**6. Estructura del repo.** **Propuesta:** `backend/` y `frontend/` con su propio
`package.json` cada uno, sin workspaces. El worker vive dentro de `backend/`
como otro punto de entrada (`src/worker/index.ts`), así comparte repositorios y config.

**7. Tests contra la base.** **Propuesta:** una base `mostry_test` en el mismo
contenedor MySQL. Antes de cada suite se migra de cero y cada test limpia sus
tablas. Nada de mocks de la base para los repositorios.

**8. Cliente HTTP (Etapa 5).** **Propuesta: Bruno**, porque guarda las requests
como archivos de texto dentro del repo.

---

## B. Dominios, sesiones y API (huecos de arquitectura)

**9. ⚠️ ¿Dónde vive la API?** Si la API está en `api.mostry.com.ar`, la cookie de
sesión de `sutienda.mostry.com.ar` no le llega (salvo que la cookie sea de todo
`.mostry.com.ar`, y eso deja que una tienda vea la sesión de otra). Además
hace falta CORS.
**Propuesta:** la API va en **el mismo origen**, `sutienda.mostry.com.ar/api/...`.
El backend sirve `/api/*` y los archivos del frontend en todos los subdominios
(comodín). Ganamos una cookie host-only por tienda, una tienda resuelta por `Host`
y CORS casi innecesario. `api` queda como subdominio reservado igual.

**10. ⚠️ Falta la zona raíz.** `mostry.com.ar` y `www` no figuran en las tres
zonas, pero el registro tiene que pasar en algún lado.
**Propuesta:** una cuarta zona, **"sitio"**, en `mostry.com.ar`: landing simple,
registro y "¿cuál es tu tienda?" para ir al login. El login de cada comerciante se
hace en `sutienda.mostry.com.ar/panel/login`.

**11. Subdominios en desarrollo.** **Propuesta:** usar `*.localhost`
(`facturas-dona-rosa.localhost:5173`, `admin.localhost:5173`). Brave, Chrome y
Firefox lo resuelven sin tocar `/etc/hosts`.

**12. Duración de las sesiones.** **Propuesta:** comerciante, 30 días con
renovación por uso; admin, 12 h sin renovación. Al cambiar la contraseña se
cierran todas las sesiones.

**13. ⚠️ Falta "olvidé mi contraseña".** **Propuesta:** link por email con un token
de un solo uso (hasheado en la base) que vence en 1 h. La respuesta es siempre la
misma, exista o no el email.

**14. Seguridad del admin.** El admin puede activar y suspender cualquier tienda.
**Propuesta:** login del admin solo en `admin.mostry.com.ar`, rate limit más duro
y **TOTP (Google Authenticator)** obligatorio. Si te parece mucho para v1, lo dejo
para la Etapa 14.

**15. ¿Un usuario, varias tiendas?** `miembros_tienda` lo permite.
**Propuesta:** en v1, una tienda por usuario. Dejo la tabla como está para no
romper nada después.

**16. Reglas del subdominio.** **Propuesta:** de 3 a 30 caracteres, `a-z 0-9 -`,
sin guion al principio ni al final, más la lista de reservados (`admin`, `www`,
`api`, `app`, `panel`, `mail`, `static`, `assets`, `cdn`, `staging`, `soporte`,
`ayuda`, `blog`, `mostry`…). En v1 **no se puede cambiar** después del registro
(solo yo, desde el admin).

---

## C. Registro y suscripción

**17. ¿Qué pasa antes de verificar el email?** **Propuesta:** puede entrar al panel
y configurar la tienda, pero la tienda pública no se publica. **La prueba de 10 días
arranca al verificar**, no al registrarse.

**18. Pagar durante la prueba.** Si paga el día 3, ¿pierde los 7 días que le
quedan? **Propuesta:** el plan se extiende 30 días desde
`max(prueba_hasta, plan_hasta, hoy)`, así no pierde días.

**19. Pedidos abiertos al suspenderse.** **Propuesta:** los links de seguimiento
siguen andando (solo lectura). Los pedidos en `pendiente_pago` los cancela el
worker como cualquier otro vencido. Los que ya estaban aprobados quedan como
están, y el comerciante los ve en solo lectura.

**20. "Pausar tienda" contra "fuera de horario".** **Propuesta:** fuera de horario,
solo encargos (como dice el documento). **Pausada, no acepta nada**, ni encargos,
y muestra un cartel.

---

## D. Pedidos y encargos

**21. ⚠️ Falta `categoria_id` en `productos`.** **Propuesta:** un producto tiene una
sola categoría, opcional ("Sin categoría").

**22. ⚠️ Costo de envío no modelado.** Hay `entrega = envio`, pero no hay precio.
**Propuesta v1:** en `tiendas`, un `costo_envio` fijo (puede ser 0) y un texto
`zona_envio` ("Solo Lanús Oeste"). El costo se suma al total y se copia en el
pedido (`costo_envio`).

**23. ⚠️ Número correlativo concurrente.** **Propuesta:** columna
`tiendas.ultimo_numero_pedido`, que se incrementa con
`UPDATE ... SET ultimo_numero_pedido = LAST_INSERT_ID(ultimo_numero_pedido + 1)`
dentro de la misma transacción del pedido. Sin huecos por carrera.

**24. ⚠️ Encargo sin seña: ¿qué estados recorre?** `pendiente_pago` no aplica.
**Propuesta:** `pendiente_confirmacion` → (el comerciante acepta) → `en_preparacion`
→ ... (el comerciante también puede rechazarlo, y queda `cancelado`). Con seña,
sigue el flujo normal de comprobante con plazo de 24 h.

**25. Carrito mixto.** **Propuesta:** el tipo es por pedido. Con la tienda abierta,
el comprador elige "lo antes posible" o "encargo para una fecha". Cerrada, solo
encargo. En un encargo solo entran productos con `acepta_encargo`.

**26. Cancelar un pedido ya aprobado.** **Propuesta:** se devuelve el stock y el
panel le pregunta si devolvió la plata. Si contesta que sí, se genera un egreso
"Devolución pedido #N". Nunca se toca el ingreso original.

**27. El precio cambió entre el carrito y el checkout.** **Propuesta:** el navegador
manda el total que vio. Si no coincide con el recalculado, la API responde 409 con
los precios nuevos y el comprador confirma de nuevo. El servidor manda siempre.

**28. Horarios que cruzan la medianoche** (20:00 a 02:00). **Propuesta:** no se
permiten. Se cargan dos tramos (20:00–23:59 y 00:00–02:00 del día siguiente).

**29. ¿Cupo de encargos por día?** No está previsto. **Propuesta:** en v1, sin
cupo. El comerciante puede rechazar.

**30. Promociones.** **Propuesta:** en v1 son **solo informativas** (banner con
título y descripción). No cambian precios. Los descuentos reales quedan para después.

**31. Seguridad del link de Maps.** Es una URL que pega el comprador y que ve el
comerciante: es una puerta a `javascript:` o al phishing.
**Propuesta:** solo `https://` de dominios de Google Maps (`maps.app.goo.gl`,
`google.com/maps`, `goo.gl/maps`). Si no coincide, se rechaza.

**32. Formato de WhatsApp.** **Propuesta:** se normaliza a `549XXXXXXXXXX` (formato
`wa.me`). Se validan números argentinos y se acepta que el usuario escriba
"11 2345-6789" o "+54 9 11…".

---

## E. Comprobantes y archivos

**33. Retención de comprobantes.** El documento dice borrarlos 2 h después de
aprobar, pero no dice qué pasa con los rechazados o los de pedidos cancelados.
**Propuesta:** se programa el borrado igual, 48 h después del rechazo o la
cancelación (le da tiempo al comerciante de revisar si hay reclamo).

**34. Fotos de producto.** **Propuesta:** hasta 5 por producto. Procesadas con
`sharp` a WebP en dos tamaños (1200 px y 400 px), sin metadatos. Mismo tratamiento
para el logo de la tienda.

---

## F. Caja, gastos y libreta

**35. ¿Y si se olvida de cerrar la caja?** **Propuesta:** al abrir la del día
siguiente, el panel le pide cerrar la anterior con lo contado. Si no la cierra,
queda marcada "sin cierre" y la diferencia queda vacía.

**36. Efectivo con la caja cerrada.** Las transferencias entran igual, pero el
efectivo no tiene dónde ir. **Propuesta:** cualquier movimiento en efectivo exige
caja abierta. `movimientos_caja.caja_id` es opcional (nulo para las transferencias
fuera de caja).

**37. ¿"Inversión" resta en la ganancia real?** **Propuesta:** no. La ganancia real
es ingresos menos gastos de tipo `gasto`. Las inversiones se muestran aparte.

**38. ¿Una deuda de fiado mueve la caja?** **Propuesta:** no, porque no entra
plata. Solo el **pago** de un fiado genera el ingreso (con medio elegido).

---

## G. Marca y frontend

**39. Colores de las tiendas contra la accesibilidad.** Si eligen un amarillo
claro de botón con texto blanco, la tienda queda ilegible.
**Propuesta:** se elige de una paleta de 8 a 10 combinaciones ya probadas (sin
color libre en v1). Así también se respeta "un solo botón principal".

**40. Modo oscuro.** **Propuesta:** el panel y el admin, siguiendo el sistema.
La tienda pública, solo en claro en v1 (los colores son del comercio).

---

## H. Infra

**41. Rate limit.** **Propuesta:** el store en memoria de `express-rate-limit`
alcanza mientras haya una sola instancia (piloto). Si escalamos a más de una,
pasa a MySQL o Redis. Lo dejo anotado.

**42. Backups.** **Propuesta:** bucket privado aparte para backups
(`mostry-backups`), con retención de 14 diarios y 6 mensuales. La prueba de
restauración mensual levanta el dump en una base temporal y cuenta filas de las
tablas clave.

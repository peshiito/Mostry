# Etapa 12 · Ataques y carga — informe

Revisión de seguridad de Mostry **en local**, encarada desde la defensa: por cada
amenaza de la lista de la Etapa 12 se identifica la protección, se verifica con un
test automático (que queda en la suite y se corre siempre) y se anota el resultado.
No incluye recetas de ataque: el objetivo es dejar constancia de qué está protegido
y cómo se comprueba.

**Fecha:** 6 de octubre de 2026 · **Entorno:** Docker local (MySQL 8.4, RustFS), API y frontend en el host.

## Resumen

| Resultado | Cantidad |
|---|---|
| Amenazas revisadas | 16 |
| Protegidas y con test | 16 |
| Huecos encontrados y corregidos en esta etapa | 6 |
| Pendientes para producción (Etapa 16) | 3 |

## Amenazas y protecciones

| # | Amenaza | Protección | Verificado en | Resultado |
|---|---|---|---|---|
| 1 | Inyección SQL | Consultas 100 % parametrizadas con Kysely; Zod valida toda entrada | Semgrep (`p/sql-injection`, 0 hallazgos) · `catalogo/tests/paginacionYBusqueda` | ✅ |
| 2 | XSS guardado (descripciones, frases) | React escapa todo; no hay `dangerouslySetInnerHTML` ni `innerHTML` en el código; CSP | Búsqueda en todo el frontend · CSP nueva (ver hallazgo H5) | ✅ |
| 3 | CSRF | Toda escritura exige un `Origin` de Mostry; cookies `SameSite=Lax` | `shared/middlewares/seguridadHttp.test` | ✅ |
| 4 | Fuerza bruta de login | Límite por IP y por email; mismo error para clave mala y email inexistente | `auth/tests/limites` · `auth/tests/login` | ✅ |
| 5 | Fuerza bruta en acciones sensibles (cambiar clave o alias con una sesión robada) | Pide la contraseña + límite por IP **y por cuenta** | `tiendas/tests/cobro` (5 intentos → 429) | ✅ (H1) |
| 6 | Leer o escribir datos de otra tienda (IDOR) | `tiendaId` obligatorio en repositorios, FK compuestas, membresía verificada, marca `TiendaId` en las columnas | `*/tests/*aislamiento*` · `pedidos/tests/idorPanel` · `db/tests/aislamiento` | ✅ (H2) |
| 7 | Adivinar tokens de seguimiento | 256 bits aleatorios; un token de otra tienda no sirve | `pedidos/tests/seguimiento` | ✅ |
| 8 | Manipular precios en el checkout | El servidor recalcula todo; si no coincide, 409 con el total real | `pedidos/tests/checkoutRechazos` | ✅ |
| 9 | Mass assignment | Esquemas `strictObject`; las actualizaciones genéricas no pueden tocar estado, plan, alias ni la tienda de una fila | Tests de validaciones por módulo · tipos (H3) | ✅ (H3) |
| 10 | Archivos maliciosos (SVG con script, políglotas, extensión falsa, bomba de descompresión) | Validación por contenido (magic bytes), reproceso a WebP, nunca SVG, 5 MB máximo | `catalogo/tests/fotosAtaques` · `fotosContenido` · `comprobantes/tests/archivos` | ✅ |
| 11 | Path traversal en nombres de archivo | El nombre del archivo nunca llega a la clave del bucket | `comprobantes/tests/archivos` | ✅ |
| 12 | Escalada comerciante → admin | Cookie de admin aparte + `esAdmin` verificado | `admin/tests/acceso` | ✅ |
| 13 | Operar con la tienda suspendida por la API | La API bloquea escrituras, no solo el frontend | `pedidos/tests/suspendida` · `catalogo/tests/accesoYSuspension` | ✅ |
| 14 | Reusar URLs firmadas vencidas o alteradas | Vigencia de 5 min; la firma cubre la vigencia | `shared/archivos/urlVencida.test` (nuevo) | ✅ (H4) |
| 15 | Payloads gigantes | JSON hasta 100 kb (413), archivos hasta 5 MB | `shared/middlewares/manejarErrores.test` · `fotosAtaques` | ✅ |
| 16 | Condiciones de carrera en el stock | UPDATE condicional atómico, reservas en orden fijo (sin deadlocks) | `pedidos/tests/cargaCompradores` (nuevo) · `comprobantes/tests/aprobacionConcurrente` | ✅ (H6) |

## Prueba de carga: 100+ compradores a la vez

Se llama directo al servicio de checkout para que el límite por IP no frene la
carrera antes de llegar al stock (el test anterior disparaba 20 compras, pero el
rate limit dejaba pasar menos de 10).

| Escenario | Resultado |
|---|---|
| 150 compradores por un producto con 5 unidades | Se venden **exactamente 5**; el resto recibe "sin stock"; números de pedido 1 a 5 sin saltos ni repetidos |
| 120 carritos mezclados (uno o dos productos, en distinto orden) | Sin deadlocks ni errores inesperados; lo reservado coincide con lo vendido y nunca supera el stock |

## Escaneo automático (OWASP ZAP baseline)

| Objetivo | Antes | Después |
|---|---|---|
| Sitio y tienda (frontend) | 0 fallas · 8 advertencias | 0 fallas · 5 advertencias (todas esperables, ver abajo) |
| API | 0 fallas · 1 advertencia (informativa) | sin cambios |

Advertencias que quedan y por qué:
- **CSP con comodín:** solo en desarrollo (Vite necesita el websocket del recargado en caliente). Con el build (`vite preview`) la CSP es estricta.
- **Cross-Origin-Embedder-Policy:** se deja sin activar a propósito: bloquearía las fotos y logos que vienen del bucket (otro origen).
- **Contenido cacheable / comentarios / "aplicación moderna":** informativas, propias del servidor de desarrollo.

## Hallazgos de esta etapa y correcciones

| # | Hallazgo | Corrección |
|---|---|---|
| H1 | Al sacar el 2FA, cambiar la clave o el alias de cobro quedó protegido solo por un límite por IP | Límite extra **por cuenta** (5 cada 15 min) después de verificar la sesión |
| H2 | La marca `TiendaId` existía en los servicios pero no en las columnas: una consulta podía filtrar por un número cualquiera | `tienda_id` tipado como `TiendaId` en todas las tablas (no se puede actualizar); el admin obtiene el id verificando que la tienda exista; regla de lint que prohíbe `as TiendaId`; las rutas del panel leen la tienda de `tiendaDelPanel(req)`, que solo existe después de verificar la membresía |
| H3 | Las actualizaciones genéricas de la tienda y de comprobantes aceptaban cualquier columna | Tipos acotados: la config no toca estado, plan ni alias (el alias tiene su propio método); un comprobante no cambia de tienda, pedido, tipo ni archivo |
| H4 | Se verificaba que la URL firmada dura 5 min, pero no que una vencida se rechace | Test nuevo: emitida hace 6 min → 403; vigencia estirada a mano → 403 |
| H5 | El frontend no mandaba encabezados de seguridad (CSP, anti-clickjacking, nosniff, Permissions-Policy) | `frontend/encabezados.config.js` aplicado en Vite (dev y preview); verificado en el navegador sin errores |
| H6 | La prueba de concurrencia no llegaba a 100 compradores reales | Test de carga con 150 y 120 compradores simultáneos |

Además, en la revisión previa a esta etapa se agregaron reglas en la base (migración
0033): un pedido inmediato no tiene seña, esperando el pago siempre hay plazo, un
cancelado tiene fecha y un comprobante aprobado guarda los datos del pago.

## Pendientes para producción (Etapa 16)

1. ~~**Encabezados del frontend en el servidor real:**~~ ✅ **Resuelto en la Etapa 15.** `frontend/servidor/servir.js` manda los mismos encabezados de `encabezados.config.js` (con el hash del script del tema). Queda poner `VITE_ORIGEN_ARCHIVOS` con el dominio público de R2.
2. **`TRUST_PROXY`** en Railway y en el VPS. La config lo exige en producción y está documentado en `.env.produccion.example` (`2` con Cloudflare + Railway).
3. **HTTPS y HSTS** en Cloudflare (las cookies `__Host-` ya exigen HTTPS). Está en la checklist de `docs/produccion.md`.

## Cómo repetir las pruebas (fish)

```fish
cd ~/Escritorio/Programacion/Proyectos/Mostry/backend
npx vitest run src/modules/pedidos/tests/cargaCompradores.test.ts src/shared/archivos/urlVencida.test.ts
npx vitest run   # suite completa (~11 min)
```

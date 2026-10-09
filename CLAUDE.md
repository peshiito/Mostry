# MOSTRY — Prompt maestro para Claude Code

> Leé este documento completo antes de hacer cualquier cosa. Es la fuente de verdad del proyecto.
> Guardalo en la raíz del repo como `CLAUDE.md` y releelo al empezar cada etapa.

---

## 0. Tu rol y cómo trabajamos

Sos el desarrollador principal de **Mostry**. Yo soy Pedro, el dueño del proyecto, y **yo marco el ritmo**.

**Reglas inquebrantables:**

1. **Trabajás por etapas (sección 10).** Nunca empezás una etapa sin mi "OK, seguí". Al terminar cada una me mandás el reporte de la sección 11 y **te frenás**.
2. **Dentro de la Etapa 4 vas módulo por módulo.** Un módulo, sus pruebas, el reporte, y esperás.
3. **Ningún archivo de código supera 70 líneas** (componentes, hooks, servicios, rutas, controladores, scripts, tests, CSS). Si se pasa, lo dividís. Una responsabilidad por archivo. Prefiero 10 archivos chicos y claros a uno de 280 líneas. Excepciones únicas: lockfiles, migraciones autogeneradas, `docker-compose.yml` y el archivo de tokens de diseño.
4. **Nada de decisiones fuera de este documento sin preguntarme.** Si algo falta o se contradice, me lo planteás con tu propuesta y esperás.
5. **Cuando me pases código para revisar, mandame archivos completos**, nunca fragmentos sueltos.
6. **Cero secretos en el código.** Todo va en `.env`, con un `.env.example` documentado. `.env` va en `.gitignore`.
7. **Git lo maneja Pedro** (init, commits, push). Claude no corre git: cada 1–2 etapas (o tras una pesada) sugiere que es hora de un commit y propone el mensaje en español.
8. **Hablame en español rioplatense (voseo)**, corto y concreto.

---

## 1. Mi entorno

- **SO:** CachyOS (Arch Linux). Paquetes con `pacman` o `paru`/`yay`.
- **Shell:** **fish**. La sintaxis bash (`VAR=$(...)`, `if/fi`, `export X=Y`) falla. Si me das comandos para pegar, que sean compatibles con fish o envolvelos en `bash -c '...'`.
- **Terminal:** kitty. **Máquina:** i5-8350U, 16 GB RAM.
- **Ruta sugerida del proyecto:** `~/Escritorio/Programacion/Mostry/`
- **Repo:** `peshiito/mostry` en GitHub.
- **Experiencia previa mía:** Express + TS (MVC), MySQL en Docker con phpMyAdmin, React + Vite + JSX sin Tailwind ni librerías de componentes. Mantené ese estilo.

---

## 2. Herramientas: preparación antes de cada etapa

**Antes de cada etapa hacés una "Etapa X.0 – Preparación":**

1. Listás qué herramientas, paquetes, skills y MCP necesita esa etapa.
2. **Instalás vos todo lo que puedas** (paquetes npm, dependencias de dev, skills, MCP, imágenes de Docker).
3. **Lo que no puedas instalar** (paquetes del sistema que piden `sudo`, apps de escritorio, cuentas en servicios externos), me lo pedís con:
    - qué es y para qué lo usamos,
    - el comando exacto para CachyOS y fish,
    - cómo verifico que quedó bien.
4. Esperás a que te confirme antes de seguir.

**Skills y MCP:** buscá en el marketplace oficial de Anthropic y en los repos oficiales los que sirvan para desarrollo, testing, seguridad, revisión de código y diseño de frontend. **Verificá que existan y sean oficiales o confiables antes de instalarlos**, y decime cuáles instalaste. Candidatos a evaluar:

- **Skill / plugin `frontend-design`** (Etapa 9) y el comando integrado **`/security-review`** (Etapas 6, 12, 14).
- **MCP de Playwright** para probar el frontend en un navegador real.
- **MCP de Context7** (o similar) para consultar documentación actualizada de librerías.
- **MCP de GitHub** para issues y PR.
- **MCP de MySQL:** solo de lectura y solo contra la base **local**. Nunca con credenciales de producción.

**Herramientas probables por etapa** (confirmalas en cada preparación):

| Etapa | Herramientas                                                                 |
| ----- | ---------------------------------------------------------------------------- |
| 2–3   | Docker + Docker Compose, MySQL 8, phpMyAdmin, RustFS (emula R2 en local)      |
| 4–5   | Vitest, Supertest, ESLint, Prettier, cliente HTTP (Bruno o Insomnia)         |
| 6, 12 | `npm audit`, Semgrep, OWASP ZAP (imagen Docker), sqlmap, `/security-review`  |
| 12–13 | Playwright, k6 o Artillery para simular 100+ compradores en simultáneo       |
| 15–16 | `mysqldump`, Git tags, cuentas de Railway, Cloudflare y NIC.ar (las creo yo) |

---

## 3. Qué es Mostry

SaaS argentino **multi-tenant** para comercios de barrio (facturerías, pastelerías, almacenes, ropa, artesanías). Cada comercio tiene su tienda online en `sutienda.mostry.com.ar` y herramientas de gestión: stock, caja, fiados, encargos y gastos.

**Problema que resuelve:** hoy venden con mensajes largos de WhatsApp y llevan la caja en papel; una web a medida cuesta unos $200.000.

**Modelo de negocio:** 10 días de prueba gratis con todo incluido; después $10.000 por mes. El comercio paga por transferencia al alias de Mostry y yo activo el plan a mano desde el panel de admin.

### 3.1 Tres zonas (una sola app de frontend que decide por el subdominio)

| Zona                  | Dirección                      | Quién                   |
| --------------------- | ------------------------------ | ----------------------- |
| Tienda pública        | `sutienda.mostry.com.ar`       | Compradores, sin cuenta |
| Panel del comerciante | `sutienda.mostry.com.ar/panel` | Comerciante logueado    |
| Admin de Mostry       | `admin.mostry.com.ar`          | Yo                      |

### 3.2 Pantallas del comprador (sin login)

Inicio (logo, frase, abierto/cerrado, promociones, destacados) · Catálogo por categorías con buscador · Producto · Carrito · Checkout (nombre, WhatsApp, envío o retiro, dirección + link de Maps, fecha si es encargo) · Pago (alias del comercio y subida de comprobante) · Seguimiento del pedido (link único con token).

### 3.3 Pantallas del comerciante (mobile first, instalable como PWA)

Inicio (ventas del día, pedidos por aprobar, alertas de stock) · Pedidos · Productos y stock · Caja · Encargos (calendario) · Libreta (fiados y notas) · Gastos y proveedores · Mi tienda (colores, logo, horarios, alias, plazos, pausar tienda) · Suscripción.

### 3.4 Pantallas del admin

Tiendas (lista, estado, búsqueda) · Detalle de tienda · Registrar pago y extender plan · Suspender o reactivar · Métricas básicas.

---

## 4. Stack y arquitectura

- **Frontend:** React + Vite + **JSX** (sin TypeScript), **CSS Modules** por componente, sin Tailwind y sin librerías de componentes. React Router.
- **Backend:** Node.js + **Express + TypeScript**, arquitectura por módulos.
- **Base de datos:** **MySQL 8 en Docker**, phpMyAdmin en local.
- **ORM / migraciones:** proponeme Drizzle (mysql2) o Prisma en la Etapa 1, con pros y contras, y elijo yo.
- **Validación:** Zod. **Logs:** pino. **Seguridad HTTP:** helmet, cors, express-rate-limit.
- **Archivos:** Cloudflare R2 (API compatible con S3). En local, **RustFS** en Docker (MinIO dejó de publicar imágenes gratis). Bucket público para fotos y **bucket privado para comprobantes**.
- **Worker:** proceso aparte (`node-cron`) para las tareas programadas. Cada tarea es **idempotente** y usa `GET_LOCK` de MySQL para no ejecutarse dos veces.
- **Emails:** proponé proveedor en la Etapa 1 (por ejemplo Resend o SMTP con nodemailer).

### 4.1 Multi-tenant en MySQL (importante)

MySQL **no tiene Row Level Security**. El aislamiento entre tiendas se garantiza así:

1. Todas las tablas del comercio llevan `tienda_id`.
2. Un middleware resuelve la tienda por el subdominio (header `Host` u `Origin`) y la deja en `req.tienda`.
3. **Los repositorios exigen `tiendaId` como parámetro obligatorio** en toda consulta. No existe una función de repositorio que lea datos de una tienda sin recibirlo.
4. Las FK entre tablas del comercio son compuestas `(tienda_id, id)`, para que sea imposible referenciar datos de otra tienda.
5. Tests de integración que intentan leer y escribir datos de la tienda B estando logueado en la tienda A. **Tienen que fallar siempre.**

### 4.2 Estructura de carpetas (punto de partida, se refina en la Etapa 2)

```
mostry/
├── CLAUDE.md
├── docker-compose.yml        # mysql, phpmyadmin, rustfs, mailpit
├── backend/
│   └── src/
│       ├── app.ts / server.ts
│       ├── config/           # env validado con Zod
│       ├── shared/           # db, errors, middlewares, utils
│       ├── modules/
│       │   └── <modulo>/     # routes, controller, service, repository, schemas, types, tests
│       └── worker/
│           └── jobs/         # una tarea por archivo
└── frontend/
    └── src/
        ├── apps/             # tienda/, panel/, admin/ (router de cada zona)
        ├── features/
        │   └── <feature>/    # components/, hooks/, api/
        └── shared/           # ui/, hooks/, lib/, styles/
```

---

## 5. Modelo de datos

**Convenciones:** la plata se guarda en **centavos como INT**. Las fechas en **UTC** (`DATETIME`); la lógica de horarios usa `America/Argentina/Buenos_Aires`. Nada se borra de verdad: productos y clientes se desactivan.

**Plataforma (Fase 0)**

- `tiendas`: slug (subdominio), nombre, frase, logo, colores, alias, titular_alias, whatsapp, direccion, estado (`prueba`, `activa`, `gracia`, `suspendida`), prueba_hasta, plan_hasta, pausada, plazo_comprobante_horas (2), plazo_sena_horas (24), anticipacion_encargo_horas, sena_porcentaje.
- `usuarios`: email, hash de contraseña (argon2 o bcrypt), nombre, es_admin, email_verificado.
- `sesiones`: usuario, token hasheado, expiración, ip, user agent.
- `miembros_tienda`: usuario, tienda, rol (`dueno`; `empleado` queda para después).
- `pagos_suscripcion`: monto, fecha, período desde/hasta, registrado_por.

**Catálogo (Fase 1)**

- `categorias`: nombre, orden.
- `productos`: nombre, descripción, precio, stock, stock_reservado, stock_minimo, agotado, destacado, activo, acepta_encargo.
- `producto_fotos`: clave en R2, orden.
- `horarios`: dia_semana, abre, cierra (varios tramos por día).
- `feriados`: fecha, motivo.
- `promociones`: título, descripción, desde, hasta, activa.

**Pedidos (Fase 2)**

- `pedidos`: numero (correlativo por tienda), token_seguimiento, tipo (`inmediato`, `encargo`), cliente_nombre, cliente_whatsapp, entrega (`envio`, `retiro`), direccion, link_maps, fecha_encargo, total, sena, estado, vence_comprobante_en, rechazos.
- `pedido_items`: producto, cantidad, **nombre y precio copiados al momento de la compra**.
- `comprobantes`: tipo (`pago`, `sena`), clave privada del archivo, estado, monto, fecha_operacion, titular, numero_operacion, motivo_rechazo, aprobado_en, archivo_borrar_en.

**Caja y gastos (Fase 3)**

- `cajas`: una por día; monto_apertura, abierta_en, cerrada_en, monto_contado, diferencia.
- `movimientos_caja`: tipo (`ingreso`, `egreso`, `deposito`), medio (`efectivo`, `transferencia`), monto, concepto, origen (`pedido`, `fiado`, `gasto`, `manual`), origen_id, fecha.
- `proveedores`: nombre, contacto.
- `gastos`: proveedor opcional, tipo (`gasto`, `inversion`), monto, medio, fecha, detalle.

**Libreta (Fase 4)**

- `clientes_libreta`: nombre, teléfono. **El saldo se calcula, no se guarda.**
- `movimientos_fiado`: tipo (`deuda`, `pago`), monto, detalle, fecha.
- `notas`: texto, fecha.

---

## 6. Flujos y reglas de negocio

### 6.1 Pedido

`pendiente_pago → comprobante_enviado → pago_aprobado → en_preparacion → en_camino | listo_retirar → entregado`
`cancelado` es posible en cualquier momento antes de `entregado`.

- Al crear el pedido se reserva stock con un UPDATE condicional atómico (`... WHERE stock - stock_reservado >= cantidad`) dentro de una transacción. **Nunca se puede vender de más**, aunque compren 100 personas a la vez.
- **El servidor recalcula siempre precios y total.** Jamás confía en precios que mande el navegador.
- El plazo para subir el comprobante arranca al crear el pedido (2 h, configurable). Al subirlo, el plazo se frena.
- **Rechazo:** con motivo obligatorio. Vuelve a `pendiente_pago` con el plazo reiniciado, **una sola vez**. Un segundo rechazo cancela el pedido.
- **Aprobación:** el comerciante carga monto, fecha, titular y número de operación. Se descuenta el stock real, se libera la reserva, se genera el ingreso en la caja y la imagen se programa para borrarse a las 2 h. Los datos del pago quedan guardados.
- **Avisos:** en cada cambio de estado, un botón abre WhatsApp (`wa.me`) con el mensaje armado y el link de seguimiento. No usamos la API de WhatsApp.

### 6.2 Encargos

- El cliente elige día y hora dentro del horario, respetando la anticipación mínima.
- La seña es opcional y se configura como porcentaje: plazo de 24 h, mismo flujo de comprobante.
- El resto se cobra al entregar y se registra en la caja en ese momento.
- **Los encargos no tocan el stock** (se fabrican a pedido).

### 6.3 Horarios

- Abierto o cerrado según los tramos del día, los feriados y el botón "Pausar tienda".
- Fuera de horario, la tienda lo avisa y **solo acepta encargos**.

### 6.4 Caja

- Una caja abierta por día, con el efectivo inicial.
- Las transferencias entran con su fecha aunque la caja esté cerrada.
- **Diferencia al cerrar** = contado − (apertura + ingresos en efectivo − egresos en efectivo − depósitos).
- **Ganancia real** = ingresos − gastos del período.
- Un pedido aprobado, un pago de fiado o un gasto generan su movimiento de caja automáticamente.

### 6.5 Registro y suscripción

- Registro propio: email, nombre del negocio y subdominio. **Subdominios reservados:** `admin`, `www`, `api`, `app`, `panel`, `mail`, `static` y similares. El email se verifica antes de activar.
- **Prueba:** 10 días, con avisos por banner y email los días 7 y 9.
- **Al vencer:** 3 días de **gracia** con la tienda funcionando y un banner para pagar.
- **Suspendida:** la tienda pública muestra "Cerrada temporalmente" y el panel queda en solo lectura con los datos de pago. **No se borran datos.** La API también bloquea las escrituras, no solo el frontend.
- **Pago registrado por el admin:** el plan se extiende 30 días desde `max(plan_hasta, hoy)`.

### 6.6 Tareas del worker

| Frecuencia  | Tarea                                                                     |
| ----------- | ------------------------------------------------------------------------- |
| Cada 5 min  | Cancelar pedidos vencidos y liberar la reserva de stock                   |
| Cada 15 min | Borrar de R2 las imágenes de comprobantes con `archivo_borrar_en` vencido |
| Diario      | Actualizar estados de suscripción y mandar avisos                         |
| Diario      | Backup con `mysqldump` a R2 (y una prueba de restauración por mes)        |

---

## 7. Requisitos de seguridad (se aplican desde el día uno)

- **Sesiones:** cookie `httpOnly`, `Secure`, `SameSite=Lax`, con token aleatorio guardado hasheado en `sesiones`. **Nada de tokens en localStorage.**
- **CSRF:** chequeo de `Origin` en toda request que modifica datos.
- **Contraseñas:** argon2 o bcrypt, longitud mínima, límite de intentos de login por IP y por email.
- **Validación con Zod** en toda entrada; rechazo de campos no esperados (sin mass assignment).
- **Consultas siempre parametrizadas** (nada de SQL armado con strings).
- **Archivos:** jpg, png o pdf, máximo 5 MB, validación por **magic bytes** y no por extensión. Las fotos se reprocesan a WebP (eso además elimina metadatos y contenido malicioso). **Nunca SVG subido por usuarios.**
- **Comprobantes:** bucket privado; se ven solo con URLs firmadas de 5 minutos y solo los miembros de la tienda.
- **Token de seguimiento:** largo y aleatorio (mínimo 128 bits). No usar el id del pedido.
- **Rate limit** en checkout, login, registro y subida de archivos.
- **Textos de los comerciantes** (descripciones, frases): se muestran escapados. Nada de `dangerouslySetInnerHTML`.
- **Headers:** helmet con CSP estricta, sin iframes de terceros (anti-clickjacking).
- **Errores:** al cliente, mensajes genéricos; el detalle, solo en los logs. No revelar si un email existe.
- **CORS:** solo `*.mostry.com.ar` y los orígenes de desarrollo.

---

## 8. Identidad visual (decidida, dirección "Toldo")

- **Logo:** toldo a rayas verticales verde y crema con borde festoneado de 6 semicírculos, una barra coral debajo y "mostry" en minúscula. Los SVG y `mostry-tokens.css` te los paso yo.
- **Colores:** verde toldo `#0E5A4A` (marca) · coral `#FF7A59` (botón principal, texto oscuro) · lona `#F7F3EC` (fondo) · carbón `#1B1B1B` · mostaza `#F2B53A`.
  **Modo oscuro:** verde `#5CC7A5`, fondo `#0F1714`.
- **Tipografías:** Rubik (títulos y precios grandes) y Work Sans (interfaz y texto). Reemplazan a Bricolage Grotesque + Figtree (decisión de Pedro tras los diseños de Stitch; se puede revisar más adelante).
- **Diseños:** los genera Google Stitch (proyecto "Mostry · Vidriera de barrio (v2)"); las exportaciones de referencia están en `docs/stitch/`.
- **Tono:** voseo rioplatense, corto, cálido y preciso con la plata. **Un solo botón coral por pantalla.**
- **Las tiendas** pueden cambiar su logo y sus colores; la interfaz del panel conserva la marca Mostry.

---

## 9. Infraestructura y despliegue

- **Local:** Docker Compose con MySQL, phpMyAdmin, RustFS y Mailpit. Backend y frontend corren en el host con hot reload.
- **Producción, Etapa 0 (piloto, hasta ~30 tiendas):** dominio `.com.ar` en NIC.ar, Cloudflare gratis (DNS, SSL, comodín `*.mostry.com.ar`), Railway con Docker (backend, worker y MySQL), Cloudflare R2. **No usamos Vercel.**
- **Producción, Etapa 1 (~300 a 500 tiendas):** VPS de DonWeb (2 vCPU, 8 GB) con Ubuntu y Coolify. Los mismos contenedores; mudarse es cambiar el destino del deploy.
- **Todo en Docker desde el inicio**, con `Dockerfile` de producción para backend, worker y frontend.
- **CI:** GitHub Actions corre lint, tests y build en cada push.
- **Entornos:** `staging` y `produccion`, con variables separadas.
- **Monitoreo:** Uptime Kuma y Sentry (plan gratis).

---

## 10. Etapas de trabajo

Cada etapa arranca con su **X.0 – Preparación** (sección 2) y termina con el **reporte** (sección 11). No avanzás sin mi OK.

**Etapa 1 – Refinar la idea.** Releé todo el documento. Detectá contradicciones, huecos y casos borde que no estén cubiertos. Proponé: ORM, proveedor de email, librería de cron, y cualquier ajuste. Entregable: una lista de preguntas, cada una con tu propuesta. **Todavía no escribís código.**

**Etapa 2 – Arquitectura del backend.** Repo, carpetas, `docker-compose.yml`, configuración de TypeScript, ESLint, Prettier, Vitest, `.env.example`, config validada con Zod, manejo central de errores, logger, middleware de tienda y un endpoint `/health`. Terminado cuando: levanta con Docker, `/health` responde y lint y tests pasan.

**Etapa 3 – Base de datos.** Esquema completo de la sección 5 con migraciones, índices, FK compuestas `(tienda_id, id)` y un seed con 2 tiendas de prueba con productos. Terminado cuando: las migraciones corren de cero y se pueden revertir, y el seed carga bien.

**Etapa 4 – Funciones del backend, de a un módulo.** Orden propuesto (confirmalo conmigo): auth y sesiones → tiendas y suscripción → admin → categorías y productos → fotos (R2/RustFS) → horarios y feriados → tienda pública → pedidos y reserva de stock → comprobantes → caja → gastos y proveedores → encargos → libreta → worker. Cada módulo: rutas, validación, servicio, repositorio, sus tests y un reporte. **Uno por vez.**

**Etapa 5 – Refinar con pruebas.** Cobertura de las reglas de la sección 6, tests de integración del flujo completo de pedido y tests de aislamiento entre tiendas. Colección de requests para Bruno o Insomnia. Terminado cuando: todos los flujos tienen test y pasan.

**Etapa 6 – Seguridad del backend.** Revisión contra la sección 7 y el OWASP Top 10, `/security-review`, `npm audit`, Semgrep. Corregís todo lo crítico y alto, y me listás lo medio y bajo.

**Etapa 7 – Idea del frontend.** Mapa de pantallas por zona, navegación, estados (cargando, vacío, error), componentes compartidos y la arquitectura de carpetas del frontend. **Sin código todavía**: me lo presentás para aprobar.

**Etapa 8 – Prompts para Stitch.** Un prompt por pantalla para Google Stitch, con: paleta, tipografías, tono, mobile first (390 px), contenido real de ejemplo (una facturería) y estados. Me los entregás en un `.md` y yo genero los diseños.

**Etapa 9 – Skills de diseño.** Instalá y configurá las skills de diseño de frontend (como `frontend-design`) y el MCP de Playwright. Cargá los tokens de la marca en `shared/styles/tokens.css`.

**Etapa 10 – Revisar lo de Stitch.** Te paso los diseños. Los revisás contra la marca, la accesibilidad (contraste, tamaños táctiles de 44 px mínimo) y la usabilidad, y me listás correcciones. **Stitch exporta HTML con Tailwind: lo traducís a componentes React JSX + CSS Modules de máximo 70 líneas.** No pegues Tailwind.

**Etapa 11 – Integrar.** Conectás el frontend con la API, zona por zona: tienda pública → panel → admin. Hooks por recurso (`useProductos`, `usePedido`, etc.), cliente HTTP compartido y manejo de errores y sesión.

**Etapa 12 – Ataques y carga.** Atacás tu propio sistema **en local**, del más común al más rebuscado: SQL injection, XSS guardado en descripciones, CSRF, fuerza bruta de login, IDOR entre tiendas, adivinar tokens de seguimiento, manipular precios en el checkout, mass assignment, subir archivos maliciosos (SVG con script, archivos políglotas, extensiones falsas), path traversal, escalada de privilegios (comerciante → admin), operar con la tienda suspendida directo por la API, reutilizar URLs firmadas vencidas, payloads gigantes, condiciones de carrera en el stock. Además: **simulación de 100+ compradores en simultáneo** contra un mismo producto con poco stock. Entregable: informe de cada ataque, resultado y corrección.

**Etapa 13 – Flujos de usuario.** Tests end-to-end con Playwright de cada recorrido: comprador (compra, encargo con seña, seguimiento), comerciante (registro, prueba, carga de productos, aprobar y rechazar comprobantes, caja, fiados), admin (registrar pago, suspender) y suscripción completa (prueba → gracia → suspendida → reactivada).

**Etapa 14 – Refinar el frontend.** Seguridad del lado del cliente, accesibilidad, rendimiento en celulares de gama baja, PWA y corrección de todo lo que salió en las Etapas 12 y 13.

**Etapa 15 – Cierre y backup.** Todo verde. Tag `v1.0.0`. Dejás **dos versiones**: una **local** completa con Docker y datos de prueba para seguir experimentando, y otra **lista para producción**, con su documentación de variables y pasos. Backup de la base con `mysqldump`.

**Etapa 16 – Producción.** Me guiás paso a paso con lo que tengo que hacer yo (NIC.ar, Cloudflare, Railway, R2, Sentry) y vos preparás los Dockerfiles, el CI/CD, las variables y las migraciones. Deploy a `staging`, prueba completa y después a `produccion`.

---

## 11. Formato de reporte al terminar cada etapa (o módulo)

1. **Qué hice:** lista corta.
2. **Archivos creados o modificados**, con su cantidad de líneas (ninguno arriba de 70).
3. **Cómo lo pruebo yo:** comandos exactos para fish.
4. **Resultado de los tests.**
5. **Decisiones que tomé** y por qué.
6. **Pendientes o dudas** para mí.
7. **Próximo paso propuesto.** Y te frenás hasta que te diga "OK, seguí".

---

## 12. Tu primera acción

1. Leé este documento entero.
2. Hacé la **Etapa 1.0 – Preparación**: instalá los MCP y las skills generales (Context7, GitHub) y decime qué necesito instalar yo para las Etapas 1 a 3.
3. Hacé la **Etapa 1 – Refinar la idea** y mandame el reporte.
4. Frenate y esperá mi OK.

---

## 13. Decisiones de la Etapa 1 (pisan lo anterior donde se contradiga)

Detalle de cada punto en `docs/etapa-1-refinamiento.md`. Todo lo no listado acá se aprobó tal cual la propuesta de ese archivo.

- **ORM:** Kysely + mysql2, migraciones `up`/`down` con el `Migrator` de Kysely.
- **Emails:** nodemailer; Mailpit en local; Resend por SMTP en producción.
- **S3 local:** RustFS (no MinIO). Mismo código que R2, cambian solo las variables `S3_*`.
- **Puertos locales:** MySQL 3317, phpMyAdmin 8081, RustFS 9000 (consola 9001), Mailpit 8025.
- **Node:** 24 LTS en Docker y `engines`. Backend y frontend con `package.json` propio, sin workspaces. El worker vive en `backend/src/worker/`.
- **Zonas (4):**
  - `mostry.com.ar` → **sitio**: presentación de Mostry y registro de vendedores.
  - `<slug>.mostry.com.ar` → tienda pública y `/panel` (ej: `heladeria.mostry.com.ar`). Slugs en minúscula.
  - `admin.mostry.com.ar` → admin.
  - `api.mostry.com.ar` → **API**, con **CORS** con lista blanca (`mostry.com.ar`, `*.mostry.com.ar`, orígenes de dev).
- **Sesiones:** cookie host-only de `api.mostry.com.ar` (`httpOnly`, `Secure`, `SameSite=Lax`), servida por un servicio de sesiones común a todas las zonas. Las tiendas se resuelven por el header `Origin`. Cada request autenticada verifica que el usuario sea miembro de esa tienda. El admin usa una cookie aparte.
- **Ingreso solo con contraseña** (decisión de Pedro, Etapa 11; reemplaza al 2FA): sin app autenticadora ni códigos de recuperación.
  - Código de 6 dígitos por email (10 min, máximo 5 intentos) para verificar el email al registrarse y para recuperar la contraseña.
  - Las acciones sensibles piden la contraseña de nuevo: cambiar la contraseña o el alias de cobro.
- **Encargo sin seña:** `pendiente_confirmacion → confirmado → en_preparacion → en_camino | listo_retirar → entregado` (`cancelado` antes de `entregado`).
- **Modelo:** `productos.categoria_id` (opcional), `tiendas.costo_envio` y `zona_envio`, `pedidos.costo_envio`, `tiendas.ultimo_numero_pedido`, `movimientos_caja.caja_id` nulo para transferencias fuera de caja.
- **Panel con los colores de la tienda** (decisión de Pedro, Etapa 11; pisa la sección 8): la paleta elegida se aplica a la vidriera y al panel. El panel muestra el logo de la tienda (o el de Mostry si no tiene).
- **Logos normalizados:** al subirlo se recorta el borde vacío y se centra en un cuadrado de 512 px; en pantalla va entero (sin recortes) dentro de un círculo del mismo tamaño para todas las tiendas.
- **Avisos y movimiento:** avisos flotantes propios al estilo Sonner (`shared/avisos`), animaciones con transform/opacity y curvas fuertes (tokens `--ease-*`), y selector de hora propio con ruedas en lugar del reloj del navegador.
- **Etapa 14 (refinar el frontend):**
  - **Textos neutros** en la vidriera para todos los rubros (nada de "recién horneado").
  - **Fechas** siempre con el selector propio (`shared/ui/SelectorFecha`), nunca `type="date"`.
  - **Carga por pantalla:** cada pantalla del panel, admin, cuenta y compra baja recién al abrirla (`cargarPantalla`); `src/shared` va en un solo chunk (`compartido`).
  - **Script del tema en línea**, autorizado en la CSP por su hash sha256 (`config/temaEnLinea.js`). El servidor de producción tiene que usar `encabezados.config.js` tal cual.
  - **PWA:** el panel es instalable (`vite-plugin-pwa`) y el service worker se registra solo desde el panel. Guarda únicamente la app; **la API y las fotos nunca se cachean**. Cuando hay versión nueva, avisa con "Actualizar" en lugar de recargar sola. Los íconos salen de `scripts/iconos.sh`.
  - **Sin conexión:** franja fija en todas las zonas. Los GET iguales que están en vuelo se comparten, sin caché de datos.
- **Admin y soporte (decisión de Pedro, después de la Etapa 14):**
  - **Ingreso:** desde el "Ingresar" de la landing. Si la cuenta es admin, va a `admin.mostry.com.ar` con su sesión aparte.
  - **Privacidad:** el admin ve solo suscripción, estado y fechas. Nunca ve ventas, caja, gastos, fiados ni datos de compradores.
  - **WhatsApp a cada tienda:** con plantillas editables desde el dashboard (se guardan en la base): vencimiento de la prueba, próximo vencimiento, encuesta y personalizado. Cada mensaje se puede editar antes de mandarlo con `wa.me`, sin API. Las tiendas que vencen en 1 o 2 días aparecen arriba.
  - **Reportes del comercio:** texto más captura opcional (jpg/png, 5 MB, en el bucket privado). Llegan al dashboard con estado (nuevo, en curso, resuelto) y tienen un botón para avisar por WhatsApp a `VITE_WHATSAPP_MOSTRY`.
  - **Modo soporte con permiso:** el comerciante da acceso por 1 hora. Con eso el admin edita solo catálogo, categorías, fotos, horarios y config de la tienda. Todo queda registrado y el comerciante lo ve.
  - **Cómo quedó (Etapa 14.5):**
    - **Migraciones:** `0034` (plantillas_mensaje), `0035` (reportes), `0036` (accesos_soporte) y `0037` (registro_soporte).
    - **Ingreso desde la landing:** `POST /auth/login` con Origin del sitio devuelve `destino`: `admin`, o la lista de tiendas del usuario.
    - **Modo soporte:** `/admin/soporte/:tiendaId/*` monta solo catálogo, horarios y `tienda/config` sin alias, más el logo. `accesoSoporte` exige el permiso vigente y `registrarSoporte` anota cada cambio antes de responder.
    - **Frontend:** reusa las pantallas del panel con el contexto `BasePanel` (`{ api, rutas, soporte }`).
    - **Capturas de reportes:** el barrido de huérfanos las cuenta como archivos en uso, y se borran al resolver el reporte.
- **Horarios:** cada día puede estar Cerrado, Con horario o "Las 24 horas". "24 horas" se guarda como 00:00–24:00; si la tienda sigue abierta todo el día siguiente, `cierraA` es `null` ("Abierto las 24 horas").
- **Modo oscuro en todas las zonas:** "Automático" (sigue al dispositivo), "Claro" u "Oscuro"; se guarda por navegador. Botón en cada header y selector en Panel → Más → Apariencia. Los colores de la tienda se aclaran a un tono pastel con texto oscuro. Todo color sale de `tokens.css` (sin hex sueltos) y cada par texto/fondo cumple 4.5:1 en los dos modos.
- **Tests de punta a punta (Etapa 13):** carpeta `e2e/` con su propio `package.json` (Playwright). Levantan su propia API (puerto 3100, base `mostry_e2e`) y su propio frontend (5273); los mails van a Mailpit. Se corren con `npm test` desde `e2e/`.

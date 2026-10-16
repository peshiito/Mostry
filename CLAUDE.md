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
7. **Git lo maneja Pedro** (init, commits, push). Claude no corre git: cada 1–2 etapas (o tras una pesada) sugiere que es hora de un commit y propone el mensaje en español. **Excepción:** si Pedro pide explícitamente "hacelo vos", Claude lo hace, pero antes verifica que no haya ningún `.env` en lo agregado ni en el historial (`git log --all --oneline -- .env frontend/.env`).
8. **Hablame en español rioplatense (voseo)**, corto y concreto.
9. **Todo trabajo nuevo arranca en modo plan.** Cuando acordamos algo para hacer (una etapa, una mejora), Claude entra al modo plan, arma el plan y lo corregimos juntos. Recién cuando Pedro lo aprueba se pasa al modo automático para hacerlo.

---

## 1. Mi entorno

- **SO:** CachyOS (Arch Linux). Paquetes con `pacman` o `paru`/`yay`.
- **Shell:** **fish**. La sintaxis bash (`VAR=$(...)`, `if/fi`, `export X=Y`) falla. Si me das comandos para pegar, que sean compatibles con fish o envolvelos en `bash -c '...'`.
- **Terminal:** kitty. **Máquina:** i5-8350U, 16 GB RAM.
- **Ruta del proyecto:** `~/Escritorio/Programacion/Proyectos/Mostry/` (los backups de datos van al lado, en `~/Escritorio/Programacion/Proyectos/Mostry-Backup/`).
- **Docker:** Docker Desktop (no comparte `/tmp`; ver sección 15).
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

**Modelo de negocio:** 7 días de prueba gratis con todo incluido; después $10.000 por mes. El comercio paga por transferencia al alias de Mostry y yo activo el plan a mano desde el panel de admin.

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
- **Todo encargo entra "por aceptar"** (`pendiente_confirmacion`, Encargos 2). La tienda lo acepta o lo rechaza (rechazar es cancelar con motivo).
- La seña es opcional y se configura como porcentaje. **Se pide recién al aceptar el encargo**: ahí arranca el plazo de 24 h, con el mismo flujo de comprobante.
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
- **Prueba:** 7 días, con avisos por banner y email 3 días y 1 día antes del vencimiento (funcionan por horas restantes).
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

## 12. Dónde estamos y cómo arrancar cada sesión

**Estado (2026-10-13):**
- Etapas 1 a 15 terminadas, más la Etapa 14.5 (admin, soporte, reportes, WhatsApp y 24 h).
- **`v1.0.0`** está en `main` (tag subido a GitHub). **Se trabaja en la rama `desarrollo`.**
- **Nada está publicado en internet.**
- **La Etapa 16 (producción) está EN PAUSA hasta que Pedro lo decida.** Antes quiere recorrer el sistema con la demo y armar una **etapa de mejoras** con lo que vea.

**Al empezar una sesión:**
1. Leé este documento y el `README.md`.
2. Fijate en qué rama estás (`git branch --show-current`).
3. Preguntale a Pedro qué quiere ver o mejorar.
4. No arranques nada nuevo sin su OK.

**Comandos de todos los días** (desde la raíz; Pedro usa fish):

| Para qué | Comando |
|---|---|
| Arrancar todo sin tocar los datos | `npm run dev` (igual que `npm run local`) |
| Base de cero + seed + demo + arrancar | `npm run local:todo` (pide confirmación: borra la base local) |
| Solo cargar la demo | `cd backend; and npm run db:demo` |
| Backup / restaurar | `npm run backup` · `npm run restaurar -- <archivo.sql.gz>` |
| Tests | `cd backend; and npm test` (~27 min) · `cd frontend; and npm test` · `cd e2e; and npm test` (~6 min) |
| Lint (incluye el límite de 70 líneas, también en CSS) | `npm run lint` en `backend/` y `frontend/` |
| Capturas de los estados (carga y error) | `cd e2e; and npx playwright test -c capturas.config.js` |
| Probar la versión de producción en local | ver `docs/produccion.md` (Caddy en https) |

**Direcciones locales:**
- landing: `http://mostry.localhost:5173`;
- tienda: `http://dona-rosa.mostry.localhost:5173`;
- panel: `…/panel`;
- admin: `http://admin.mostry.localhost:5173`;
- API: `http://api.mostry.localhost:3000`;
- Mailpit: `http://localhost:8025`;
- phpMyAdmin: `http://localhost:8081`;
- consola de RustFS: `http://localhost:9001`.

`localhost:5173` sin subdominio redirige a la landing.

**Cuentas de prueba** (clave = `SEED_CLAVE` del `.env`, por defecto `mostry-demo-2026`):
- `admin@mostry.test` (admin);
- `rosa@dona-rosa.test`: Doña Rosa, activa, con la demo completa;
- `martin@heladeria.test`: Heladería, en prueba por vencer.

**En curso (2026-10-14).** Pedro pidió trabajar en modo automático y avisarle por notificación si hace falta algo. El plan completo está en `~/.claude/plans/goofy-zooming-clarke.md`.
- **Hecho, sin commitear:**
  - Mejoras 3, Parte B (formas de stock);
  - Mejoras 4 (el admin ayuda con la cuenta y elimina tiendas).
- **Mejoras 3, Parte A (preguntas "Armá tu Mostry" y módulos):** HECHA y probada.
  - **Backend:** migración `0041`, `PUT /panel/tienda/perfil`, `requiereModulo` y `requerirVentaOnline`, más tests.
  - **Frontend:**
    - `features/empezar/` (`PantallaEmpezar` si `configuradaEn` es null y `PantallaUso` en Más);
    - Más e inicio filtrados por el perfil;
    - `TarjetaPresentacion` sin venta online;
    - el admin muestra rubro y venta online.
  - **e2e:** `perfilNegocio.spec.js`; además, el registro recorre las preguntas.
- **Mejoras 3, Parte C (venta rápida):** HECHA y probada.
  - **Backend:** migración `0042` (`ventas`, `venta_items` y el origen `venta` en la caja), `POST/GET /panel/caja/ventas` (`modules/caja/ventas/`).
  - **Frontend:** `features/vender/` y la pestaña "Vender" (sin venta online, salvo que haya pedidos por aprobar).
  - **e2e:** `ventaRapida.spec.js`.
- **Mejoras 3 COMPLETA.** Suites: backend 373/373, frontend 129/129, e2e 74/74.
- **Etapa "Lealtad"** (club de clientes con QR y sellos), arrancada el 2026-10-13. El plan completo está en **`docs/lealtad-plan.md`**: leelo entero antes de seguir.
  - **L1 a L5: HECHAS (2026-10-14), sin commitear.** Pedro pidió hacerlas de corrido (aprobé yo los planes de L3–L5, con su permiso). Migraciones `0043` a `0047`, `modules/club/{cuenta,qr,programa,sellos,canjes,historial}`, `features/{club,clubPanel}` y el escáner en `features/vender/`.
- **Avisos 1 (2026-10-16):** notificaciones push al celular del comercio y resumen de la mañana por push y mail. Detalle en §13.
- **Encargos 2 y 3 (2026-10-15):** aceptar antes de cobrar, personalización con foto, cupo por día, encargos cargados desde el panel y anticipación por producto. Detalle en §13.
- **Cuentas de prueba en la base local** (cargadas a mano el 2026-10-15, clave `prueba12345`): `tienda@prueba.test` (tienda vacía `prueba`, en prueba gratis) y `cliente@prueba.test` (cliente del Club).
- **En la base local:** el admin es `pedrotest@gmail.com` (clave `test12345`, cargada a mano). El seed sigue creando `admin@mostry.test`.
- **Mails en local:** Resend con `onboarding@resend.dev` solo entrega a `pedrogbaez1@gmail.com`. Pasar a Mailpit está pendiente; Pedro dijo "lo vemos en el transcurso".

**S1 · Pre-salida: HECHA (2026-10-16).** Detalle en §13. Rotar las claves de Resend y ElevenLabs y pasar el repo a privado quedaron **fuera** por decisión de Pedro: siguen pendientes antes de producción.
- **Después de la S1:** S2 legal → S3 seguridad → S4 producción → S5 piloto → S6 lanzamiento (`docs/plan-salida.md`).
- **Hosting de producción:** sigue sin decidir. Railway cuesta unos 5 USD por mes; Oracle Always Free es gratis, pero hay que configurarlo más.

**Plan de salida (2026-10-16): leé `docs/plan-salida.md` antes de seguir.**
- **Etapas:** S1 pre-salida (claves, repo privado, prueba de 7 días, días de cortesía, pedidos gratis del Club) → S2 legal (términos, privacidad, cookies, factura C por cada pago) → S3 seguridad de salida (HTTPS forzado, HSTS, repaso) → S4 producción (staging y producción, Resend con dominio, hosting gratis o casi) → S5 piloto (el negocio de bebidas de la familia de Pedro y 2 o 3 más) → S6 lanzamiento (video y guía corta).
- **No se suman funciones nuevas** hasta el piloto, salvo las de S1 y S2.

**Pendientes abiertos (consultar con Pedro antes de tocar):**
- Pasar el repo de GitHub a **privado**.
- Rotar la clave de **Resend** antes de producción.
- **Contador de pedidos en el detalle del admin:** se sacó por privacidad. ¿Lo quiere de vuelta?
- **Tienda suspendida:** no puede mandar reportes ni dar acceso de soporte (el panel queda en solo lectura). ¿Está bien así?
- **El banner "Mostry tiene acceso de soporte"** del panel se actualiza al recargar, no en vivo.
- **Mejoras de tipos sugeridas** por la revisión:
  - `req.panel` como unión discriminada miembro/soporte (hoy hay `req.soporte` aparte y el helper `miembroDelPanel`);
  - columnas inmutables en `accesos_soporte` y `reportes`.
- **`npm run local:todo`** se probó por partes, no completo sobre la base real de Pedro (su base está respaldada en `Mostry-Backup`).
- **El logo de Mostry ya es el oficial**, vectorizado. Si Pedro pasa una versión nueva: `bash frontend/scripts/iconos.sh` regenera los íconos.

---

## 13. Decisiones tomadas en todas las etapas (pisan lo anterior donde se contradiga)

Las decisiones de la Etapa 1 están detalladas en `docs/etapa-1-refinamiento.md` (lo no listado acá se aprobó tal cual la propuesta de ese archivo). El resto se fue sumando etapa por etapa. Otros documentos: `docs/ataqueE12.md` (seguridad) y `docs/produccion.md` (producción).

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
  - **PWA:** el panel es instalable (`vite-plugin-pwa`) y el service worker se registra solo desde el panel (y, desde Lealtad L1, desde `/club` con su propio manifest). Guarda únicamente la app; **la API y las fotos nunca se cachean**. Cuando hay versión nueva, avisa con "Actualizar" en lugar de recargar sola. Los íconos salen de `scripts/iconos.sh`.
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
- **Logo oficial vectorizado** (a partir de los PNG de Pedro en `frontend/src/Logos/`):
  - **Archivos:** `logoMostry.svg` (toldo + palabra) y `LogoMostryToldo.svg`. Cada uno tiene una versión "de noche", igual al PNG, y una `-claro`, con borde verde para fondos claros.
  - **En la app:** `shared/ui/logo/` (`Toldo`, `PalabraMostry`, `formas.js`), con colores desde los tokens `--logo-*`. En modo oscuro y sobre fondos verdes usa la paleta del PNG.
  - **Favicon e íconos de la PWA:** el toldo de noche sobre `#0D1411`, generados con `scripts/iconos.sh`.
- **Horarios:** cada día puede estar Cerrado, Con horario o "Las 24 horas". "24 horas" se guarda como 00:00–24:00; si la tienda sigue abierta todo el día siguiente, `cierraA` es `null` ("Abierto las 24 horas").
- **Etapa 15 (cierre, versión 1.0.0):**
  - **Organización:** una sola carpeta con ramas: `main` es la estable, la que va a producción, y `desarrollo` es la de trabajo. Las ideas de mejora van en ramas propias. Los datos se respaldan en `../Mostry-Backup`, que es una carpeta de datos, no de código. Local y producción difieren solo en su `.env`; las claves reales de producción van en el panel de Railway.
  - **Local:** `npm run local:todo` (en la raíz) borra la base, carga el seed y la demo (`npm run db:demo`) y arranca todo. `npm run local` arranca sin borrar nada.
  - **Backups:** `npm run backup` / `npm run restaurar`. El script de restaurar verifica el dump y el conteo de filas, y por defecto restaura en `mostry_restaurada`. El worker guarda los suyos en `backups/<BACKUP_ENTORNO>/` (`BACKUP_ENTORNO` es obligatoria en producción).
  - **Producción:**
    - `backend/Dockerfile` con dos destinos: `api`, y `worker` con `mysqldump`.
    - `frontend/Dockerfile`, que sirve los archivos con `servidor/servir.js` y los encabezados de `encabezados.config.js`.
    - `docker-compose.prod.yml` y las plantillas `.env.produccion.example`.
    - El admin real se crea con `npm run admin:crear:prod`.
    - Para probar la versión de producción en local: `docker-compose.prueba-prod.yml`, con Caddy en https.
    - La guía completa está en `docs/produccion.md`.
- **Mejoras 1 (estados de carga y error, 2026-10-13):**
  - **Errores por tipo:** `shared/errores/tipoError.js` y `textos.js` (sin conexión, servidor, mantenimiento, permiso, límite, sesión, no existe). `ErrorCarga` recibe `error`; `NoEncontrada` recibe `zona` y `consulta`, y solo dice "no existe" si la API respondió 404.
  - **Red de seguridad:** `RedSeguridad` en `main.jsx` y en los layouts. Si falla la descarga de una pantalla, recarga una vez (versión nueva).
  - **Sesión vencida:** `cliente.js` emite `mostry:sesion-vencida` y `VigiaSesion` lleva al ingreso, que después vuelve a la misma pantalla.
  - **Carga real, sin ruedita:** barra mostaza arriba que avanza por tareas terminadas (`shared/carga`), subidas con XHR y porcentaje (`useSubida` + `BarraSubida`), esqueletos con forma (`shared/ui/esqueletos`) y `Boton textoCargando`.
  - **Capturas para revisar:** `npx playwright test -c capturas.config.js` desde `e2e/`. Quedan en `~/.cache/mostry-capturas`.
- **Mejoras 2 (animaciones, 2026-10-13):**
  - **Motion 14** (`motion`, decisión de Pedro). Componentes `m.*` de `motion/react-m` dentro de `LazyMotion strict`. Las funciones (`domMax`) se bajan aparte, desde `src/movimientoDiferido/`. Ese archivo va **fuera de `src/shared`** a propósito: si no, cae en el bloque `compartido` y se baja al arrancar. Si no llegan, `data-sin-movimiento` muestra todo sin animar.
  - **Piezas en `shared/movimiento/`:** `PastillaActiva` (fondo que se desliza en pestañas, chips, segmentado y menús), `TransicionRuta`, `ListaAnimada`/`ItemAnimado` (`reacomodar` solo en listas que cambian de a un ítem; las que se filtran cambian de `key`), `useContar`/`Contador`/`Monto animado`, `NumeroQueRueda`, `CheckDibujado` y `temaConTransicion`.
  - **Reglas:**
    - en el panel y la tienda, la transición entre pantallas es solo un fundido, porque tienen barras fijas adentro;
    - un ítem hijo de `AnimatePresence` tiene que pasar su `ref` hasta el DOM;
    - el e2e corre con `reducedMotion: 'reduce'` (las animaciones se prueban en `movimiento.spec.js`).
  - **Peso:** +19 KB gz al arrancar y +32 KB gz después de mostrar la pantalla.
- **Club Mostry (Lealtad L1, 2026-10-13):**
  - **El cliente con cuenta es un tercer tipo de usuario,** con tablas propias (`clientes`, `sesiones_club`, `codigos_email_club` y `codigos_club`) y sin `tienda_id`.
  - **Cookie `__Host-mostry_club`:** dura 90 días y se desliza. `requerirCliente` la lee sin mirar la zona, porque el checkout de las tiendas la va a usar en L3. Registro e ingreso solo desde el sitio (`exigirSitio`).
  - **QR, cambio sobre el plan:** el código de 6 caracteres sale de `HMAC(clienteId, ventana de 5 min)` (`qr/codigoQr.ts`), se guarda como HMAC en `codigos_club` y sirve 1 minuto más después de rotar. `clienteDelCodigo` (para L3) lo busca. No hay `secreto_qr`. La API manda `quedanMs` para que el celular cuente con su reloj.
  - **Alta segura:** verificar el email pide también la clave del registro, que pasa del registro a la verificación en memoria (`lib/claveDelRegistro.js`). Registrarse de nuevo sobre una cuenta sin verificar pisa la clave y los datos. Así nadie se queda con un email ajeno y el email no queda bloqueado.
  - **Borrar la cuenta** es un borrado real (Ley 25.326) y pide la clave.
  - **El job `limpiar-club`** (cada hora) borra los códigos y las sesiones vencidas, y los registros que pasaron más de un día sin verificar.
  - **Frontend:** la PWA del Club tiene su propio manifest (`public/club.webmanifest`, `registrarPwa(manifest)`). El QR se dibuja con `uqr` (`encode`), con `<rect>` y sin innerHTML, en colores fijos (`--qr-fondo` y `--qr-modulo`).
- **Club Mostry (Lealtad L2 a L5, 2026-10-14):**
  - **Un solo interruptor:** `tiendas.usa_club` (apagado por defecto), como los otros módulos; se prende desde Más → Club de clientes o desde "Qué uso de Mostry". Prender exige un premio guardado. Apagarlo no borra nada. El modo soporte del admin no toca el club.
  - **Programa** (`programas_lealtad`, uno por tienda, y `premios_lealtad`, de 1 a 6 escalones crecientes): `PUT /panel/club` guarda todo junto; `PATCH /panel/club/activo`. La vidriera recibe `club` en `/publico/tienda` solo si está prendido y con premios (`FranjaClub`, también en la tarjeta de presentación).
  - **Sellos** (`sellos`, UNIQUE por compra): uno por pedido **entregado** (`alEntregar.ts`) o venta del local que llegue al mínimo, con el club prendido. Pedidos y ventas tienen `cliente_id`. El checkout reconoce la cookie del club con `clienteOpcional` (sin exigirla) y precarga los datos.
  - **En el local:** `POST /panel/club/identificar { codigo }` (con límite) devuelve una **ficha firmada** (`sellos/fichaClub.ts`: HMAC de tienda, cliente y vencimiento, 30 min) y la venta manda `fichaClub`. Así el QR puede rotar mientras cargan los productos y el navegador nunca manda un id que el servidor no firmó. Escáner con `BarcodeDetector` (`useEscaner`) o el código tipeado; por eso `Permissions-Policy` permite `camera=(self)`.
  - **Saldo calculado:** sellos no vencidos (`vence_meses`) con `id` mayor al `hasta_sello_id` del último canje no anulado (`sellos/saldo.ts`). Usar un premio gasta todos los sellos; la compra que lo usa suma el primero nuevo.
  - **Canjes** (`canjes`, el premio copiado): `bloquearPrograma` (FOR UPDATE de `programas_lealtad`) va como **primera consulta** de la transacción del checkout y de la venta. Con REPEATABLE READ la foto se toma en la primera lectura común: si se bloqueara después, el segundo canje no vería el primero y gastaría los mismos sellos (`tests/revision.test.ts`). El descuento lo calcula el servidor (`calcularDescuento.ts`, igual que `club/lib/descuento.js` del frontend): porcentaje de los productos (sin envío) con tope, monto hasta el subtotal, regalo $ 0. Pedido cancelado → `anularCanje` y los sellos vuelven.
  - **Compra gratis:** `pedidos.descuento` y `ventas.descuento`; el CHECK de pedidos pasó a `total + descuento = subtotal + costo_envio`. Un pedido inmediato que queda en $ 0 va a `pendiente_confirmacion` (sin pago) y al confirmarlo se descuenta el stock; una venta en $ 0 no mueve la caja.
  - **Historiales:** `GET /club/historial` (cliente, todas sus tiendas), `GET /panel/club/socios` y `/socios/:id` (la tienda: solo el nombre y lo comprado ahí; 404 si nunca le compró). El admin ve solo `club: { tiendasConClub, socios }` en métricas.
  - **Resuelto en la S1:** un pedido inmediato gratis que nadie confirma se cancela solo pasado el plazo del comprobante.
  - **Borrar la cuenta del cliente** borra sus sellos y canjes y deja sus pedidos y ventas sin `cliente_id`. `sellos`, `canjes`, `premios_lealtad` y `programas_lealtad` están en `TABLAS_DE_TIENDA`.
- **Encargos 2 (2026-10-15):**
  - **Aceptar antes de cobrar:** el checkout deja todo encargo en `pendiente_confirmacion`, sin plazo. `POST /panel/pedidos/:id/aceptar` (`pedidos/servicios/aceptarEncargo.ts`) lo pasa a `pendiente_pago`, con el plazo de seña, o a `confirmado` si no hay seña. Un encargo con seña no se puede pasar a `confirmado` a mano. `cancelar-vencidos` también cancela los encargos que nadie aceptó cuando pasa su fecha (`pedidos/servicios/vencidos.ts`).
  - **Personalización** (migración `0048`):
    - en el producto: `pide_personalizacion` + `indicacion_personalizacion`, y un CHECK que exige `acepta_encargo`. Pedirla prende el encargo y apagar el encargo la apaga (`formaStock.ts`);
    - en el ítem: `pedido_items.personalizacion`, obligatoria en un encargo de ese producto y prohibida en cualquier otro caso (`personalizacion.ts`);
    - foto de referencia opcional: `POST /publico/pedidos/:token/items/:itemId/foto` (`encargos/fotos/`), solo mientras está por aceptar. Va en WebP al bucket privado y se ve con URL firmada (`GET /panel/pedidos/:id/items/:itemId/foto`). Se borra 7 días después de entregar o cancelar (90 como máximo) con el job `borrar-fotos-referencia`, y cuenta en el barrido de huérfanos y al eliminar una tienda.
  - **Cupo por día** (migración `0049`): `tiendas.cupo_encargos_dia` (nulo = sin límite). El checkout numera el pedido (bloquea la tienda) **antes de cualquier lectura común**, así la foto de REPEATABLE READ se toma con el lock y el conteo ve todo lo confirmado (`encargos/cupo.ts`). No usa `FOR SHARE`, para no tomar locks de rango que se crucen entre tiendas. De diez encargos a la vez por el último lugar entra uno solo. La disponibilidad devuelve `motivo: 'sin_cupo'`.
  - **Frontend:**
    - panel: bloque "Por aceptar" en Encargos; Aceptar y Rechazar en el detalle, con la personalización y "Ver foto de referencia"; "Pide personalización" en el producto; "Máximo de encargos por día" en Mi tienda;
    - vidriera: la personalización y la foto se cargan en el paso del encargo (`checkout/components/Personalizar.jsx`) y la foto se sube después de crear el pedido (`useConfirmarEncargo`). El seguimiento avisa "Esperando que … acepte tu encargo".
  - **Las docenas son productos aparte** ("Docena surtida"): decisión de Pedro, no hay unidad de venta.
- **Avisos 1: notificaciones push al teléfono del comercio (2026-10-16):**
  - **Por qué:** el comerciante cierra la notebook y no se entera de un pedido de la noche. El aviso tiene que llegarle **al celular** y, además, a la mañana tiene que recibir un resumen.
  - **Suscripciones** (`modules/avisos/`, migración `0051`):
    - una por teléfono, tienda y usuario (`suscripciones_push`), con `endpoint`, `p256dh` y `auth`;
    - rutas `GET /panel/avisos`, `POST /panel/avisos/suscripciones`, `POST /panel/avisos/suscripciones/baja`, `PUT /panel/avisos/silencio` y `POST /panel/avisos/probar`;
    - el modo soporte da 403 (`miembroDelPanel`);
    - **anti-SSRF:** solo se aceptan endpoints https de FCM, Mozilla, Apple y Windows (`endpointPermitido.ts`). `AVISOS_HOSTS_EXTRA` es solo para tests y en producción está prohibida.
  - **Cola** (`avisos_push`):
    - el checkout y el comprobante encolan **en su transacción**, con una clave única por tienda (`encolar.ts`);
    - el controlador despacha al toque después de responder (`despachar.ts`, que en los tests no corre solo);
    - el job `enviar-avisos` (cada minuto) es la red de seguridad: deja 20 s a la API y reclama cada aviso con un UPDATE atómico, así nunca se manda dos veces;
    - el texto se arma al mandar (`textos.ts`), con el número y el nombre de pila: sin plata, dirección ni token;
    - opciones del envío: TTL de 6 h, `urgency: high` y `topic`/`tag` por pedido;
    - un 404/410 borra el teléfono; con otros errores se reintenta a los 5 minutos, hasta 5 veces;
    - los encargos cargados desde el panel no avisan.
  - **Horario de silencio** (`miembros_tienda.silencio_desde/hasta`, puede cruzar la medianoche): el aviso llega igual, pero `silencioso`, sin sonido.
  - **Resumen de la mañana** (job `resumen-manana`, cada 15 min):
    - **cuándo:** desde la hora de apertura de hoy y hasta 3 h después; si ese día no abre o es feriado, a las 9. No se manda si la tienda está pausada o suspendida;
    - **qué:** push y **mail** a los dueños (`enviarAviso.ts`) con los comprobantes para revisar, los encargos por aceptar y los encargos de hoy. El mail va aunque el dueño no tenga avisos activados;
    - una vez por día (clave `resumen:AAAA-MM-DD`).
  - **Claves VAPID** en `.env`, generadas con `npm run avisos:claves` (en `backend/`). Son obligatorias en producción; sin claves no se manda nada y el panel lo dice. **No se cambian después**, porque los teléfonos suscriptos dejarían de recibir.
  - **Frontend:**
    - `public/avisos-sw.js`, sumado con `workbox.importScripts`: el push muestra el aviso con la insignia `iconos/insignia-96.png` (generada por `scripts/iconos.sh`) y el número en el ícono (`setAppBadge`); tocar el aviso abre o enfoca el panel en el pedido;
    - Más → Avisos en el teléfono (`features/avisos/`), con el paso a paso para iPhone (tiene que estar instalado) y para cuando el permiso está bloqueado;
    - la tarjeta del inicio invita a activarlos (se puede cerrar);
    - `useSincronizarAvisos` renueva la suscripción al abrir el panel; al cerrar sesión se borra la de ese teléfono.
  - **Para "Avisos 2":** el recordatorio de "encargo sin aceptar hace 2 h" y los encargos de mañana a la noche.
- **Encargos 3 (2026-10-15):**
  - **Encargo cargado desde el panel** (`POST /panel/encargos`, `encargos/manual/`): lo que llegó por WhatsApp o en persona. Entra ya aceptado: si el dueño anota la seña cobrada (monto y medio), queda en `pago_aprobado` y la seña entra a la caja en la misma transacción (en efectivo exige la caja abierta). Sin seña, queda en `confirmado`. El dueño manda: sin anticipación, horario ni cupo, solo con fecha futura y dentro de 60 días. La personalización es opcional. `pedidos.origen = 'panel'` (migración `0050`) se muestra como "cargado por vos". Pantalla: Panel → Encargos → Cargar (`PantallaNuevoEncargo`), que lista productos con `/panel/productos?encargo=true`.
  - **Anticipación por producto** (`productos.anticipacion_horas`, nulo = la de la tienda): vale la mayor entre la tienda y los productos (`encargos/anticipacion.ts` en el backend y `checkout/lib/anticipacion.js` en el frontend). La disponibilidad recibe `&productos=1,2`.
- **S1 · Pre-salida (2026-10-16):**
  - **Prueba gratis de 7 días** (`DIAS_PRUEBA` en `auth/servicios/verificacion.service.ts`). Las tiendas que ya estaban en prueba conservan su fecha.
  - **Días de cortesía** (migración `0052`): `POST /admin/tiendas/:id/cortesia { dias 1..60, motivo }` (`admin/servicios/cortesia.service.ts`).
    - Sin plan pago todavía, corre `prueba_hasta`; si no, `plan_hasta` desde max(fechas, ahora) y vuelve a `activa`. Una suspensión manual se respeta: suma los días pero sigue suspendida.
    - Es una fila de `pagos_suscripcion` con `tipo = 'cortesia'`, monto 0 y el motivo en `nota`, más la constancia en `registro_admin`. Las métricas y el resumen de tiendas eliminadas cuentan solo `tipo = 'pago'`.
    - Admin: botón "Regalar días" en el detalle (`HojaCortesia.jsx`: 7, 10, 15 u "Otro").
  - **Pagos en Suscripción del comercio:** `GET /panel/tienda/suscripcion/pagos` (`pagosTienda.repository.ts`). Muestra pagos y cortesías ("🎁 Cortesía · +N días" con el motivo). La nota de un pago es interna y no se manda.
  - **Pedidos gratis del Club:** un pedido inmediato en `pendiente_confirmacion` que nadie confirma en `plazo_comprobante_horas` lo cancela `cancelar-vencidos` ("Nadie confirmó el pedido a tiempo"); se libera la reserva y vuelven los sellos.
  - **Landing:** el Club figura en el plan ("sin costo extra") y en las preguntas frecuentes.
- **Formas de stock (Mejoras 3, Parte B):** cada producto tiene `modo_stock`:
  - `unidades`: reserva y descuenta, como siempre;
  - `simple` ("hay / no hay"): no cuenta ni reserva; se corta con `agotado`;
  - `a_pedido`: solo se encarga, y un CHECK exige `acepta_encargo`.
  - La tienda tiene una forma por defecto.
  - `pedido_items.reservo` anota si el ítem reservó, así liberar y descontar funciona aunque el producto cambie de forma. Es un dato interno, que se lee con `pedidosRepo.itemsDeStock` y nunca se muestra.
- **Mejoras 4 (el admin ayuda y elimina, decisión de Pedro; pisa "nada se borra de verdad" de la sección 5):**
  - **Ayuda con la cuenta** (`modules/admin/ayuda/`):
    - corregir email y nombre del dueño (el email nuevo queda verificado y se cierran sus sesiones);
    - corregir nombre, link y WhatsApp de la tienda;
    - **clave temporal:** se muestra una sola vez y marca `usuarios.debe_cambiar_clave`; el panel queda bloqueado (403 `debe_cambiar_clave`) hasta elegir una nueva con `/auth/cambiar-clave`;
    - reenviar el mail: el código de verificación si nunca verificó, o el de recuperación.
    - Todo queda en `registro_admin`.
  - **Eliminar** (`DELETE /admin/tiendas/:id`): solo tiendas suspendidas o registros sin verificar, escribiendo el link y la contraseña del admin.
    - Borra todas las tablas de `tiendas/borrado/tablasDeTienda.ts` y la cuenta del dueño si no tiene otra tienda.
    - Encola los archivos.
    - Guarda un resumen sin datos personales en `tiendas_eliminadas`, que sigue sumando en las métricas.
    - Un test compara la lista con `information_schema`: **toda tabla nueva con `tienda_id` hay que sumarla ahí** (o a `TABLAS_QUE_SOBREVIVEN`).
  - **Registro sin verificar:** pasada media hora se libera (`registroVencido.ts`) y se puede registrar de nuevo. Antes de eso no se toca, para que nadie pueda registrarse encima de un registro ajeno.
- **Modo oscuro en todas las zonas:** "Automático" (sigue al dispositivo), "Claro" u "Oscuro"; se guarda por navegador. Botón en cada header y selector en Panel → Más → Apariencia. Los colores de la tienda se aclaran a un tono pastel con texto oscuro. Todo color sale de `tokens.css` (sin hex sueltos) y cada par texto/fondo cumple 4.5:1 en los dos modos.
- **Tests de punta a punta (Etapa 13):** carpeta `e2e/` con su propio `package.json` (Playwright). Levantan su propia API (puerto 3100, base `mostry_e2e`) y su propio frontend (5273); los mails van a Mailpit. Se corren con `npm test` desde `e2e/`.

---

## 14. Mapa del código (lo que no es obvio)

**Backend (`backend/src/`):**
- **Aislamiento entre tiendas:**
  - `TiendaId` es un tipo marcado (`shared/db/tiendaId.ts`). Solo se fabrica con `comoTiendaId` en `tiendas.repository.ts`, el seed, el worker y los tests; **ESLint prohíbe `as TiendaId`**.
  - En las tablas va `ColTienda`, que no se puede actualizar.
- **Cadena del panel** (`modules/panel.routes.ts` → `tiendas/middlewares/accesoPanel.ts`): `resolverTienda` (por el `Origin`) → `requerirSesion` → `requerirMiembro` → `bloquearSiSuspendida`.
  - Las rutas leen la tienda con `tiendaDelPanel(req)` (`shared/http/contextoPanel.ts`).
  - Leen al usuario miembro con `miembroDelPanel(req)` (`shared/http/miembroDelPanel.ts`), que en modo soporte da 403.
- **Modo soporte:** `/admin/soporte/:tiendaId/*` (`modules/soporte/`). `accesoSoporte` llena `req.tienda`, `req.panel` y `req.soporte`. Solo monta catálogo, horarios y config sin alias.
- **Cookies:** `__Host-mostry_sesion` (panel) y `__Host-mostry_admin`. El tipo de sesión depende de la zona del `Origin` (`modules/auth/cookies.ts`).
- **Módulos (`modules/`):** auth, tiendas, admin (más plantillas y la cuenta del admin), catalogo, horarios, publico, pedidos, comprobantes, caja, gastos, encargos, libreta, promociones, reportes, soporte, club (cuentas de cliente, QR, programa, sellos, canjes e historiales).
- **Base:**
  - 52 migraciones en `db/migraciones/` (todas con `down`);
  - seed en `db/seed/` (`npm run db:seed`);
  - demo en `db/seed/demo/` (`npm run db:demo`): pasa por la API real dentro del mismo proceso y no entra en el build.
- **Worker:** `worker/tareas.ts`, con una tarea por archivo en `worker/jobs/`. Para correr una sola: `npm run worker:correr -- <tarea>`.
- **Ayudantes de test** (`src/test/`): `appConCuenta`, `tiendaLista`, `crearCuentaCompleta`, `panel(app, slug, cookie)`, `crearAdminLogueado` (expone `cookie`, `get`, `post`, `put`, `patch`, `delete`), `soporteListo`, `limpiarBase`.
- **Config:** Zod en `config/esquema.ts`. En producción exige `ORIGEN_PROTOCOLO=https`, `TRUST_PROXY>0` y `BACKUP_ENTORNO`.

**Frontend (`frontend/src/`):**
- **Zona por subdominio:** `shared/lib/zona.js` (sitio, tienda, admin o desconocida). `main.jsx` elige la app de `apps/`.
- **Datos:**
  - `shared/api/cliente.js` (fetch con cookie);
  - `useConsulta` (GET, comparte los pedidos iguales en vuelo con `getCompartido`, sin caché);
  - `useAccion` (escrituras, con el aviso de éxito).
- **Avisos:** `avisar.exito/error/info` (`shared/avisos/`), con `{ duracion: Infinity, accion }` para avisos fijos.
- **Panel reutilizable:** el contexto `features/panelBase/BasePanel.jsx` (`{ api, rutas, soporte }`). Los hooks usan `usePanelApi()` y `useBasePanel()`, así las mismas pantallas sirven en el modo soporte del admin.
- **Rutas:** son tablas con carga diferida (`apps/panel/rutasPanel.jsx`, `rutasConfig.jsx`, `apps/admin/rutasSoporte.jsx`, con `cargarPantalla` + `import.meta.glob`).
- **Visual:**
  - logo oficial en `shared/ui/logo/` (`Toldo`, `PalabraMostry`, `formas.js`);
  - tema claro u oscuro en `shared/tema/`;
  - colores solo de `shared/styles/tokens.css`.
- **Producción:**
  - `servidor/servir.js` sirve `dist/` con los encabezados de `encabezados.config.js`;
  - el script del tema va en línea, con su hash en la CSP (`config/temaEnLinea.js`).
- **Lint:** `npm run lint` corre ESLint y `scripts/lineas.js` (70 líneas también en CSS; `tokens.css` es la excepción).

**e2e (`e2e/`):**
- API de prueba en el puerto 3100 (base `mostry_e2e`), frontend en el 5273 y build con preview en el 5274 (para la PWA).
- Ayudantes en `apoyo/`: `ingresar`, `esperarAviso`, `ultimoCodigo` (Mailpit), `elegirHoy`, `vencerPrueba` y `registrarPago`.

---

## 15. Trampas conocidas del entorno (ya nos hicieron perder tiempo)

- **Nunca correr dos suites a la vez.** El backend y el e2e comparten la base de test y los buckets `*-test`. Lo mismo vale para `db:demo` sobre `mostry_e2e` mientras corre algo. Si se pisan, fallan tests al azar.
- **La suite del backend tarda unos 27 minutos** (424 tests, desde Lealtad; antes eran 11): con `timeout -k 10 1500` se corta antes de terminar. Usar `timeout -k 10 2400`. Corriendo en segundo plano, vitest no muestra nada hasta el final: hay que esperar el resultado, no darla por colgada.
- **El shell de las herramientas de Claude es zsh, no fish:**
  - no separa una variable en palabras (para repetir un comando largo, usar una función);
  - **`pkill -f` / `pgrep -f` pueden matar el propio shell** porque el patrón aparece en su línea de comandos. Matar por PID con un patrón anclado (`pgrep -f "^node servidor/servir.js"`).
- **Docker Desktop:**
  - no comparte `/tmp` (montar desde `~/.cache` o desde el proyecto);
  - la red "host" no llega a tu máquina (usar `host-gateway` o la red `mostry_default` para llegar a `rustfs`, `mailpit` o `mysql`).
- **Prettier alarga los archivos.** El límite de 70 líneas se controla **después** de correr Prettier.
- **Vitest:** `beforeEach(() => mock.mockReset())` devuelve una función y Vitest la toma como limpieza. Usar llaves: `beforeEach(() => { mock.mockReset(); })`.
- **Vite se reinicia** si cambian `vite.config.js` o un `.env`: si pasa con el e2e corriendo, fallan pruebas por "connection refused".
- **Prueba de producción en local** (Caddy con certificado propio): Chrome no registra el service worker, y las URLs firmadas de los comprobantes apuntan a la red de Docker. En producción real no pasa.
- **gitleaks** marca como "secreto" el texto de ejemplo de `.env.example` y el token de `frontend/src/test/rutas.js`. Están permitidos en `.gitleaks.toml` y con `// gitleaks:allow`.
- **Avisos push en local:**
  - el service worker existe solo en el build, no con `npm run dev`;
  - para probar en la PC: `npm run avisos:claves`, pegar las claves en el `.env`, `cd frontend; and npm run build; and npx vite preview`, y Chrome de escritorio en `localhost`;
  - en un teléfono real hace falta https: se prueba recién en staging;
  - el e2e (`avisos.spec.js`) no manda a Google ni a Apple: el envío lo cubren los tests del backend con el transporte falso (`transportePush`).
- **Herramientas que ya se usaron:**
  - Lighthouse: `npx lighthouse@12` con `CHROME_PATH` apuntando al Chromium de Playwright, en `~/.cache/ms-playwright/`;
  - OWASP ZAP: por Docker, con resultados en `~/.cache/mostry-zap`;
  - Semgrep: `uvx semgrep scan --config p/javascript --config p/typescript --no-git-ignore …`;
  - hadolint y gitleaks: por Docker.


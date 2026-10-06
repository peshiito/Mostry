# Colección de Bruno — Mostry API

1. Instalá Bruno (https://www.usebruno.com) y abrí esta carpeta como colección.
2. Elegí el entorno **local** (arriba a la derecha).
3. Levantá todo: `docker compose up -d` y, en `backend/`, `npm run db:reset` y `npm run dev`.
4. Logueate con **01 Auth → Login** (email y contraseña).
5. Listo: el resto de los requests usa la cookie que quedó en `{{cookie}}`.

**Por qué la cookie va a mano:** la sesión usa una cookie `__Host-` con `Secure`
(sección 7). Para no debilitar eso en desarrollo, un script la toma de la respuesta
del login y la manda en el header `Cookie`.

**Origin:** cada request manda el `Origin` de su zona (tienda, sitio o admin):
así es como la API sabe de qué tienda se trata y frena CSRF.

Los emails (códigos de verificación y de recuperación) llegan a Mailpit:
http://localhost:8025

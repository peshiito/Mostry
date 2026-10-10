#!/usr/bin/env bash
# Levanta Mostry en local: Docker (MySQL, RustFS, Mailpit), API, worker y frontend.
#   npm run local        → arranca sin tocar los datos
#   npm run local:todo   → BORRA la base local y carga la demo (pide confirmación)
# Ctrl+C corta todo. Funciona igual desde fish (es un script de bash).
set -euo pipefail
cd "$(dirname "$0")/.."

# 1. Archivos de configuración: si faltan, se copian de las plantillas (sin secretos).
for f in .env frontend/.env; do
  if [ ! -f "$f" ]; then cp "$f.example" "$f"; echo "✔ Creé $f a partir de $f.example"; fi
done

# 2. Dependencias de cada paquete, solo si no están instaladas.
for d in backend frontend; do
  [ -d "$d/node_modules" ] || (echo "Instalando dependencias de $d…" && cd "$d" && npm ci)
done

# 3. Servicios de Docker y espera a que MySQL esté listo.
docker compose up -d
echo -n "Esperando a MySQL"
until [ "$(docker inspect -f '{{.State.Health.Status}}' mostry-mysql-1 2>/dev/null)" = healthy ]; do
  echo -n "."; sleep 2
done
echo " listo"

# 4. Base: migraciones siempre; con --demo, base de cero + seed + demo.
if [ "${1:-}" = "--demo" ]; then
  read -r -p "Esto BORRA la base local y carga la demo. ¿Seguro? (s/N) " ok
  [ "$ok" = "s" ] || { echo "Cancelado."; exit 1; }
  (cd backend && npm run db:reset && npm run db:demo)
else
  (cd backend && npm run db:migrar)
fi

# 5. API, worker y frontend juntos; Ctrl+C corta los tres.
trap 'kill 0' INT TERM EXIT
(cd backend && npm run dev) &
(cd backend && npm run worker) &
(cd frontend && npm run dev) &
cat <<'TXT'

  Mostry corriendo en local:
    Landing      http://mostry.localhost:5173
    Tienda       http://dona-rosa.mostry.localhost:5173
    Panel        http://dona-rosa.mostry.localhost:5173/panel
    Admin        http://admin.mostry.localhost:5173
    Mails        http://localhost:8025
    phpMyAdmin   http://localhost:8081
  Cuentas (clave: SEED_CLAVE del .env): admin@mostry.test · rosa@dona-rosa.test · martin@heladeria.test
  Ctrl+C para cortar todo.
TXT
wait

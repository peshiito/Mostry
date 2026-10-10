#!/usr/bin/env bash
# Restaura un backup de la base y verifica que estén todas las filas.
#   npm run restaurar -- ../Mostry-Backup/base/mostry-2026-10-09-1030.sql.gz
#   npm run restaurar -- <archivo> mostry     → pisa la base de trabajo (pide confirmación)
# Por defecto restaura en "mostry_restaurada", así tu base de trabajo no se toca.
set -euo pipefail
cd "$(dirname "$0")/.."
source scripts/lib/mysql.sh

ARCHIVO="${1:?Indicá el archivo .sql.gz a restaurar}"
DEST="${2:-mostry_restaurada}"
[[ "$DEST" =~ ^[a-z0-9_]+$ ]] || { echo "✖ Nombre de base inválido: $DEST" >&2; exit 1; }
if [ "$DEST" = "$(leer DB_NOMBRE)" ]; then
  read -r -p "Esto PISA tu base de trabajo ($DEST). ¿Seguro? (s/N) " ok
  [ "$ok" = "s" ] || { echo "Cancelado."; exit 1; }
fi

# Antes de borrar nada: el backup tiene que estar completo y tener su conteo.
FILAS="${ARCHIVO%.sql.gz}.filas.txt"
[ -f "$FILAS" ] || { echo "✖ Falta $FILAS: ese backup no está completo." >&2; exit 1; }
gzip -dc "$ARCHIVO" | tail -n 1 | grep -q "Dump completed" \
  || { echo "✖ El backup está cortado: no se restaura." >&2; exit 1; }
# head primero: así grep no corta el pipe de un dump grande (y no falla en silencio).
ORIGEN=$(gzip -dc "$ARCHIVO" | head -n 60 | grep -m1 -oP '^CREATE DATABASE .*?`\K[^`]+' || true)
[ -n "$ORIGEN" ] || { echo "✖ El backup no trae CREATE DATABASE." >&2; exit 1; }
echo "→ Restaurando $ORIGEN en $DEST"
como_root mysql -e "DROP DATABASE IF EXISTS \`$DEST\`; CREATE DATABASE \`$DEST\` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;"
# El dump trae "USE `origen`": se cambia por la base de destino.
gzip -dc "$ARCHIVO" | sed -e "/^CREATE DATABASE /d" -e "s/^USE \`$ORIGEN\`;/USE \`$DEST\`;/" | como_root mysql

echo "→ Comparando filas tabla por tabla"
if diff "$FILAS" <(contar_filas "$DEST"); then
  echo "  ✔ Todas las tablas tienen las mismas filas que el backup."
else
  echo "  ✖ Hay diferencias (arriba: < backup, > restaurada)." >&2; exit 1
fi

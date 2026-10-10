#!/usr/bin/env bash
# Backup de Mostry local: la base (mysqldump) y los archivos (fotos y comprobantes).
#   npm run backup                 → base del .env (DB_NOMBRE)
#   npm run backup -- otra_base    → otra base
# Queda en ../Mostry-Backup (o en $MOSTRY_BACKUP):
#   base/<base>-AAAA-MM-DD-HHMM.sql.gz  + .filas.txt (para verificar al restaurar)
#   archivos/AAAA-MM-DD-HHMM/<bucket>/…
set -euo pipefail
cd "$(dirname "$0")/.."
source scripts/lib/mysql.sh

BASE="${1:-$(leer DB_NOMBRE)}"
MARCA=$(date +%Y-%m-%d-%H%M)
mkdir -p "$DESTINO/base" "$DESTINO/archivos/$MARCA"
DESTINO=$(cd "$DESTINO" && pwd)
ARCHIVO="$DESTINO/base/$BASE-$MARCA.sql.gz"

echo "→ Base $BASE"
# Si mysqldump falla a la mitad, el archivo cortado se borra (nunca queda uno inservible).
trap 'rm -f "$ARCHIVO" "${ARCHIVO%.sql.gz}.filas.txt"; echo "✖ Falló el backup de la base." >&2' ERR
como_root mysqldump --single-transaction --quick --routines --no-tablespaces --databases "$BASE" \
  | gzip > "$ARCHIVO"
# Un dump cortado a la mitad no termina con esta línea: no sirve y se borra.
if ! gzip -dc "$ARCHIVO" | tail -n 1 | grep -q "Dump completed"; then
  rm -f "$ARCHIVO"; echo "✖ El dump quedó incompleto. No se guardó nada." >&2; exit 1
fi
contar_filas "$BASE" > "${ARCHIVO%.sql.gz}.filas.txt"
trap - ERR
echo "  ✔ $ARCHIVO ($(du -h "$ARCHIVO" | cut -f1), $(wc -l < "${ARCHIVO%.sql.gz}.filas.txt") tablas)"

echo "→ Archivos de RustFS"
for bucket in "$(leer S3_BUCKET_PUBLICO)" "$(leer S3_BUCKET_PRIVADO)"; do
  docker run --rm --network mostry_default \
    -e AWS_ACCESS_KEY_ID="$(leer S3_ACCESS_KEY)" -e AWS_SECRET_ACCESS_KEY="$(leer S3_SECRET_KEY)" \
    -e AWS_DEFAULT_REGION="$(leer S3_REGION)" -v "$DESTINO/archivos/$MARCA:/salida" \
    amazon/aws-cli --endpoint-url http://rustfs:9000 s3 sync "s3://$bucket" "/salida/$bucket" --only-show-errors
  echo "  ✔ $bucket ($(find "$DESTINO/archivos/$MARCA/$bucket" -type f 2>/dev/null | wc -l) archivos)"
done
echo "Listo: $DESTINO"

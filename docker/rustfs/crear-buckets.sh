#!/bin/sh
# Crea los buckets de desarrollo. Idempotente: se puede correr muchas veces.
set -eu
S3="aws --endpoint-url http://rustfs:9000 s3api"

for bucket in "$S3_BUCKET_PUBLICO" "$S3_BUCKET_PRIVADO" "$S3_BUCKET_BACKUPS" "$S3_BUCKET_PUBLICO_TEST" "$S3_BUCKET_PRIVADO_TEST"; do
  $S3 head-bucket --bucket "$bucket" 2>/dev/null || $S3 create-bucket --bucket "$bucket"
done

# Solo los buckets públicos (desarrollo y tests) se leen sin firma.
for bucket in "$S3_BUCKET_PUBLICO" "$S3_BUCKET_PUBLICO_TEST"; do
$S3 put-bucket-policy --bucket "$bucket" --policy "{
  \"Version\": \"2012-10-17\",
  \"Statement\": [{
    \"Effect\": \"Allow\", \"Principal\": \"*\", \"Action\": \"s3:GetObject\",
    \"Resource\": \"arn:aws:s3:::$bucket/*\"
  }]
}"
done
echo "Buckets listos."

#!/bin/sh
# Crea los buckets de desarrollo. Idempotente: se puede correr muchas veces.
set -eu
S3="aws --endpoint-url http://rustfs:9000 s3api"

for bucket in "$S3_BUCKET_PUBLICO" "$S3_BUCKET_PRIVADO" "$S3_BUCKET_BACKUPS"; do
  $S3 head-bucket --bucket "$bucket" 2>/dev/null || $S3 create-bucket --bucket "$bucket"
done

# Solo el bucket público se lee sin firma. Los otros quedan privados.
$S3 put-bucket-policy --bucket "$S3_BUCKET_PUBLICO" --policy "{
  \"Version\": \"2012-10-17\",
  \"Statement\": [{
    \"Effect\": \"Allow\", \"Principal\": \"*\", \"Action\": \"s3:GetObject\",
    \"Resource\": \"arn:aws:s3:::$S3_BUCKET_PUBLICO/*\"
  }]
}"
echo "Buckets listos."

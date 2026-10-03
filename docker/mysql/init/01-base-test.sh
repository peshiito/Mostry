#!/bin/bash
# Crea la base de tests y le da permisos al usuario de la app.
# Corre solo la primera vez que se crea el volumen de MySQL.
set -euo pipefail
mysql -uroot -p"${MYSQL_ROOT_PASSWORD}" <<SQL
CREATE DATABASE IF NOT EXISTS \`${DB_NOMBRE_TEST}\`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
GRANT ALL PRIVILEGES ON \`${DB_NOMBRE_TEST}\`.* TO '${MYSQL_USER}'@'%';
FLUSH PRIVILEGES;
SQL

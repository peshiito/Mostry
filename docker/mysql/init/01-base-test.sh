#!/bin/bash
# Crea la base de tests y le da permisos al usuario de la app.
# Corre solo la primera vez que se crea el volumen de MySQL.
set -euo pipefail
mysql -uroot -p"${MYSQL_ROOT_PASSWORD}" <<SQL
CREATE DATABASE IF NOT EXISTS \`${DB_NOMBRE_TEST}\`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
GRANT ALL PRIVILEGES ON \`${DB_NOMBRE_TEST}\`.* TO '${MYSQL_USER}'@'%';
-- Base de los tests de punta a punta (Playwright, carpeta e2e/).
CREATE DATABASE IF NOT EXISTS \`mostry_e2e\`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
GRANT ALL PRIVILEGES ON \`mostry_e2e\`.* TO '${MYSQL_USER}'@'%';
-- Base temporal donde el worker prueba restaurar el backup (una vez por mes).
GRANT ALL PRIVILEGES ON \`mostry_restore_prueba\`.* TO '${MYSQL_USER}'@'%';
FLUSH PRIVILEGES;
SQL

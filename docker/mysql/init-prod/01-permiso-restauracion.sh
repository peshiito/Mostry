#!/bin/sh
# Producción: el worker prueba una vez por mes que el último backup se restaure,
# en una base aparte (mostry_restore_prueba) que crea y borra. Necesita permiso
# SOLO sobre esa base. Corre una vez, al crear el volumen de MySQL.
# En Railway (donde no hay scripts de inicio) se corre a mano, como root:
#   GRANT ALL PRIVILEGES ON `mostry_restore_prueba`.* TO 'mostry'@'%';
set -eu
mysql -uroot -p"$MYSQL_ROOT_PASSWORD" <<SQL
GRANT ALL PRIVILEGES ON \`mostry_restore_prueba\`.* TO '$MYSQL_USER'@'%';
FLUSH PRIVILEGES;
SQL

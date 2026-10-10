#!/usr/bin/env bash
# Funciones comunes de backup.sh y restaurar.sh (se cargan con "source").
# Todo corre dentro del contenedor de MySQL: no hace falta instalar nada.

# Valor de una variable del .env (sin ejecutarlo: las claves pueden tener símbolos).
leer() { grep -E "^$1=" .env | tail -1 | cut -d= -f2-; }

CONTENEDOR=mostry-mysql-1
DESTINO="${MOSTRY_BACKUP:-../Mostry-Backup}"

# mysql/mysqldump como root (crear y borrar bases necesita permisos de root).
como_root() { docker exec -i -e MYSQL_PWD="$(leer MYSQL_ROOT_PASSWORD)" "$CONTENEDOR" "$@" -uroot; }

# "tabla<TAB>filas" de cada tabla de una base, ordenado: sirve para comparar.
contar_filas() {
  local base=$1 consultas
  consultas=$(como_root mysql -N -e "SELECT CONCAT('SELECT ''', table_name, ''', COUNT(*) FROM \`', table_name, '\`;')
    FROM information_schema.tables WHERE table_schema = '$base' AND table_type = 'BASE TABLE'
    ORDER BY table_name")
  [ -z "$consultas" ] && return 0
  echo "$consultas" | como_root mysql -N "$base"
}

#!/bin/sh
# wait-for-mysql.sh

set -e

host="$1"
shift
cmd="$@"

echo "Waiting for MySQL at $host..."

# Use mariadb client (shipped with Alpine) and disable TLS verification to avoid self-signed cert errors
until mariadb -h "$host" --protocol=TCP --ssl=false -u"$SPRING_DATASOURCE_USERNAME" -p"$SPRING_DATASOURCE_PASSWORD" -e "SELECT 1" >/dev/null 2>&1; do
  echo "MySQL is unavailable - sleeping"
  sleep 2
done

echo "MySQL is up - executing command"
exec $cmd

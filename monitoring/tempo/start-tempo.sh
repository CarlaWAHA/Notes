#!/bin/sh
set -eu

: "${PORT:=3200}"

cp /etc/tempo/tempo.render.yml.template /tmp/tempo.yml
sed -i "s|__PORT__|${PORT}|g" /tmp/tempo.yml

exec /tempo -config.file=/tmp/tempo.yml
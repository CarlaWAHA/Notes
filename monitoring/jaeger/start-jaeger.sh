#!/bin/sh
set -eu

: "${PORT:?PORT is required}"

/usr/local/bin/jaeger-all-in-one --collector.otlp.enabled=true >/tmp/jaeger.log 2>&1 &

envsubst '$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf
exec nginx -g 'daemon off;'

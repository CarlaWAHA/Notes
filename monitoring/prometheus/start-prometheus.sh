#!/bin/sh
set -eu

: "${BACKEND_METRICS_HOST:?BACKEND_METRICS_HOST is required}"

cp /etc/prometheus/prometheus.render.yml.template /tmp/prometheus.yml
sed -i "s|__BACKEND_METRICS_HOST__|${BACKEND_METRICS_HOST}|g" /tmp/prometheus.yml

exec /bin/prometheus \
  --config.file=/tmp/prometheus.yml \
  --storage.tsdb.path=/prometheus \
  --web.enable-lifecycle
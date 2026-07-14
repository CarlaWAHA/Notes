FROM prom/prometheus:latest

USER root

RUN apk add --no-cache gettext

COPY prometheus/prometheus.render.yml.template /etc/prometheus/prometheus.render.yml.template

USER nobody

CMD ["/bin/sh", "-c", "envsubst '$BACKEND_METRICS_HOST' < /etc/prometheus/prometheus.render.yml.template > /etc/prometheus/prometheus.yml && /bin/prometheus --config.file=/etc/prometheus/prometheus.yml --storage.tsdb.path=/prometheus --web.enable-lifecycle"]
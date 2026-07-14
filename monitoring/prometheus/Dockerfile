FROM prom/prometheus:latest

COPY prometheus/prometheus.render.yml.template /etc/prometheus/prometheus.render.yml.template

USER nobody

CMD ["/bin/sh", "-c", "cp /etc/prometheus/prometheus.render.yml.template /etc/prometheus/prometheus.yml && sed -i \"s|__BACKEND_METRICS_HOST__|${BACKEND_METRICS_HOST}|g\" /etc/prometheus/prometheus.yml && /bin/prometheus --config.file=/etc/prometheus/prometheus.yml --storage.tsdb.path=/prometheus --web.enable-lifecycle"]
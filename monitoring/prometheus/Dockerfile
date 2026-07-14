FROM prom/prometheus:latest

COPY prometheus/prometheus.render.yml.template /etc/prometheus/prometheus.render.yml.template
COPY prometheus/start-prometheus.sh /usr/local/bin/start-prometheus.sh

USER root

RUN chmod +x /usr/local/bin/start-prometheus.sh

USER nobody

ENTRYPOINT ["/bin/sh", "/usr/local/bin/start-prometheus.sh"]
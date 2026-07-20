FROM grafana/grafana:latest

COPY grafana/provisioning /etc/grafana/provisioning

CMD ["/bin/sh", "-c", "cp /etc/grafana/provisioning/datasources/datasources.render.yml.template /etc/grafana/provisioning/datasources/datasources.yml && sed -i \"s|__PROMETHEUS_URL__|${PROMETHEUS_URL}|g\" /etc/grafana/provisioning/datasources/datasources.yml && sed -i \"s|__JAEGER_URL__|${JAEGER_URL}|g\" /etc/grafana/provisioning/datasources/datasources.yml && /run.sh"]
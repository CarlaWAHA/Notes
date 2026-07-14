FROM grafana/grafana:latest

USER root

RUN apk add --no-cache gettext

COPY grafana/provisioning /etc/grafana/provisioning

CMD ["/bin/sh", "-c", "envsubst '$PROMETHEUS_URL' < /etc/grafana/provisioning/datasources/datasources.render.yml.template > /etc/grafana/provisioning/datasources/datasources.yml && /run.sh"]
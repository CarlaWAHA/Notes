FROM grafana/tempo:latest

COPY tempo/tempo.render.yml.template /etc/tempo/tempo.render.yml.template

CMD ["/bin/sh", "-c", "cp /etc/tempo/tempo.render.yml.template /etc/tempo/tempo.yml && sed -i \"s|__PORT__|${PORT}|g\" /etc/tempo/tempo.yml && /tempo -config.file=/etc/tempo/tempo.yml"]
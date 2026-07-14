FROM grafana/tempo:latest

COPY tempo/tempo.render.yml.template /etc/tempo/tempo.yml

ENTRYPOINT ["/tempo", "-config.file=/etc/tempo/tempo.yml"]
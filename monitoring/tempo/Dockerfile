FROM grafana/tempo:latest

COPY tempo/tempo.render.yml.template /etc/tempo/tempo.render.yml.template
COPY tempo/start-tempo.sh /usr/local/bin/start-tempo.sh

USER root

RUN chmod +x /usr/local/bin/start-tempo.sh

ENTRYPOINT ["/bin/sh", "/usr/local/bin/start-tempo.sh"]
FROM nginx:1.27-alpine

ARG JAEGER_VERSION=1.59.0

RUN apk add --no-cache curl tar gettext \
    && curl -fsSL -o /tmp/jaeger.tar.gz https://github.com/jaegertracing/jaeger/releases/download/v${JAEGER_VERSION}/jaeger-${JAEGER_VERSION}-linux-amd64.tar.gz \
    && tar -xzf /tmp/jaeger.tar.gz -C /tmp \
    && find /tmp -name jaeger-all-in-one -type f -exec mv {} /usr/local/bin/jaeger-all-in-one \; \
    && chmod +x /usr/local/bin/jaeger-all-in-one \
    && rm -rf /tmp/jaeger*

COPY jaeger/nginx.conf /etc/nginx/templates/default.conf.template
COPY jaeger/start-jaeger.sh /usr/local/bin/start-jaeger.sh

RUN chmod +x /usr/local/bin/start-jaeger.sh

CMD ["/usr/local/bin/start-jaeger.sh"]

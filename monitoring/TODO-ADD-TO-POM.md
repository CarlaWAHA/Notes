# 🔧 ADD These Dependencies to pom.xml

## Location: `demo/pom.xml`

Find the `<dependencies>` section and add these dependencies:

---

## 1. Spring Boot Actuator

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

---

## 2. Micrometer Prometheus Registry

```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

---

## 3. OpenTelemetry API

```xml
<dependency>
    <groupId>io.opentelemetry</groupId>
    <artifactId>opentelemetry-api</artifactId>
    <version>1.26.0</version>
</dependency>
```

---

## 4. OpenTelemetry SDK

```xml
<dependency>
    <groupId>io.opentelemetry</groupId>
    <artifactId>opentelemetry-sdk</artifactId>
    <version>1.26.0</version>
</dependency>
```

---

## 5. Jaeger Exporter

```xml
<dependency>
    <groupId>io.opentelemetry.exporter</groupId>
    <artifactId>opentelemetry-exporter-jaeger</artifactId>
    <version>1.26.0</version>
</dependency>
```

---

## 6. Spring Cloud Sleuth

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-sleuth</artifactId>
    <version>3.1.7</version>
</dependency>
```

---

## Complete Section to Copy-Paste

```xml
<!-- Add these inside <dependencies>...</dependencies> -->

<!-- Actuator -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>

<!-- Micrometer Prometheus -->
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>

<!-- OpenTelemetry -->
<dependency>
    <groupId>io.opentelemetry</groupId>
    <artifactId>opentelemetry-api</artifactId>
    <version>1.26.0</version>
</dependency>

<dependency>
    <groupId>io.opentelemetry</groupId>
    <artifactId>opentelemetry-sdk</artifactId>
    <version>1.26.0</version>
</dependency>

<!-- Jaeger -->
<dependency>
    <groupId>io.opentelemetry.exporter</groupId>
    <artifactId>opentelemetry-exporter-jaeger</artifactId>
    <version>1.26.0</version>
</dependency>

<!-- Spring Cloud Sleuth -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-sleuth</artifactId>
    <version>3.1.7</version>
</dependency>
```

---

## Then Add to `application.properties`

```properties
# === ACTUATOR ENDPOINTS ===
management.endpoints.web.exposure.include=health,info,metrics,prometheus
management.endpoint.health.show-details=always
management.endpoint.health.livenessState.enabled=true
management.endpoint.health.readinessState.enabled=true

# === PROMETHEUS METRICS ===
management.metrics.export.prometheus.enabled=true
management.metrics.distribution.percentiles-histogram.http.server.requests=true

# === MICROMETER TAGGING ===
management.tags.application=notes-backend
management.tags.environment=development

# === CUSTOM METRICS ===
management.metrics.enable.jvm=true
management.metrics.enable.process=true
management.metrics.enable.logback=true
management.metrics.enable.tomcat=true

# === JAEGER / OPENTELEMETRY ===
otel.sdk.disabled=false
otel.traces.exporter=jaeger
otel.exporter.jaeger.agent.host=jaeger
otel.exporter.jaeger.agent.port=6831
otel.service.name=notes-backend

# === LOGGING ===
logging.level.root=INFO
logging.level.com.example.demo=DEBUG
```

---

## Verify Installation

```bash
# Navigate to demo folder
cd demo

# Build project (will download dependencies)
mvnw.cmd clean package -DskipTests

# Compile only
mvnw.cmd clean compile

# Run tests
mvnw.cmd test
```

---

## Check if Metrics Endpoint Works

```bash
# Start application
docker-compose up -d

# Verify metrics endpoint
curl http://localhost:8080/actuator/prometheus

# Should output Prometheus format:
# TYPE jvm_memory_used_bytes gauge
# jvm_memory_used_bytes{...} 123456789
```

---

**Version**: 1.0  
**Date**: 13 Juillet 2026  
**Status**: Ready to implement

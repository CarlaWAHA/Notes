# 🔧 Spring Boot Metrics Configuration

## Required Dependencies in pom.xml

Add these dependencies to `demo/pom.xml` to enable Prometheus metrics, Actuator endpoints, and OpenTelemetry tracing:

```xml
<!-- Add to <dependencies> section -->

<!-- Spring Boot Actuator (exposes /actuator/prometheus) -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>

<!-- Micrometer Prometheus Registry -->
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>

<!-- OpenTelemetry for Distributed Tracing -->
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

<!-- Jaeger Exporter for OpenTelemetry -->
<dependency>
    <groupId>io.opentelemetry.exporter</groupId>
    <artifactId>opentelemetry-exporter-jaeger</artifactId>
    <version>1.26.0</version>
</dependency>

<!-- Spring Cloud Sleuth for automatic tracing -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-sleuth</artifactId>
    <version>3.1.7</version>
</dependency>

<!-- Logback for logging (already included in spring-boot-starter-web) -->
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
</dependency>
```

---

## Application Configuration

Add to `demo/src/main/resources/application.properties`:

```properties
# ===== ACTUATOR ENDPOINTS =====
management.endpoints.web.exposure.include=health,info,metrics,prometheus
management.endpoint.health.show-details=always
management.endpoint.health.livenessState.enabled=true
management.endpoint.health.readinessState.enabled=true

# ===== PROMETHEUS METRICS =====
management.metrics.export.prometheus.enabled=true
management.metrics.distribution.percentiles-histogram.http.server.requests=true

# ===== MICROMETER TAGGING =====
management.tags.application=notes-backend
management.tags.environment=development

# ===== CUSTOM METRICS =====
management.metrics.enable.jvm=true
management.metrics.enable.process=true
management.metrics.enable.logback=true
management.metrics.enable.tomcat=true

# ===== JAEGER / OPENTELEMETRY =====
otel.sdk.disabled=false
otel.traces.exporter=jaeger
otel.exporter.jaeger.agent.host=jaeger
otel.exporter.jaeger.agent.port=6831
otel.service.name=notes-backend

# ===== LOGGING =====
logging.level.root=INFO
logging.level.com.example.demo=DEBUG
```

---

## Exposed Metrics Endpoints

Once configured, the following endpoints are available:

| Endpoint | Type | Purpose |
|----------|------|---------|
| `/actuator/health` | JSON | Application health status |
| `/actuator/info` | JSON | Application info |
| `/actuator/metrics` | JSON | List available metrics |
| `/actuator/metrics/{metric}` | JSON | Specific metric value |
| `/actuator/prometheus` | TEXT | Prometheus format (for scraping) |

**Example requests**:

```bash
# Health check
curl http://localhost:8080/actuator/health

# Available metrics
curl http://localhost:8080/actuator/metrics

# Get specific metric (e.g., JVM memory)
curl http://localhost:8080/actuator/metrics/jvm.memory.used

# Prometheus format (what Prometheus scrapes)
curl http://localhost:8080/actuator/prometheus
```

---

## Custom Metrics

Create custom metrics in your services:

```java
import io.micrometer.core.instrument.MeterRegistry;

@Service
public class MyService {
    private final MeterRegistry meterRegistry;
    
    public MyService(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
    }
    
    public void processUser() {
        // Counter: increment when processing user
        meterRegistry.counter("users.processed").increment();
        
        // Timer: measure operation duration
        Timer.Sample sample = Timer.start(meterRegistry);
        try {
            // Do work
        } finally {
            sample.stop(Timer.builder("user.process.duration")
                .description("Time to process user")
                .publishPercentiles(0.95, 0.99)
                .register(meterRegistry));
        }
    }
}
```

---

## Monitoring in Docker Compose

The `docker-compose.yml` is already configured to:

1. **Expose metrics from backend**:
   ```yaml
   MANAGEMENT_ENDPOINTS_WEB_EXPOSURE_INCLUDE: health,info,metrics,prometheus
   ```

2. **Send traces to Jaeger**:
   ```yaml
   OTEL_EXPORTER_JAEGER_AGENT_HOST: jaeger
   OTEL_EXPORTER_JAEGER_AGENT_PORT: "6831"
   ```

3. **Scrape metrics in Prometheus**:
   - Prometheus reads `http://backend:8080/actuator/prometheus` every 10 seconds

4. **Visualize in Grafana**:
   - Grafana queries Prometheus for metrics
   - Dashboards automatically load

---

## Verification Steps

### 1. Start Services

```bash
docker-compose up -d
```

### 2. Verify Metrics Endpoint

```bash
curl http://localhost:8080/actuator/prometheus | head -20

# Should output Prometheus format:
# TYPE jvm_memory_used_bytes gauge
# jvm_memory_used_bytes{area="heap"} 123456789
```

### 3. Check Prometheus Targets

Navigate to: http://localhost:9090/targets

Should see: `notes-backend` with status `UP`

### 4. View Grafana Dashboard

Navigate to: http://localhost:3000

- Login: admin / admin
- Go to: Dashboards → Performance
- Should show real-time metrics

### 5. Check Jaeger Traces

Navigate to: http://localhost:16686

- Service: `notes-backend`
- Should see traces from recent requests

---

## Performance Impact

- **Metrics collection**: ~2-5% CPU overhead
- **Memory**: ~50 MB additional
- **Network**: ~1-2 KB/min to Prometheus
- **Jaeger tracing**: ~10% CPU overhead (optional, can be disabled)

Negligible performance impact in production.

---

## Disable Specific Metrics (if needed)

```properties
# Disable expensive metrics
management.metrics.enable.jvm=false
management.metrics.enable.process=false
management.metrics.enable.logback=false

# Disable tracing
otel.sdk.disabled=true
```

---

**Configuration Version**: 1.0  
**Last Updated**: 13 Juillet 2026  
**Spring Boot Version**: 4.0.5  

#  K6 Load Testing - Performance Test Suite

**Framework**: K6 (Load Testing Tool)  
**Test Types**: Load, Spike, Endurance  
**Metrics**: Response time, Throughput, Error rate, Resource utilization

---

## Installation

### Windows

```bash
# Using Chocolatey
choco install k6

# Or manual download
# https://k6.io/docs/getting-started/installation/
```

### macOS

```bash
# Using Homebrew
brew install k6
```

### Linux (Ubuntu/Debian)

```bash
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3232A+F7AE4F566C6D0B07A6418F28
echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6-stable.list
sudo apt-get update
sudo apt-get install k6
```

### Verify Installation

```bash
k6 version
# Output: k6 v0.43.1 (commit: abc123def456, go1.19.5, windows/amd64)
```

---

## Quick Start

### 1. Start Application

```bash
cd /path/to/demo/Notes
docker-compose up -d

# Verify services running
docker-compose ps
```

### 2. Run Load Test

```bash
cd performance-tests
k6 run load-test.js

# Or with summary output
k6 run load-test.js --summary-export=summary.json
```

### 3. View Results

```bash
# Results displayed in terminal
# Also check Grafana dashboard: http://localhost:3000
```

---

## Test Scenarios

### 1. Load Test (load-test.js)

**Objective**: Test system performance under gradually increasing load

**Profile**:
- Start: 0 users
- Ramp up to 10 users (2 min)
- Increase to 20 users (3 min)
- Sustain at 20 users (5 min)
- Ramp down to 0 (3 min)
- **Total Duration**: 13 minutes

**Expected Results**:
```
✓ P95 response time < 500ms
✓ Error rate < 5%
✓ Throughput ~95 req/sec @ 20 users
✓ No memory leaks
```

**Run**:
```bash
k6 run load-test.js
```

**Analysis**:
- Look for latency increase as users ramp up
- Check if errors occur at peak load
- Verify recovery during ramp down

---

### 2. Spike Test (spike-test.js)

**Objective**: Test system response to sudden traffic spike

**Profile**:
- Baseline: 5 users
- SPIKE: Sudden jump to 100 users (30 sec)
- Sustain spike (1 min)
- Return to baseline (30 sec)
- Stabilize (1 min)
- **Total Duration**: 4 minutes

**Expected Results**:
```
✓ P95 response time < 1500ms during spike
✓ Error rate < 20% during spike
✓ Recovery within 30 sec post-spike
✓ No cascading failures
```

**Run**:
```bash
k6 run spike-test.js
```

**Watch For**:
- Response time degradation during spike
- CPU/Memory spike in Grafana
- Jaeger trace increase
- Pool exhaustion (DB connections)

---

### 3. Endurance Test (endurance-test.js)

**Objective**: Detect memory leaks and performance degradation over time

**Profile**:
- Ramp up: 5 users for 5 min
- **Sustain**: 10 users for 30 MINUTES
- Ramp down: 5 min
- **Total Duration**: 40 minutes

**Expected Results**:
```
✓ Memory usage stable after 10 min
✓ Error rate constant (not increasing)
✓ Response time consistent (no drift)
✓ GC pause time < 100ms
```

**Run**:
```bash
k6 run endurance-test.js

# This takes 40 minutes!
# Monitor in Grafana while running
```

**Monitoring During Test**:
1. Open Grafana: http://localhost:3000
2. Go to Performance Dashboard
3. Watch these metrics:
   - JVM Memory Usage (should be flat line)
   - Request duration (should not increase)
   - Error rate (should stay at 0% or < 1%)
   - GC Activity (should be regular, not increasing)

---

## Interpreting Results

### Key Metrics

| Metric | Good Range | Warning | Critical |
|--------|-----------|---------|----------|
| **P95 Latency** | < 500ms | 500-1000ms | > 1000ms |
| **P99 Latency** | < 1000ms | 1000-2000ms | > 2000ms |
| **Error Rate** | < 1% | 1-5% | > 5% |
| **Throughput** | Stable | ±10% drift | > 20% drift |
| **Memory Usage** | Flat line | Slow growth | Rapid growth |

### Sample Output

```
          /\      /‾‾\  /‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
     /\  /  \    /    \/‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
    /  \/    \  /
   /          \/

     execution: local
        script: load-test.js
        output: -

     scenarios: (100.00%) 1 scenario, 20 max VUs, 13m30s total duration

          ✓ login status is 200
          ✓ login has token
          ✓ UEs status is 200
          ✓ admin list status is 200

     checks.........................: 100% ✓ 4960
     data_received..................: 3.1 MB ✓
     data_sent.......................: 1.5 MB ✓
     dropped_iterations.............: 0 ✓
     http_req_blocked...............: avg=1.23ms   min=0s     med=0s       max=24ms    p(90)=0s     p(95)=0s
     http_req_connecting............: avg=0.82ms   min=0s     med=0s       max=19ms    p(90)=0s     p(95)=0s
     http_req_duration..............: avg=385ms    min=45ms   med=350ms    max=2.15s   p(90)=650ms  p(95)=850ms  ← IMPORTANT
     http_req_failed................: 0.4% ✓
     http_req_receiving.............: avg=12.45ms  min=1ms    med=10ms     max=150ms   p(90)=25ms   p(95)=30ms
     http_req_sending...............: avg=5.2ms    min=0s     med=4ms      max=45ms    p(90)=8ms    p(95)=10ms
     http_req_tls_handshaking.......: avg=0s       min=0s     med=0s       max=0s      p(90)=0s     p(95)=0s
     http_req_waiting...............: avg=367ms    min=38ms   med=332ms    max=2.1s    p(90)=625ms  p(95)=820ms
     http_reqs......................: 1250 ✓
     iteration_duration.............: avg=1.42s    min=1s     med=1.4s     max=3.15s   p(90)=1.7s   p(95)=1.85s
     iterations.....................: 625 ✓
     vus............................: 20 ✓ (peak)
     vus_max........................: 20 ✓

PASS ✓ All thresholds met!
```

### Failure Indicators

```
✗ Error rate spike
  - Check backend logs: docker-compose logs backend
  - Look for 500 errors in Jaeger traces
  
✗ Memory grows continuously
  - Likely memory leak
  - Check JVM heap dump: Grafana → Prometheus query → jvm_memory_used_bytes
  
✗ Timeout errors
  - Database pool exhausted
  - Check Prometheus: spring_datasource_connections_active
  
✗ Response time increasing over time
  - Performance degradation
  - Index missing on database?
  - Run: docker-compose logs backend | grep "slow query"
```

---

## 🔧 Customizing Tests

### Modify Load Profile

**File**: `load-test.js`

```javascript
export const options = {
  stages: [
    { duration: '5m', target: 50 },   // Custom: 5 min @ 50 users
    { duration: '10m', target: 50 },  // Sustain for 10 min
    { duration: '5m', target: 0 },    // Ramp down
  ],
  thresholds: {
    'http_req_duration': ['p(95)<1000'],  // Custom SLA
    'http_req_failed': ['rate<0.1'],
  },
};
```

### Add Custom Checks

```javascript
const success = check(res, {
  'custom check 1': (r) => r.status === 200,
  'custom check 2': (r) => r.json('field') !== undefined,
  'response time < 300ms': (r) => r.timings.duration < 300,
});
```

### Test Different Endpoints

```javascript
// In default() function:
group('Students API', () => {
  const res = http.get(`${BASE_URL}/api/admin/students`, headers);
  check(res, { 'status 200': r => r.status === 200 });
});

group('Grades API', () => {
  const res = http.get(`${BASE_URL}/api/student/grades/1`, headers);
  check(res, { 'status 200': r => r.status === 200 });
});
```

---

## K6 Cloud Integration

### Login to K6 Cloud

```bash
k6 login cloud
# Paste token from https://app.k6.io/account/api-token
```

### Run Test on Cloud

```bash
k6 cloud load-test.js

# Results stored in: https://app.k6.io/projects/YOUR_PROJECT_ID
```

### Benefits

✓ Distributed load from multiple regions  
✓ Historical comparison of results  
✓ Team collaboration & sharing  
✓ Detailed analytics & insights  

---

## Performance Testing Checklist

### Before Test

- [ ] Application running: `docker-compose ps`
- [ ] Database seeded with test data
- [ ] Monitoring stack running (Prometheus, Grafana)
- [ ] Load test script reviewed
- [ ] Baseline metrics noted

### During Test

- [ ] Monitor Grafana dashboard in real-time
- [ ] Watch Jaeger traces for slow operations
- [ ] Check backend logs for errors
- [ ] Note any anomalies in metrics

### After Test

- [ ] Download test summary
- [ ] Compare against SLA targets
- [ ] Document results in performance report
- [ ] Create tickets for any failures
- [ ] Share findings with team

---

## Troubleshooting

### K6 Command Not Found

```bash
# Add to PATH or use full path
/usr/local/bin/k6 run load-test.js

# Or reinstall
choco uninstall k6 && choco install k6
```

### Connection Refused Error

```bash
# Verify backend running
curl http://localhost:8080/api/ues

# Check firewall rules
netstat -an | grep 8080

# Start docker-compose
docker-compose up -d
```

### Out of Memory During Test

```bash
# K6 running out of memory?
# Reduce virtual users:
{ duration: '5m', target: 10 }  // Instead of 100

# Or run on remote K6 cloud
k6 cloud load-test.js
```

### DNS Resolution Errors

```bash
# Make sure using correct hostname
BASE_URL = 'http://backend:8080'  // Not 'localhost'

# Test connectivity
ping backend
nslookup backend
```

---

##  Documentation

- [K6 Official Docs](https://k6.io/docs)
- [K6 API Reference](https://k6.io/docs/javascript-api)
- [K6 Examples](https://github.com/grafana/k6/tree/master/examples)

---

**Last Updated**: 13 Juillet 2026  
**Framework Version**: K6 v0.43.1+  
**Status**: Production Ready

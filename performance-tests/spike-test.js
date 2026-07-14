import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Counter, Rate } from 'k6/metrics';

export const spikeMetrics = {
  duration: new Trend('spike_duration'),
  errors: new Rate('spike_errors'),
  requests: new Counter('spike_requests'),
};

export const options = {
  stages: [
    { duration: '1m', target: 5 },    // Baseline: 5 users
    { duration: '30s', target: 100 }, // Spike: jump to 100 users
    { duration: '1m', target: 100 },  // Sustain spike
    { duration: '30s', target: 5 },   // Drop back to baseline
    { duration: '1m', target: 5 },    // Stabilize
  ],
  thresholds: {
    'http_req_duration': ['p(95)<1000', 'p(99)<2000'],
    'http_req_failed': ['rate<0.2'],
    'spike_errors': ['rate<0.2'],
  },
};

const BASE_URL = 'http://localhost:8080';

export default function () {
  // Simulate user action: view UEs
  const response = http.get(`${BASE_URL}/api/ues`);
  
  spikeMetrics.duration.add(response.timings.duration);
  spikeMetrics.requests.add(1);
  
  const isSuccess = check(response, {
    'spike test status 200': (r) => r.status === 200,
    'spike response time < 1500ms': (r) => r.timings.duration < 1500,
  });
  
  spikeMetrics.errors.add(!isSuccess);
  
  sleep(1);
}

// Run: k6 run performance-tests/spike-test.js

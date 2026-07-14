import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Trend, Rate } from 'k6/metrics';

export const enduranceMetrics = {
  duration: new Trend('endurance_duration'),
  errors: new Rate('endurance_errors'),
  requests: new Counter('endurance_requests'),
  loginAttempts: new Counter('login_attempts'),
};

export const options = {
  stages: [
    { duration: '5m', target: 10 },   // Ramp up
    { duration: '30m', target: 10 },  // Sustain load for 30 minutes
    { duration: '5m', target: 0 },    // Ramp down
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500'],
    'http_req_failed': ['rate<0.05'],
    'endurance_errors': ['rate<0.05'],
  },
};

const BASE_URL = 'http://localhost:8080';

export default function () {
  // Login cycle every iteration
  const loginPayload = JSON.stringify({
    username: 'admin@notes.com',
    password: '12345678',
  });

  const authHeaders = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const loginRes = http.post(`${BASE_URL}/auth/login`, loginPayload, authHeaders);
  enduranceMetrics.loginAttempts.add(1);
  
  const token = loginRes.json('token');

  if (token) {
    // Simulate regular user activity
    const adminHeaders = {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };

    // Get students
    const studentRes = http.get(`${BASE_URL}/api/admin/students`, adminHeaders);
    enduranceMetrics.duration.add(studentRes.timings.duration);
    enduranceMetrics.requests.add(1);

    const success = check(studentRes, {
      'endurance test status 200': (r) => r.status === 200,
      'endurance response time < 500ms': (r) => r.timings.duration < 500,
    });

    enduranceMetrics.errors.add(!success);
  }

  sleep(2);
}

// Run: k6 run performance-tests/endurance-test.js

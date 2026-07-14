import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend, Counter, Gauge } from 'k6/metrics';

// Custom metrics
export const rates = {
  errors: new Rate('errors'),
  success: new Rate('success'),
};

export const trends = {
  duration: new Trend('req_duration'),
  loginDuration: new Trend('login_duration'),
  listStudentsDuration: new Trend('list_students_duration'),
  createStudentDuration: new Trend('create_student_duration'),
};

export const counters = {
  totalRequests: new Counter('total_requests'),
  failedRequests: new Counter('failed_requests'),
};

export const gauges = {
  activeUsers: new Gauge('active_users'),
};

// Load test configuration
export const options = {
  stages: [
    { duration: '2m', target: 10 },   // Ramp up to 10 users
    { duration: '3m', target: 20 },   // Ramp up to 20 users
    { duration: '5m', target: 20 },   // Stay at 20 users
    { duration: '2m', target: 10 },   // Ramp down to 10 users
    { duration: '1m', target: 0 },    // Ramp down to 0 users
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500', 'p(99)<1000'],  // 95% < 500ms, 99% < 1000ms
    'http_req_failed': ['rate<0.1'],                    // Error rate < 10%
    'errors': ['rate<0.1'],                             // Custom error rate < 10%
  },
  ext: {
    loadimpact: {
      projectID: 3379992,
      name: 'Notes App - Performance Test',
    },
  },
};

const BASE_URL = 'http://localhost:8080';

export default function () {
  gauges.activeUsers.add(1);

  // Test 1: Login
  group('Authentication', function () {
    const loginPayload = JSON.stringify({
      username: 'admin@notes.com',
      password: '12345678',
    });

    const loginParams = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const loginResponse = http.post(`${BASE_URL}/auth/login`, loginPayload, loginParams);
    const token = loginResponse.json('token');

    trends.loginDuration.add(loginResponse.timings.duration);
    checks.loginCheck(loginResponse);

    // Test 2: List UEs (public endpoint)
    group('Public Endpoints', function () {
      const uesResponse = http.get(`${BASE_URL}/api/ues`);
      trends.duration.add(uesResponse.timings.duration);
      checks.uesCheck(uesResponse);
    });

    // Test 3: Admin operations
    if (token) {
      group('Admin Operations', function () {
        const authHeaders = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        };

        // List students
        const listResponse = http.get(`${BASE_URL}/api/admin/students`, authHeaders);
        trends.listStudentsDuration.add(listResponse.timings.duration);
        checks.adminCheck(listResponse);

        // Create student
        const createPayload = JSON.stringify({
          username: `student_${Date.now()}@notes.com`,
          password: 'password123',
          ueIds: [1, 2],
        });

        const createResponse = http.post(`${BASE_URL}/api/admin/students`, createPayload, authHeaders);
        trends.createStudentDuration.add(createResponse.timings.duration);
        checks.createCheck(createResponse);
      });
    }
  });

  sleep(1);
  gauges.activeUsers.add(-1);
}

// Custom check functions
const checks = {
  loginCheck: (res) => {
    const success = check(res, {
      'login status is 200': (r) => r.status === 200,
      'login has token': (r) => r.json('token') !== undefined,
      'login response time < 300ms': (r) => r.timings.duration < 300,
    });
    rates.success.add(success);
    rates.errors.add(!success);
    counters.totalRequests.add(1);
    if (!success) counters.failedRequests.add(1);
  },

  uesCheck: (res) => {
    const success = check(res, {
      'UEs status is 200': (r) => r.status === 200,
      'UEs is array': (r) => Array.isArray(r.json()),
      'UEs response time < 100ms': (r) => r.timings.duration < 100,
    });
    rates.success.add(success);
    rates.errors.add(!success);
    counters.totalRequests.add(1);
    if (!success) counters.failedRequests.add(1);
  },

  adminCheck: (res) => {
    const success = check(res, {
      'admin list status is 200': (r) => r.status === 200,
      'admin list is array': (r) => Array.isArray(r.json()),
      'admin response time < 500ms': (r) => r.timings.duration < 500,
    });
    rates.success.add(success);
    rates.errors.add(!success);
    counters.totalRequests.add(1);
    if (!success) counters.failedRequests.add(1);
  },

  createCheck: (res) => {
    const success = check(res, {
      'create status is 201': (r) => r.status === 201 || r.status === 200,
      'create has id': (r) => r.json('id') !== undefined,
      'create response time < 1000ms': (r) => r.timings.duration < 1000,
    });
    rates.success.add(success);
    rates.errors.add(!success);
    counters.totalRequests.add(1);
    if (!success) counters.failedRequests.add(1);
  },
};

// Run with: k6 run performance-tests/load-test.js
// Or with cloud: k6 cloud performance-tests/load-test.js

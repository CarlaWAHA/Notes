import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',

  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1000'],
  },
};

export default function () {
  const response = http.get('http://localhost:8080/actuator/health');

  check(response, {
    'statut HTTP 200': (r) => r.status === 200,
    'temps de réponse inférieur à 1 seconde': (r) => r.timings.duration < 1000,
  });

  sleep(1);
}
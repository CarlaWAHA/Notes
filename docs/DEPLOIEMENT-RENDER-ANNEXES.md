<!-- markdownlint-disable -->

# Deploiement Render - Correctifs backend, captures et annexes

## Correctif immediat de ton erreur actuelle

Tu avais une URL valide avant, puis tu as ajoute manuellement:
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`

Le crash actuel vient de `SPRING_DATASOURCE_URL` au mauvais format.

Format incorrect (provoque ton erreur):
- `postgresql://user:pass@host/db`

Format JDBC attendu par Spring/Hikari:
- `jdbc:postgresql://host:5432/db`

## Ce qu'il faut faire sur Render (backend)

1. Ouvre `notes-backend` > `Environment`.
2. Supprime ces variables manuelles si elles existent:
   - `SPRING_DATASOURCE_URL`
   - `SPRING_DATASOURCE_USERNAME`
   - `SPRING_DATASOURCE_PASSWORD`
3. Garde uniquement les variables injectees par `render.yaml`:
   - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
4. Redeploie `notes-backend`.

Pourquoi: le projet est deja configure pour construire l'URL JDBC via `DB_*`.

## Pourquoi tu avais HTTP 403 alors que le service etait live

- Le backend est une API securisee, pas une page web publique.
- Ouvrir l'URL racine pouvait retourner 403.
- Correctif ajoute: endpoint racine public `GET /` qui confirme que l'API tourne.

## Endpoints de verification apres redeploiement

- `https://<backend-url>/`
- `https://<backend-url>/actuator/health/liveness`
- `https://<backend-url>/actuator/health`
- `https://<backend-url>/swagger-ui/index.html`
- `https://<backend-url>/v3/api-docs`

Attendu:
- reponse 200 sur `/`, `/actuator/health/liveness`, `/actuator/health`
- Swagger UI accessible

## Captures d'ecran demandees

### Prometheus
1. `Status > Targets` avec backend `UP`
2. Requete `http_server_requests_seconds_count`
3. Requete `jvm_memory_used_bytes`

### Grafana
1. Data sources healthy (Prometheus + Tempo)
2. Dashboard latence p95
3. Throughput req/s
4. Erreurs 4xx/5xx
5. JVM heap / CPU

### Jaeger / Tempo
- Ton architecture utilise Tempo (equivalent Jaeger pour traces).
- Capture recommandee: Grafana Explore avec datasource Tempo.
- Si le jury exige l'UI Jaeger:

```bash
docker run --rm --name jaeger -p 16686:16686 -p 4317:4317 -p 4318:4318 jaegertracing/all-in-one:1.59
```

Puis en local:

```bash
set OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318/v1/traces
mvn spring-boot:run
```

Et capture sur `http://localhost:16686`.

### Swagger
1. Ouvrir `swagger-ui/index.html`
2. Montrer les endpoints
3. Montrer un test d'endpoint (Try it out)

## Commandes tests de charge/performance (k6)

Prerequis:
- Installer k6: `https://grafana.com/docs/k6/latest/set-up/install-k6/`

Lancer depuis la racine du repo:

```bash
k6 run performance-tests/load-test.js
k6 run performance-tests/spike-test.js
k6 run performance-tests/endurance-test.js
```

Exporter des resultats pour annexes:

```bash
mkdir results
k6 run --summary-export results/load-summary.json performance-tests/load-test.js
k6 run --summary-export results/spike-summary.json performance-tests/spike-test.js
k6 run --summary-export results/endurance-summary.json performance-tests/endurance-test.js
```

## Annexes RNCP (structure finale)

## Annexe A - Architecture
- Diagramme d'architecture generale
- Diagramme UML de composants
- Diagramme de sequence JWT
- Diagramme de deploiement

## Annexe B - Captures applicatives
- Connexion
- Tableau de bord
- Gestion des etudiants
- Gestion des UE
- Gestion des notes
- Creation d'un utilisateur
- Validation des formulaires
- Messages d'erreur

## Annexe C - Extraits de code
- SecurityConfig
- TokenAuthenticationFilter
- AdminStudentController
- AdminGradeController
- UserService
- StudentService
- Repository
- DTO

## Annexe D - Tests
- JUnit
- Mockito
- Jest
- Cypress
- Rapport JaCoCo

## Annexe E - CI/CD
- Workflow GitHub Actions
- Dockerfile
- Render
- Variables d'environnement
- Deploiement reussi

## Annexe F - Gestion du projet
- Product Backlog
- User Stories
- Tableau Kanban
- Roadmap
- Journal des versions

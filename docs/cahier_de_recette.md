# Cahier de recette

**Projet**: Notes - Système de gestion des notes étudiantes

## 1. Objectif

Ce document décrit l'installation, la vérification fonctionnelle et les parcours complets administrateur/étudiant, ainsi que les liens de supervision et les métriques à observer.

## 2. Pré-requis

- Windows, macOS ou Linux
- Java 25 LTS ou version compatible avec le projet backend
- Node.js 20+ et npm
- Maven wrapper inclus dans le projet
- Docker et Docker Compose
- Compte Render si le projet est déployé en production
- Accès aux interfaces Swagger, Prometheus, Grafana et Jaeger

## 3. Installation du projet en local

### 3.1 Cloner le dépôt

```bash
git clone <url-du-repo>
cd Notes
```

### 3.2 Lancer le backend

```bash
cd demo
./mvnw spring-boot:run
```

Sous Windows:

```powershell
cd demo
mvnw.cmd spring-boot:run
```

Backend attendu:
- API Spring Boot disponible
- Swagger accessible
- Endpoints de santé actifs

### 3.3 Lancer le frontend

```bash
cd Front
npm install
npm run start
```

### 3.4 Lancer la stack de supervision

Si la stack locale est utilisée via Docker Compose:

```bash
docker compose up -d
```

## 4. Liens de vérification

### 4.1 Application

- Frontend: `http://localhost:4200` ou URL Render du front
- Backend: `http://localhost:8080` ou URL Render du backend

### 4.2 Swagger

- Swagger UI: `https://notes-backend.onrender.com/swagger-ui/index.html`
- OpenAPI JSON: `https://notes-backend.onrender.com/v3/api-docs`

### 4.3 Prometheus

- Prometheus: `https://notes-prometheus.onrender.com`
- Targets: `https://notes-prometheus.onrender.com/targets`

### 4.4 Grafana

- Grafana: `https://notes-grafana.onrender.com`
- Connexion: utilisateur admin configuré dans Render
- Datasource attendue: Prometheus
- Datasource traces: Jaeger

### 4.5 Jaeger

- Jaeger UI: `https://notes-jaeger.onrender.com`

## 5. Parcours administrateur

### 5.1 Connexion

1. Ouvrir le frontend.
2. Se connecter avec un compte administrateur.
3. Vérifier la redirection vers l'espace admin.

### 5.2 Gestion des étudiants

1. Ouvrir le tableau de bord admin.
2. Aller sur l'onglet Gestion Etudiants.
3. Créer un étudiant directement depuis le formulaire intégré.
4. Affecter au moins une UE.
5. Affecter un ou plusieurs cours créés par l'admin.
6. Vérifier l'apparition de l'étudiant dans la liste.
7. Modifier un étudiant existant.
8. Supprimer un étudiant.

### 5.3 Gestion des UE

1. Ajouter une UE.
2. Modifier une UE.
3. Supprimer une UE.
4. Vérifier la répercussion dans la liste des étudiants.

### 5.4 Attribution des notes

1. Choisir un étudiant.
2. Choisir une UE affectée.
3. Saisir une note.
4. Valider.
5. Vérifier la note côté étudiant.

## 6. Parcours étudiant

### 6.1 Connexion

1. Ouvrir le frontend.
2. Se connecter avec un compte étudiant.
3. Vérifier la redirection vers l'espace étudiant.

### 6.2 Visualisation du parcours

1. Vérifier le profil.
2. Vérifier les UE affectées.
3. Vérifier les cours admin affectés.
4. Vérifier les notes associées aux UE.
5. Vérifier le détail d'une UE sélectionnée.

## 7. Métriques observables

Dans Prometheus / Grafana, les métriques suivantes sont les plus utiles:

- `http_server_requests_seconds_count`
- `http_server_requests_seconds_bucket`
- `jvm_memory_used_bytes`
- `jvm_gc_pause_seconds_count`
- `process_cpu_usage`

### Exemples de lecture

- Latence HTTP p95 via `http_server_requests_seconds_bucket`
- Consommation mémoire JVM via `jvm_memory_used_bytes`
- Activité GC via `jvm_gc_pause_seconds_count`
- Charge CPU via `process_cpu_usage`

## 8. Checklist de recette

- [ ] Frontend accessible
- [ ] Backend accessible
- [ ] Swagger accessible
- [ ] Prometheus collecte les targets
- [ ] Grafana affiche des données
- [ ] Jaeger affiche des traces
- [ ] Connexion admin OK
- [ ] Connexion étudiant OK
- [ ] CRUD étudiant OK
- [ ] CRUD UE OK
- [ ] Affectation de cours OK
- [ ] Attribution de notes OK
- [ ] Vue étudiant cohérente

## 9. Sources de documentation officielles importantes

- Angular: https://angular.dev/
- Angular CLI: https://angular.dev/tools/cli
- Spring Boot: https://docs.spring.io/spring-boot/
- Spring Security: https://docs.spring.io/spring-security/reference/
- Spring Data JPA: https://docs.spring.io/spring-data/jpa/reference/
- Hibernate ORM: https://hibernate.org/orm/documentation/
- PostgreSQL: https://www.postgresql.org/docs/
- Docker: https://docs.docker.com/
- Docker Compose: https://docs.docker.com/compose/
- Render: https://docs.render.com/
- Grafana: https://grafana.com/docs/grafana/latest/
- Grafana Prometheus datasource: https://grafana.com/docs/grafana/latest/datasources/prometheus/
- Prometheus: https://prometheus.io/docs/introduction/overview/
- Jaeger: https://www.jaegertracing.io/docs/
- OpenTelemetry: https://opentelemetry.io/docs/
- Swagger / OpenAPI: https://swagger.io/specification/
- JUnit 5: https://junit.org/junit5/docs/current/user-guide/
- Mockito: https://site.mockito.org/
- Cypress: https://docs.cypress.io/
- K6: https://grafana.com/docs/k6/latest/

## 10. Résultat attendu de fin de recette

Le système est considéré validé lorsque:
- le parcours administrateur est complet et stable,
- le parcours étudiant affiche les UE, les cours et les notes,
- Swagger est consultable,
- Prometheus collecte les métriques,
- Grafana affiche les dashboards,
- Jaeger affiche au moins une trace de test.

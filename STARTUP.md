#  Guide de Démarrage - Notes Application

##  Prérequis

- **Option 1 (Local)** : Java 25, Node.js 20+, PostgreSQL 15+
- **Option 2 (Docker)** : Docker Desktop + Docker Compose

---

## **Option A : Démarrage avec Docker (Recommandé)**

### 1️⃣ Installer Docker Desktop

- Windows/Mac: https://www.docker.com/products/docker-desktop
- Linux: `sudo apt-get install docker.io docker-compose`

Vérifiez l'installation :
```bash
docker --version
docker-compose --version
```

### 2️⃣ Démarrer tous les services

```bash
cd "C:\Users\PC\eclipse-workspace\demo\Notes"
docker-compose up -d
```

**Vérification** :
```bash
docker ps
```

Vous devriez voir 3 conteneurs :
- `notes-db` (PostgreSQL)
- `notes-backend` (Spring Boot)
- `notes-frontend` (Angular + Nginx)

### Accéder à l'application

- **Frontend** : http://localhost:4200 
- **Backend API** : http://localhost:8080/api/ues
- **Logs** : `docker-compose logs -f`

### Arrêter les services

```bash
docker-compose down
docker-compose down -v  # Avec suppression des volumes (BDD)
```

---

## **Option B : Démarrage Local (Dev)**

### Installer PostgreSQL

#### Windows
- Téléchargez : https://www.postgresql.org/download/windows/
- Installez avec mot de passe : `postgres`
- Port : 5432

#### Mac
```bash
brew install postgresql
brew services start postgresql
```

#### Linux
```bash
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

### 2️⃣ Créer la base de données

```bash
psql -U postgres
```

Puis :
```sql
CREATE DATABASE notes_db;
\q
```

### Vérifier application.properties

```bash
# Fichier: demo/src/main/resources/application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/notes_db
spring.datasource.username=postgres
spring.datasource.password=postgres
```

Définissez explicitement les variables d'environnement (recommandé) :

```bash
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/notes_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
```

### Démarrer le Backend (Terminal 1)

```bash
cd "C:\Users\PC\eclipse-workspace\demo\Notes\demo"
mvnw.cmd spring-boot:run
```

Attendez le message :
```
Tomcat started on port(s): 8080 (http)
```

### 5️ Démarrer le Frontend (Terminal 2)

```bash
cd "C:\Users\PC\eclipse-workspace\demo\Notes\Front"
npm install
ng serve
```

Attendez :
```
✔ Compiled successfully
Local: http://localhost:4200
```

---

## 🧪 Tester l'Application

### **1. Page d'Accueil**

Ouvrez http://localhost:4200

Vous devez voir **2 onglets** :
- Se Connecter
- S'Inscrire

### **2. Login Admin**

Tab "Se Connecter" :
```
Email : admin@notes.com
Mot de passe : 12345678
Cliquez "Se connecter"
```

**Résultat attendu** → Redirection vers `/admin` 

### **3. Créer un Étudiant**

Tab "S'Inscrire" (tant qu'admin) :
```
Email : etudiant1@test.com
Mot de passe : motdepasse123
Sélectionner UEs : ✓ STA103, ✓ STA102
Cliquez "Créer un Compte Étudiant"
```

**Résultat attendu** → Message succès 

### **4. Attribuer une Note (Admin)**

Dashboard Admin :
1. Tab "Attribuer des Notes"
2. Sélectionnez étudiant : `etudiant1@test.com`
3. UE s'affiche : `STA103`
4. Entrez note : `15.5`
5. Cliquez "Attribuer la Note"

**Résultat attendu** → Note attribuée 

### **5. Voir les Notes (Étudiant)**

1. Logout (bouton rouge)
2. Login en tant que étudiant :
   ```
   Email : etudiant1@test.com
   Mot de passe : motdepasse123
   ```
3. Vous êtes sur `/student` → "Mon Espace Personnel" 
4. Vous voyez :
   - UE **STA103** (card)
   - Note **15.5/20**
   - Tableau résumé

---

##  Troubleshooting

###  Backend n'a pas accès à PostgreSQL

**Solution** :
```bash
# Vérifiez que PostgreSQL écoute sur 5432
netstat -an | findstr "5432"

# Ou testez la connexion
psql -U postgres -d notes_db -c "SELECT 1;"
```

###  Frontend ne peut pas appeler le backend

**Solution** : Vérifiez CORS dans SecurityConfig
```java
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201"})
```

### Port 4200 déjà utilisé

**Solution** :
```bash
# Option 1 : Tuer le processus
netstat -ano | findstr ":4200"
taskkill /PID <PID> /F

# Option 2 : Utiliser un autre port
ng serve --port 4201
```

### Docker compose ne démarre pas

**Solution** :
```bash
# Nettoyez tout
docker-compose down -v

# Vérifiez les logs
docker-compose logs

# Relancez
docker-compose up -d
```

---

## Architecture

```
Notes App (localhost:4200)
    ├── Login/Register (HomeComponent)
    ├── Admin Dashboard (/admin)
    │   ├── Gérer les Étudiants
    │   └── Attribuer des Notes
    └── Student Dashboard (/student)
        ├── Voir les UEs
        └── Voir les Notes

    Backend (localhost:8080)
    ├── /auth/login
    ├── /api/ues (GET - liste UEs)
    ├── /api/admin/students (POST - créer étudiant)
    ├── /api/admin/grades (POST - attribuer note)
    └── /api/student/grades/{studentId}

    Database (PostgreSQL, localhost:5432)
    ├── users (admin + étudiants)
    ├── ues (4 UEs prédéfinies)
    ├── students (lien avec users)
    ├── student_ue (many-to-many)
    └── grades (notes)
```

---

##  Comptes Par Défaut

**Admin** (créé automatiquement) :
```
Email: admin@notes.com
Mot de passe: 12345678
Rôle: ROLE_ADMIN
```

**Étudiants** : Créés via le formulaire Registration

---

## Notes

- `ddl-auto: create-drop` = BDD recréée à chaque démarrage (dev seulement)
- Pour production : changez en `validate` ou `update`
- UEs prédéfinies (STA103, STA102, STA101, STA100) créées automatiquement

---

##  Prochaines Étapes

1. Tests manuels (comme expliqué ci-dessus)
2. Tests E2E Cypress
3. Déployer sur serveur production
4. Configurer HTTPS + Reverse Proxy (Nginx/Apache)

---

**Questions ?** Consultez les logs ou relancez les commandes !

# Deployment & Operations Guide

This guide details the deployment, container orchestration, environment configuration, database management, and operational maintenance for the **Cutlet Spring** full-stack monorepo.

---

## 1. Architecture Overview

Cutlet Spring is deployed as a modular, three-tier production architecture:

```
                      Internet / Client Browsers
                                  │
                                  ▼
             ┌─────────────────────────────────────────┐
             │      Frontend Service (Port 80/443)     │
             │   - Nginx Alpine Reverse Proxy & SPA    │
             │   - Gzip compression, Security headers  │
             │   - Proxies `/api/*` to Backend         │
             └────────────────────┬────────────────────┘
                                  │ internal network (port 8080)
                                  ▼
             ┌─────────────────────────────────────────┐
             │       Backend Service (Port 8080)       │
             │   - Eclipse Temurin 21 JRE Container    │
             │   - Unprivileged `cutlet` user (1001)   │
             │   - Spring Boot 4.1.0 WebMVC + Security │
             │   - Flyway automated DB migrations      │
             └───────────┬─────────────────┬───────────┘
                         │                 │
                         ▼                 ▼
             ┌───────────────────────┐ ┌──────────────────────┐
             │   PostgreSQL 16 DB    │ │  Cloudinary Media    │
             │   - Port 5432         │ │  CDN & Cloud Storage │
             │   - Persistent Volume │ │  (Backend API Only)  │
             └───────────────────────┘ └──────────────────────┘
```

> **Design Principle Note**: Cutlet Spring operates strictly without Redis. All session persistence, administrative states, and catalog records are safely managed by PostgreSQL and secure HTTP sessions.

---

## 2. Prerequisites

Before deploying Cutlet Spring, ensure your host environment meets the following specifications:

- **Docker Engine**: Version 24.0.0 or later
- **Docker Compose**: Version 2.20.0 or later
- **RAM**: Minimum 2 GB available RAM (4 GB recommended for production)
- **Disk**: 10 GB available storage for container images and PostgreSQL persistent volumes
- **Network Ports**: Available ports `80` (HTTP frontend), `8080` (backend direct access if enabled), `5432` (PostgreSQL direct access if exposed).

---

## 3. Quickstart: Docker Compose Deployment

### Step 1: Clone and Configure Environment

```bash
git clone https://github.com/myapah76/cutlet_spring.git
cd cutlet_spring

# Copy root environment file from template
cp env/.env.example .env
```

Edit `.env` to configure your production credentials:

```dotenv
# PostgreSQL Configuration
POSTGRES_DB=cutlet_spring
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_postgres_password_here

# Backend Database Connection
DATABASE_URL=jdbc:postgresql://postgres:5432/cutlet_spring
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_secure_postgres_password_here

# Spring Boot Configuration
SPRING_PROFILES_ACTIVE=prod
CORS_ALLOWED_ORIGINS=http://localhost,http://localhost:80,https://cutletspring.com

# Initial Administrator Seed
INITIAL_ADMIN_EMAIL=admin@cutletspring.com
INITIAL_ADMIN_PASSWORD=your_strong_admin_password_here

# Cloudinary CDN Credentials
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Step 2: Build and Start Containers

```bash
docker compose up --build -d
```

### Step 3: Verify Container Health

Check the status of all three containers:

```bash
docker compose ps
```

Expected output:
```text
NAME                     IMAGE                  COMMAND                  SERVICE      STATUS                    PORTS
cutlet-spring-postgres   postgres:16-alpine     "docker-entrypoint.s…"   postgres     Up (healthy)              0.0.0.0:5432->5432/tcp
cutlet-spring-backend    cutlet_spring-backend  "java -cp @/app/jib-…"   backend      Up (healthy)              0.0.0.0:8080->8080/tcp
cutlet-spring-frontend   cutlet_spring-frontend "nginx -g 'daemon of…"   frontend     Up (healthy)              0.0.0.0:80->80/tcp
```

### Step 4: Access the Application

- **Atelier Storefront**: Navigate to `http://localhost` (or your domain).
- **Admin Management Portal**: Click the **Admin** shield icon in the top header or navigate to the admin section to log in using:
  - **Email**: `admin@cutletspring.com` (or your configured `INITIAL_ADMIN_EMAIL`)
  - **Password**: `admin123` (or your configured `INITIAL_ADMIN_PASSWORD`)
- **Backend Swagger OpenAPI Docs**: `http://localhost:8080/swagger-ui.html`
- **Actuator Health Check**: `http://localhost:8080/actuator/health`

---

## 4. Local Development (Without Docker)

If developing locally without containers:

### 1. Database Setup
Start a local PostgreSQL instance:
```bash
createdb -U postgres cutlet_spring
```

### 2. Backend Startup
```bash
cd be

# Run with local profile (connects to localhost:5432/cutlet_spring)
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```
On Windows:
```powershell
cd be
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev
```
Flyway will automatically execute all database migrations (`V1` through `V5`), populate the 38 signature menu items, and initialize the default administrator account.

### 3. Frontend Startup
```bash
cd fe
npm install
npm run dev
```
The Vite development server will start at `http://localhost:5173` with full hot-reloading and proxying to `http://localhost:8080`.

---

## 5. Cloudinary Media Migration

Cutlet Spring includes an automated migration utility (`scripts/migrate-images-to-cloudinary.mjs`) to upload all localized menu photography to Cloudinary and associate the generated secure URLs in PostgreSQL.

### Execution

```bash
# Ensure backend is running and CLOUDINARY credentials are set in .env
cd scripts
npm install

# Run migration script
node migrate-images-to-cloudinary.mjs
```

The script performs the following:
1. Obtains a CSRF token from `GET /api/auth/csrf`.
2. Authenticates against `POST /api/auth/login` using the administrative account.
3. Iterates over all local menu images located in `fe/public/images/menu/`.
4. Uploads each file via multipart form submission to `POST /api/admin/menu/{id}/image`.
5. Cloudinary stores the image and returns a secure HTTPS URL and public ID.
6. The backend updates the PostgreSQL `menu_items` record.

---

## 6. Database Maintenance & Backups

### Automated Migrations (Flyway)
Database schema evolutions are managed strictly through Flyway scripts located in `be/src/main/resources/db/migration/`:
- `V1__create_admin_and_config_tables.sql`
- `V2__create_category_tables.sql`
- `V3__create_menu_tables.sql`
- `V4__create_menu_options_tables.sql`
- `V5__seed_initial_data.sql`

Migrations run automatically upon container startup before the Spring Boot ApplicationContext completes initialization.

### Backing Up the Database

To create a consistent SQL dump from the running PostgreSQL container:

```bash
docker compose exec -t postgres pg_dump -U postgres cutlet_spring > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restoring the Database

To restore from a backup file:

```bash
# Terminate active connections and restore
docker compose exec -T postgres psql -U postgres -d cutlet_spring < backup_file.sql
```

---

## 7. Monitoring, Logs & Observability

### Health Checks

The system exposes two primary health probes:
- **Frontend Nginx**: `GET /health` returns `200 OK` (verifies web server availability).
- **Backend Spring Boot Actuator**: `GET /actuator/health` returns `{"status":"UP","components":{"db":{"status":"UP"},"diskSpace":{"status":"UP"}}}`.

### Container Logs

```bash
# View aggregated real-time logs
docker compose logs -f

# View backend logs specifically
docker compose logs -f backend

# View frontend access and error logs
docker compose logs -f frontend
```

---

## 8. Security Hardening Checklist for Production

1. **Change Default Administrator Credentials**:
   Always set a complex `INITIAL_ADMIN_PASSWORD` in your production environment before the first launch.
2. **Enforce HTTPS / SSL Termination**:
   Deploy an SSL terminating proxy (e.g. AWS Application Load Balancer, Cloudflare, Traefik, or Caddy) in front of the Nginx container, and enable `secure: true` for session cookies.
3. **Restrict CORS Origins**:
   Ensure `CORS_ALLOWED_ORIGINS` in `.env` contains only your exact production domain (e.g. `https://cutletspring.com`), preventing cross-origin invocation.
4. **Cloudinary Key Secrecy**:
   Ensure `CLOUDINARY_API_SECRET` is never committed to source control or exposed in frontend code bundles.
5. **Database Port Protection**:
   In high-security production environments, remove the `ports:` mapping `5432:5432` from `docker-compose.yml` so that PostgreSQL is accessible only within the internal Docker network.


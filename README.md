# 🍱 Cutlet Spring — 봄돈까스
### Artisanal Japanese-Korean Tonkatsu Atelier — Full-Stack Monorepo

[![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.1.0-6DB33F?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![Spring Security](https://img.shields.io/badge/Spring_Security-Session_Auth-green?style=flat-square&logo=springsecurity)](https://spring.io/projects/spring-security)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Flyway](https://img.shields.io/badge/Flyway-12.4.0-CC0202?style=flat-square&logo=flyway)](https://flywaydb.org/)
[![React](https://img.shields.io/badge/React-19.x-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38b2ac?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)

---

## 📖 Overview

**Cutlet Spring (봄돈까스)** is an artisanal Japanese-Korean Tonkatsu atelier web application and administrative management system. 

Modeled after high-end omakase counter ateliers, Cutlet Spring combines traditional Japanese precision katsu techniques with nostalgic Korean 경양식 (Gyeongyangsik) culinary heritage. The application features an **Editorial Magazine Layout** with quad-language display (Korean, English, Japanese, and Vietnamese), rich dish specifications (cut anatomy, portion weights, panko grain size, fry times), and an administrative back-office portal.

### Dining Atelier Concept & Scope
> **Walk-In Counter Model**: To preserve culinary integrity, Cutlet Spring operates as a walk-in dining counter with limited daily portions. Digital online ordering and advance table reservations are intentionally excluded. The platform focuses exclusively on immersive menu discovery, ingredient philosophy, dish pairing exploration, and comprehensive administrative catalog and media management.

---

## 🏛️ Monorepo Architecture

The repository is structured as a production-grade monorepo containing the Java Spring Boot backend, the React 19 frontend, containerization configurations, and CI/CD pipelines:

```
cutlet_spring/
├── be/                          # Backend Service (Java 21, Spring Boot 4.1.0)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/cutletspring/
│   │   │   │   ├── auth/        # Spring Security, session auth, CSRF, admin management
│   │   │   │   ├── category/    # Menu categories API & admin management
│   │   │   │   ├── menu/        # Dishes, sizes, sauces, add-ons API & admin management
│   │   │   │   ├── cloudinary/  # Cloudinary image upload, replacement, deletion
│   │   │   │   └── shared/      # Unified ApiResponse, exception handlers, OpenAPI
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       ├── application-dev.yml
│   │   │       ├── application-prod.yml
│   │   │       └── db/migration/ # Flyway migrations (V1 to V7)
│   │   └── test/                # JUnit 5 & Mockito integration test suite (43 tests passing)
│   ├── Dockerfile               # Multi-stage Eclipse Temurin 21 JRE container
│   ├── pom.xml                  # Maven dependencies & build configuration
│   └── mvnw / mvnw.cmd          # Maven wrapper binaries
│
├── fe/                          # Frontend Application (React 19, TypeScript, Vite)
│   ├── src/
│   │   ├── components/          # Atelier layout, navigation, and modal dialogues
│   │   ├── features/
│   │   │   ├── home/            # Philosophy, 4 culinary pillars, signature platter
│   │   │   ├── menu/            # Editorial scroll-spy menu & item detail atelier modal
│   │   │   └── admin/           # Dedicated Admin Portal: Dashboard, Menu (4-lang tabs + animated toggle),
│   │   │                        # Walk-in desk, Counter seating, Restaurant settings, Account management
│   │   ├── hooks/               # useAuth, useMenu custom React hooks
│   │   ├── lib/                 # Axios instance with credentials & CSRF interceptors
│   │   ├── services/            # authService, adminService, menuService
│   │   └── stores/              # Zustand stores (useAuthStore, useUIStore)
│   ├── Dockerfile               # Multi-stage Node 22 + Nginx Alpine container
│   ├── nginx.conf               # SPA routing, gzip compression, reverse proxy
│   └── package.json             # NPM dependencies & scripts
│
├── env/                         # Environment configuration templates
│   ├── .env.example             # Docker Compose master environment variables
│   ├── backend.env.example      # Standalone backend variables
│   └── frontend.env.example     # Standalone frontend variables
│
├── docs/                        # Technical Architecture Documentation
│   ├── architecture.md          # Full system architecture, security model, and rationale
│   ├── database-design.md       # PostgreSQL schema, ERD, and migration breakdown
│   ├── api-contract.md          # OpenAPI REST contract & payload specifications
│   └── deployment.md            # Production deployment, Docker, and backup guide
│
├── scripts/                     # Automation & Migration Utilities
│   └── migrate-images-to-cloudinary.mjs # Automated Cloudinary image migration CLI
│
├── .github/workflows/           # GitHub Actions CI/CD Pipelines
│   ├── ci.yml                   # Monorepo CI: Maven test + Vite lint/build
│   ├── deploy-backend.yml       # Backend container build & deployment
│   └── deploy-frontend.yml      # Frontend container build & deployment
│
├── docker-compose.yml           # Root multi-container orchestration
└── README.md                    # Root project documentation
```

---

## 🛠️ Tech Stack & Key Choices

| Tier | Technology | Description |
| :--- | :--- | :--- |
| **Backend** | Java 21, Spring Boot 4.1.0 | High-performance, modern Java runtime with virtual-thread capability |
| **Security** | Spring Security 6 | Server-side HTTP sessions, `HttpOnly` session cookies, `CookieCsrfTokenRepository`, BCrypt |
| **Database** | PostgreSQL 16 | Relational database engine for catalog, admin accounts, and atelier metadata |
| **Migrations** | Flyway 12.4.0 | Version-controlled, idempotent schema migrations (V1 to V7) |
| **Media Storage**| Cloudinary | Cloud-hosted CDN media pipeline for menu photography |
| **Frontend** | React 19, TypeScript | Strict typed single-page application with contemporary concurrency |
| **Styling** | Tailwind CSS v4 | Warm editorial palette (`#fbf9f6`, `#af101a`, `#1b1c1a`) & typography |
| **State** | Zustand | Lightweight client-side state management for auth and UI filters |
| **Networking** | Axios | Configured with `withCredentials: true` and automated CSRF token propagation |
| **Proxy / Web** | Nginx Alpine | Serves frontend static assets and reverse-proxies `/api/` calls to the backend |
| **Cache/Store** | **Zero Redis** | Designed strictly without Redis or JWT dependencies for operational simplicity |

---

## 🚀 Quickstart: Docker Compose

The fastest way to run the entire Cutlet Spring stack locally:

```bash
# 1. Clone repository
git clone https://github.com/myapah76/cutlet_spring.git
cd cutlet_spring

# 2. Initialize environment configuration
cp env/.env.example .env

# 3. Build and launch containers
docker compose up --build -d
```

### Access Endpoints:
- **Atelier Storefront**: [http://localhost](http://localhost) (Customer dining menu, zero admin buttons)
- **Admin Management Portal**: [http://localhost/admin](http://localhost/admin) (Dedicated route; login at `/admin/login`)
- **Backend API & Swagger Docs**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **Actuator Health Probe**: [http://localhost:8080/actuator/health](http://localhost:8080/actuator/health)

---

## 💻 Local Development Setup (Manual)

### 1. Database Setup
Ensure PostgreSQL 16 is installed and running:
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
*The database migrations will run automatically on startup, populating the 38 signature menu items, categories, options, and default administrator credentials.*

### 3. Frontend Startup
```bash
cd fe
npm install
npm run dev
```
The Vite development server will start at `http://localhost:5173`.

---

## 🔐 Administrative Access & Credentials

The application initializes with an administrative account on startup via `AdminInitializer`:

- **Email**: `admin@cutletspring.com` (configurable via `INITIAL_ADMIN_EMAIL`)
- **Password**: `admin123` (configurable via `INITIAL_ADMIN_PASSWORD`)

### Admin Capabilities:
1. **Catalog Overview**: Real-time view of all dishes across Japanese, Korean, Curry, Noodle, and Add-on categories.
2. **Item Creation & Modification**: Add or update dish titles, quad-language descriptions, pricing, portion weights, cut types, tags, and preparation notes.
3. **Daily Availability Toggle**: Instant one-click active/inactive toggle to manage daily limited portions.
4. **Cloudinary Media Upload**: Upload high-resolution dish photography directly to Cloudinary with automatic PostgreSQL record linkage.
5. **Secure Password Change**: Authenticated administrators can update credentials directly with policy enforcement (8-72 chars, upper/lower/digit/special) and automatic active session invalidation.
6. **Self-Service Password Recovery**: Unauthenticated administrators can recover passwords via email OTP verification, featuring resend cooldowns, attempt lockouts, single-use reset tokens, and zero JWT/Redis dependencies.

---

## ☁️ Cloudinary Image Asset Migration

To migrate local sample images from `fe/public/images/menu/` to your Cloudinary media account:

```bash
# 1. Set your credentials in .env
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret

# 2. Run the automated migration script
cd scripts
node migrate-images-to-cloudinary.mjs
```

The script will log in as the administrator, obtain a CSRF token, and upload each localized dish image to Cloudinary via `POST /api/admin/menu/{id}/image`.

---

## 🧪 Testing & Verification

### Backend Integration Tests (JUnit 5 & Mockito)
```bash
cd be
./mvnw test -o
```
On Windows:
```powershell
cd be
.\mvnw.cmd test -o
```
**Results**: 38 integration tests passing across `AuthControllerTests`, `PasswordRecoveryTests`, `CategoryControllerTests`, `MenuControllerTests`, `AdminMenuControllerTests`, `CloudinaryServiceTests`, and `CutletSpringApplicationTests`.

### Frontend Linting & Production Build
```bash
cd fe
# Verify TypeScript definitions and linting
npm run lint

# Compile optimized production bundle
npm run build
```

---

## 📚 Technical Documentation

For detailed architectural and engineering specifications:

- **[Architecture & Security](docs/architecture.md)** — Architectural patterns, Spring Security session model, CSRF lifecycle, and Cloudinary media pipeline.
- **[Database Design & ERD](docs/database-design.md)** — PostgreSQL schema structure, relational diagram, Flyway migration log, and indexing strategies.
- **[REST API Contract](docs/api-contract.md)** — Comprehensive OpenAPI endpoint catalog for public discovery and administrative management.
- **[Deployment & Operations Guide](docs/deployment.md)** — Docker Compose orchestration, production hardening, database backup/restoration, and health monitoring.

---

## 📜 License & Copyright

Developed for **Cutlet Spring (봄돈까스)**. All culinary and design rights reserved.

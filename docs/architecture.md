# Cutlet Spring - Full-Stack Architecture Manifesto

## 1. Overview & Business Model

Cutlet Spring (봄돈까스) is an artisanal Japanese-Korean tonkatsu dining atelier located in Thảo Điền, Ho Chi Minh City.

- **Walk-in Dining Atelier**: Dining is exclusively walk-in counter/table seating. By design, online customer order carts and advance table reservations are intentionally excluded from the software scope, centering the platform entirely around **culinary menu discovery**, **dish specifications & pairings**, and **administrative catalog management**.
- **Monorepo Structure**: The repository is organized as a unified full-stack monorepo featuring a Java 21 Spring Boot backend (`be/`) and a React 19 TypeScript Vite frontend (`fe/`).

```
cutlet_spring/
├── be/                          # Spring Boot Backend (Java 21, Spring Data JPA, Security)
├── fe/                          # React Frontend (React 19, TypeScript, Vite, Tailwind CSS)
├── env/                         # Environment configuration templates (.env.example, backend, frontend)
├── docs/                        # Engineering specifications & design documents
├── scripts/                     # Cloudinary image migration & operations utilities
├── .github/workflows/           # CI/CD pipelines (Monorepo CI, Backend Deploy, Frontend Deploy)
├── docker-compose.yml           # Multi-container orchestration (PostgreSQL + Backend + Frontend)
└── README.md                    # Root project documentation
```

---

## 2. Backend Architecture (`be/`)

The backend is built following the architectural patterns of the reference project **MH Consulting Backend**, adapted specifically for Cutlet Spring:

### 2.1 Technology Stack
- **Java**: 21 (LTS)
- **Framework**: Spring Boot 4.1.0
- **Security**: Spring Security with stateful HTTP sessions and CSRF protection
- **Database**: PostgreSQL 16 (H2 in-memory for testing)
- **Migrations**: Flyway 12.4.0 (5 versions: `V1` to `V5`)
- **Image Storage**: Cloudinary (HTTP5 SDK 2.0.0)
- **Documentation**: Springdoc OpenAPI / Swagger UI (3.0.3)
- **Architecture**: Domain-Driven Layering (Controller → Service → Repository → Entity/DTO)

### 2.2 Architectural Layers
```
be/src/main/java/com/cutletspring/
├── auth/                       # Administrator authentication & security
│   ├── config/                 # SecurityConfig, CsrfCookieFilter, AdminInitializer
│   ├── controller/             # AuthController (/api/auth/csrf, /login, /me, /logout)
│   ├── dto/                    # LoginRequest, AdminResponse
│   ├── entity/                 # Admin
│   ├── repository/             # AdminRepository
│   └── service/                # AdminDetailsService
├── category/                   # Menu category management
│   ├── controller/             # CategoryController (public), AdminCategoryController (admin)
│   ├── dto/                    # CategoryRequest, CategoryResponse
│   ├── entity/                 # MenuCategory
│   ├── repository/             # MenuCategoryRepository
│   └── service/                # MenuCategoryService
├── cloudinary/                 # Cloud-based image management
│   ├── config/                 # CloudinaryConfig
│   ├── dto/                    # CloudinaryUploadResult
│   └── service/                # CloudinaryService (upload, replace, delete, validation)
├── menu/                       # Dish catalog & options
│   ├── controller/             # MenuController (public), AdminMenuController (admin)
│   ├── dto/                    # MenuItemRequest, MenuItemResponse, options DTOs
│   ├── entity/                 # MenuItem, MenuItemSizeOption, MenuItemSauceOption, MenuItemAddon
│   ├── mapper/                 # MenuItemMapper
│   ├── repository/             # MenuItemRepository
│   └── service/                # MenuItemService
└── shared/                     # Cross-cutting concerns
    ├── config/                 # OpenApiConfig
    ├── exception/              # GlobalExceptionHandler, ResourceNotFoundException, BadRequestException
    └── response/               # ApiResponse, ApiErrorResponse
```

---

## 3. Authentication & Security (MH Consulting Pattern)

Security is implemented following the exact patterns from MH Consulting:

1. **Server-Side HTTP Sessions**:
   - Explicit `HttpSessionSecurityContextRepository` persistence.
   - Session identifiers are stored exclusively in HttpOnly, SameSite cookies (`JSESSIONID`).
   - Authentication tokens are **never** stored in browser `localStorage` or `sessionStorage`.
2. **CSRF Protection**:
   - Spring Security `CookieCsrfTokenRepository.withHttpOnlyFalse()` issues `XSRF-TOKEN` cookie.
   - `CsrfCookieFilter` guarantees that the DeferredCsrfToken is loaded on every request.
   - Frontend reads `XSRF-TOKEN` cookie and transmits header `X-XSRF-TOKEN` on all state-mutating requests (`POST`, `PUT`, `PATCH`, `DELETE`).
   - `/api/auth/csrf` allows immediate upfront initialization.
3. **Password Security**:
   - Passwords are hash-encoded using `BCryptPasswordEncoder`.
   - `AdminInitializer` provisions/syncs the initial admin account (`admin@cutletspring.com`) on startup.
4. **CORS Configuration**:
   - `allowCredentials: true` with strict allowed origins.
   - Exposes `Set-Cookie` and `X-XSRF-TOKEN` headers.
5. **No Redis Constraint**:
   - Explicit architectural requirement: zero reliance on Redis. Sessions, caching, and rate limiting run natively within JVM / PostgreSQL without Redis dependencies.
6. **Password Recovery & Change Architecture**:
   - **Authenticated Change Password** (`POST /api/auth/change-password`):
     - Requires active `ROLE_ADMIN` session and CSRF verification.
     - Validates current password using Spring Security `PasswordEncoder.matches()`.
     - Enforces centralized password policy: 8–72 characters, uppercase, lowercase, numeric digit, special character.
     - Rejects reusing the current password.
     - Encodes new password with BCrypt and commits to PostgreSQL.
     - Invalidates the current session and all concurrent sessions via `SessionRegistry.expireNow()`.
     - Automatically dispatches a security change notification email.
   - **Unauthenticated Forgot Password** (`POST /api/auth/forgot-password`, `POST /api/auth/verify-reset-otp`, `POST /api/auth/reset-password`):
     - Multi-step email OTP recovery model preserving session-based authentication without introducing JWT.
     - Cryptographically secure 6-digit random OTP generated via `SecureRandom`.
     - Only BCrypt salted hashes of OTPs and SHA-256 hashes of reset tokens are persisted in PostgreSQL.
     - Enforces 60-second cooldown per admin and 5-minute OTP expiry.
     - Maximum 5 failed verification attempts before permanent token invalidation / lockout.
     - Returns generic messages on request to prevent account enumeration.
     - Generates a short-lived (10-minute) single-use 64-hex reset token upon OTP verification.
     - Reset token is kept solely in frontend component memory (`useState`), never in `localStorage` or `sessionStorage`.
     - Upon password reset completion, old sessions are invalidated, outstanding reset tokens are consumed, and an alert email is sent.
     - Background scheduled job (`PasswordResetCleanupService`) runs hourly to purge expired/consumed tokens older than 24 hours.

---

## 4. Cloudinary Image Storage Pipeline

Administrator-managed dish photographs are stored exclusively in **Cloudinary**:

1. **Storage Rules**:
   - Menu photos are **never** committed to Git, stored in frontend `src/` or `public/`, or stored as SQL binary blobs.
   - PostgreSQL stores only the Cloudinary secure URL (`image_url`) and unique public ID (`image_public_id`).
2. **Asset Lifecycle**:
   - **Upload**: `POST /api/admin/menu/{id}/image` accepts multipart form data (`image/jpeg`, `image/png`, `image/webp` up to 10MB).
   - **Replacement**: When a dish photo is updated, `CloudinaryService.replaceImage()` deletes the old Cloudinary asset before saving the new one.
   - **Deletion**: When a photo is cleared, Cloudinary removes the asset and nullifies `image_url` in PostgreSQL.
   - **Local Dev / Test Mode**: When Cloudinary credentials are omitted, `CloudinaryService` simulates uploads gracefully with valid mock URLs, enabling offline testing.

---

## 5. Frontend Architecture (`fe/`)

The frontend is built with React 19, TypeScript, Vite, and Tailwind CSS:

```
fe/src/
├── components/                 # Shared components & editorial layout (Header, Footer)
├── constants/                  # System endpoints (API_ENDPOINTS, API_BASE_URL)
├── data/                       # Local offline fallback fixtures
├── enums/                      # Language, PageView enums
├── features/                   # Domain features
│   ├── admin/                  # AdminPortal, AdminLogin, AdminDishModal
│   ├── home/                   # HeroSection, PhilosophySection, FeedbackSection, LocationMap
│   └── menu/                   # MenuScreen, ItemDetailModal, DishCard, MenuSidebar, MenuSection
├── hooks/                      # Custom hooks (useMenu, useAuth)
├── lib/                        # Axios instance (withCredentials, CSRF interceptor), apiClient wrapper
├── services/                   # Service layer (menuService, authService, adminService)
├── stores/                     # Zustand state (useUIStore, useAuthStore)
└── types/                      # TypeScript domain types (MenuItem, MenuCategory, AdminUser)
```

### Key Frontend Features:
- **Real Backend Integration**: `menuService` communicates with `/api/menu` and `/api/categories`.
- **Session Restoration**: `useAuthStore.checkAuth()` verifies current session against `/api/auth/me` on startup.
- **Admin Portal**: Integrated at view `'admin'`, featuring dish CRUD, toggle visibility, and multipart Cloudinary upload.
- **Atelier Visual Design**: Preserves editorial typography (`Cinzel`, `Noto Serif KR`, `Shippori Mincho`, `Plus Jakarta Sans`) and aesthetic palette (`#fbf9f6`, `#af101a`, `#1b1c1a`).

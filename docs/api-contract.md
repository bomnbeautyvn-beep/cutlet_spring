# Cutlet Spring - REST API Contract Specification

Base URL: `http://localhost:8080/api` (Local Development) / `/api` (Production Nginx Proxy)

---

## 1. Standard Response Formats

### 1.1 Success Response (`ApiResponse<T>`)
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2026-11-01T12:00:00Z"
}
```

### 1.2 Error Response (`ApiErrorResponse`)
```json
{
  "success": false,
  "code": "BAD_REQUEST",
  "message": "Detailed error explanation",
  "errors": {
    "field": ["Field validation constraint violation"]
  },
  "timestamp": "2026-11-01T12:00:00Z"
}
```

### 1.3 Common HTTP Status Codes
- `200 OK`: Request succeeded.
- `201 CREATED`: Entity successfully created.
- `400 BAD REQUEST`: Invalid input format or validation failure.
- `401 UNAUTHORIZED`: Authentication required or invalid credentials.
- `403 FORBIDDEN`: Admin role required.
- `404 NOT FOUND`: Target entity does not exist.
- `409 CONFLICT`: Unique constraint conflict.
- `500 INTERNAL SERVER ERROR`: Unhandled server exception.

---

## 2. Authentication Endpoints (`/api/auth`)

### 2.1 Initialize CSRF Token
- **Endpoint**: `GET /api/auth/csrf`
- **Access**: Public
- **Sets Cookie**: `XSRF-TOKEN` (HttpOnly: false)
- **Response**:
```json
{
  "success": true,
  "message": "CSRF token initialized",
  "data": {
    "token": "4f8a9c2b-...",
    "headerName": "X-XSRF-TOKEN"
  }
}
```

### 2.2 Administrator Login
- **Endpoint**: `POST /api/auth/login`
- **Access**: Public (requires valid credentials)
- **Sets Cookie**: `JSESSIONID` (HttpOnly: true, SameSite: Lax)
- **Request Body**:
```json
{
  "email": "admin@cutletspring.com",
  "password": "admin123"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "admin-default-id",
    "email": "admin@cutletspring.com",
    "fullName": "Cutlet Spring Administrator",
    "role": "ROLE_ADMIN",
    "active": true
  }
}
```

### 2.3 Get Current Administrator
- **Endpoint**: `GET /api/auth/me`
- **Access**: Authenticated Session
- **Response**: Returns current `AdminResponse` if session is valid; `401 Unauthorized` otherwise.

### 2.4 Administrator Logout
- **Endpoint**: `POST /api/auth/logout`
- **Access**: Public / Session
- **Clears**: Session invalidation on server, clears security context.

### 2.5 Change Password
- **Endpoint**: `POST /api/auth/change-password`
- **Access**: Authenticated Administrator (`ROLE_ADMIN` session + CSRF token)
- **Request Body**:
```json
{
  "currentPassword": "old-admin-password",
  "newPassword": "NewStrongP@ssw0rd2026!",
  "confirmNewPassword": "NewStrongP@ssw0rd2026!"
}
```
- **Password Policy**: 8-72 characters, at least 1 uppercase, 1 lowercase, 1 digit, 1 special character. Must not match current password.
- **Security Action**: Validates current password, updates BCrypt hash, invalidates all active sessions for the administrator, sends security confirmation email, and requires re-login.
- **Response**:
```json
{
  "success": true,
  "message": "Password changed successfully. Please log in again with your new password.",
  "data": null
}
```

### 2.6 Forgot Password (Request OTP)
- **Endpoint**: `POST /api/auth/forgot-password`
- **Access**: Public (requires CSRF token)
- **Request Body**:
```json
{
  "email": "admin@cutletspring.com"
}
```
- **Security Behavior**: Generates cryptographically secure 6-digit OTP, hashes OTP using BCrypt before storing in PostgreSQL, dispatches branded HTML email via SMTP, enforces 60-second cooldown and 5-minute expiration. Returns generic message to prevent account enumeration.
- **Response**:
```json
{
  "success": true,
  "message": "If the account exists, password reset instructions have been sent.",
  "data": null
}
```

### 2.7 Verify Reset OTP
- **Endpoint**: `POST /api/auth/verify-reset-otp`
- **Access**: Public (requires CSRF token)
- **Request Body**:
```json
{
  "email": "admin@cutletspring.com",
  "otp": "839102"
}
```
- **Security Behavior**: Verifies against stored BCrypt hash, increments failure count (locks out after 5 failed attempts), generates single-use 64-hex-character reset token, stores SHA-256 hash in PostgreSQL with 10-minute validity.
- **Response**:
```json
{
  "success": true,
  "message": "Verification code confirmed",
  "data": {
    "resetToken": "a3f59e...",
    "expiresInSeconds": 600
  }
}
```

### 2.8 Reset Password
- **Endpoint**: `POST /api/auth/reset-password`
- **Access**: Public (requires CSRF token)
- **Request Body**:
```json
{
  "email": "admin@cutletspring.com",
  "resetToken": "a3f59e...",
  "newPassword": "BrandNewP@ssw0rd2026!",
  "confirmNewPassword": "BrandNewP@ssw0rd2026!"
}
```
- **Security Behavior**: Validates reset token against SHA-256 hash, checks token has not been consumed or expired, verifies password policy, encodes new password with BCrypt, marks token consumed, invalidates all outstanding tokens and active sessions, dispatches confirmation email.
- **Response**:
```json
{
  "success": true,
  "message": "Password has been reset successfully. Please log in with your new password.",
  "data": null
}
```

---

## 3. Public Menu Endpoints (`/api/menu`, `/api/categories`)

### 3.1 Get Public Menu Items
- **Endpoint**: `GET /api/menu`
- **Access**: Public
- **Query Parameters**:
  - `category` (optional, string): Filter by category code (e.g. `japanese`, `korean`, `curry`, `noodles`).
- **Response**: Array of active `MenuItemResponse` objects ordered by `displayOrder`.

### 3.2 Get Featured Dishes
- **Endpoint**: `GET /api/menu/featured`
- **Access**: Public
- **Response**: Array of dishes where `isChefSignature = true` or `isBestSeller = true`.

### 3.3 Get Dish by ID
- **Endpoint**: `GET /api/menu/{id}`
- **Access**: Public
- **Response**: Complete dish details including portions, size variants, sauce options, and add-on pairings.
- **Example**:
```json
{
  "success": true,
  "data": {
    "id": "half-and-half-pork-cutlet",
    "category": "japanese",
    "nameEn": "Half & Half Pork Cutlet",
    "nameKr": "반반카츠",
    "nameJp": "ロース & ヒレかつ",
    "nameVi": "Tonkatsu 2 Nửa (Thăn Ngoại & Thăn Nội)",
    "price": 180,
    "priceFormatted": "180.000",
    "prepTimeMinutes": 15,
    "image": "/images/menu/japanese/half-and-half-pork-cutlet.jpg",
    "isBestSeller": true,
    "isChefSignature": false,
    "dishTypes": ["pork"],
    "tags": ["Best Seller", "Duo Cut"],
    "sizes": [],
    "sauceOptions": ["House Tonkatsu Sauce", "Wasabi & Pink Salt"],
    "addons": [
      { "id": "1", "name": "Extra Tenderloin 1pc", "price": 90 }
    ]
  }
}
```

### 3.4 Get Menu Categories
- **Endpoint**: `GET /api/categories`
- **Access**: Public
- **Response**: List of active categories ordered by `displayOrder`.

---

## 4. Administrative Endpoints (`/api/admin/menu`)

> **Security Requirement**: All administrative endpoints require an active HTTP session with `ROLE_ADMIN` and a valid `X-XSRF-TOKEN` request header for state mutations.

### 4.1 List Dishes (Paginated)
- **Endpoint**: `GET /api/admin/menu`
- **Query Parameters**:
  - `categoryId` (optional, string)
  - `active` (optional, boolean)
  - `page` (optional, int, default: 0)
  - `size` (optional, int, default: 20)
- **Response**: Spring Data `Page<MenuItemResponse>`.

### 4.2 Create Menu Dish
- **Endpoint**: `POST /api/admin/menu`
- **Request Body**:
```json
{
  "id": "black-truffle-katsu",
  "categoryId": "japanese",
  "nameEn": "Black Truffle Tenderloin Katsu",
  "nameKr": "블랙 트러플 안심카츠",
  "nameVi": "Set Tonkatsu Nấm Truffle",
  "basePrice": 290,
  "prepTimeMinutes": 18,
  "portionEn": "Set for 1 person",
  "descriptionEn": "Wet-aged tenderloin infused with genuine French black truffle oil.",
  "isChefSignature": true,
  "active": true
}
```
- **Response**: `201 Created` with created `MenuItemResponse`.

### 4.3 Update Menu Dish
- **Endpoint**: `PUT /api/admin/menu/{id}`
- **Request Body**: Same fields as creation.
- **Response**: `200 OK` with updated `MenuItemResponse`.

### 4.4 Toggle Active Visibility
- **Endpoint**: `PATCH /api/admin/menu/{id}/active`
- **Response**: `200 OK` with toggled `MenuItemResponse`.

### 4.5 Set Active Status Explicitly
- **Endpoint**: `PATCH /api/admin/menu/{id}/status`
- **Request Body**:
```json
{
  "active": true
}
```
- **Response**: `200 OK` with updated `MenuItemResponse`.

### 4.6 Deactivate Dish
- **Endpoint**: `DELETE /api/admin/menu/{id}`
- **Response**: `200 OK`.

### 4.7 Upload Dish Image to Cloudinary
- **Endpoint**: `POST /api/admin/menu/{id}/image`
- **Content-Type**: `multipart/form-data`
- **Form Param**: `file` (MultipartFile)
- **Constraints**: Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`. Max size: 10MB.
- **Behavior**:
  1. Validates image MIME type and file size.
  2. Deletes previous Cloudinary asset if an image was previously associated with the dish.
  3. Uploads new asset to Cloudinary folder `cutlet-spring`.
  4. Saves `image_url` and `image_public_id` in PostgreSQL.
  5. Returns updated `MenuItemResponse`.

---

## 5. Restaurant Settings Endpoints (`/api/restaurant` & `/api/admin/restaurant`)

### 5.1 Get Public Restaurant Settings
- **Endpoint**: `GET /api/restaurant/settings`
- **Access**: Public
- **Response**: `RestaurantSettingsDto` with 4-language name, slogans, addresses, operating hours, and dining policies.

### 5.2 Get Admin Restaurant Settings
- **Endpoint**: `GET /api/admin/restaurant/settings`
- **Access**: `ROLE_ADMIN` only
- **Response**: Full `RestaurantSettingsDto` including hall/counter capacities and VAT rates.

### 5.3 Update Restaurant Settings
- **Endpoint**: `PUT /api/admin/restaurant/settings`
- **Access**: `ROLE_ADMIN` only
- **Request Body**: Complete multilingual texts, hours, and policies.
- **Response**: `200 OK` with updated `RestaurantSettingsDto`.

### 5.4 Upload Atelier Logo
- **Endpoint**: `POST /api/admin/restaurant/settings/logo`
- **Access**: `ROLE_ADMIN` only
- **Content-Type**: `multipart/form-data`
- **Response**: Updated `RestaurantSettingsDto` with Cloudinary logo URL.

### 5.5 Upload Atelier Hero Banner
- **Endpoint**: `POST /api/admin/restaurant/settings/banner`
- **Access**: `ROLE_ADMIN` only
- **Content-Type**: `multipart/form-data`
- **Response**: Updated `RestaurantSettingsDto` with Cloudinary banner URL.

---

## 6. Admin Account Management Endpoints (`/api/admin/accounts`)
*Restricted to `ROLE_ADMIN`*

### 6.1 List Accounts
- **Endpoint**: `GET /api/admin/accounts`
- **Query Params**: `query` (optional string), `role` (optional: `ROLE_ADMIN`, `ROLE_STAFF`), `active` (optional boolean), `page`, `size`.
- **Response**: Paginated `AdminAccountDto`.

### 6.2 Create Account
- **Endpoint**: `POST /api/admin/accounts`
- **Request Body**:
```json
{
  "email": "chef.assistant@cutletspring.com",
  "fullName": "Chef Kim",
  "password": "CompliantPassword@2025",
  "role": "ROLE_STAFF"
}
```
- **Response**: `201 Created` with created `AdminAccountDto`.

### 6.3 Update Account
- **Endpoint**: `PUT /api/admin/accounts/{id}`
- **Request Body**: `{ "fullName": "string", "role": "ROLE_ADMIN" | "ROLE_STAFF" }`
- **Protection**: Cannot demote the last active `ROLE_ADMIN`.

### 6.4 Update Account Status (Activate / Deactivate)
- **Endpoint**: `PATCH /api/admin/accounts/{id}/status`
- **Request Body**: `{ "active": boolean }`
- **Security Protections**:
  - Self-deactivation protection: Cannot deactivate your own logged-in account.
  - Last admin protection: Cannot deactivate the last active `ROLE_ADMIN`.

### 6.5 Direct Password Reset
- **Endpoint**: `POST /api/admin/accounts/{id}/reset-password`
- **Request Body**: `{ "newPassword": "NewPassword@2025" }`

### 6.6 List Audit Logs
- **Endpoint**: `GET /api/admin/accounts/audit-logs`
- **Response**: Paginated `AccountAuditLog` with action, actor, timestamp, and details.

---

## 7. Live Admin Dashboard Metrics (`/api/admin/dashboard`)
*Accessible by `ROLE_ADMIN` and `ROLE_STAFF`*

### 7.1 Get Live Dashboard Stats
- **Endpoint**: `GET /api/admin/dashboard/stats`
- **Response**:
```json
{
  "totalDishes": 38,
  "activeDishes": 38,
  "inactiveDishes": 0,
  "totalCategories": 7,
  "activeCategories": 7,
  "totalAccounts": 2,
  "activeAccounts": 2,
  "isOpenNow": true,
  "currentSession": "LUNCH",
  "lunchHours": "11:00 - 15:00",
  "dinnerHours": "17:00 - 21:00",
  "lastOrderTime": "20:30",
  "capacityHall": 30,
  "capacityCounter": 10,
  "categoryDistribution": {
    "Japanese Tonkatsu": 7,
    "Korean Retro Tonkatsu": 4,
    "Curry Rice": 3,
    "Artisan Noodles": 4,
    "Atelier Add-ons": 6,
    "Signature Sauces": 6,
    "Beverages & Craft": 8
  }
}
```

---

## 8. Public Homepage CMS Endpoints (`/api/public`)
*Public read-only endpoints powering the customer Home page with zero hardcoding*

### 8.1 Consolidated Homepage Payload
- **Endpoint**: `GET /api/public/homepage`
- **Access**: Public
- **Description**: Returns all active homepage sections in their defined display order, active hero contents, active atelier ingredients, Google reviews summary with featured reviews, restaurant location, and dynamic header/footer configuration in a single performant request.
- **Response**:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "sections": [
      {
        "id": "sec-hero",
        "sectionKey": "hero",
        "titleEn": "Hero & Introduction",
        "titleKr": "히어로 & 소개",
        "titleVi": "Phần Mở Đầu & Giới Thiệu",
        "titleJp": "ヒーロー & イントロダクション",
        "displayOrder": 1,
        "isActive": true
      },
      {
        "id": "sec-ingredients",
        "sectionKey": "ingredients",
        "titleEn": "Ingredients",
        "titleKr": "원재료의 미학",
        "titleVi": "Nguyên Liệu Tuyển Chọn",
        "titleJp": "厳選素材",
        "displayOrder": 2,
        "isActive": true
      }
    ],
    "hero": {
      "titleEn": "The Art of Hand Crafted Cutlets",
      "titleKr": "장인정신으로 빚어낸 수제 돈카츠의 미학",
      "titleVi": "Nghệ Thuật Tonkatsu Thủ Công",
      "titleJp": "職人技が紡ぐ手作りとんかつの芸術",
      "headlineEn": "Precision Fried Golden Tonkatsu",
      "ctaTextEn": "Explore Full Menu",
      "ctaTarget": "menu",
      "imageUrl": "https://res.cloudinary.com/.../hero.jpg",
      "metric1Value": "120h",
      "metric1LabelEn": "Wet-Aged Chilled Pork"
    },
    "ingredients": [
      {
        "id": "chilled-pork",
        "nameEn": "Chilled Pork",
        "nameKr": "냉장육",
        "nameVi": "Thịt Heo Mát",
        "nameJp": "チルドポーク",
        "descriptionEn": "120-hour wet-aged fresh chilled pork...",
        "imageUrl": "https://res.cloudinary.com/.../pork.jpg",
        "displayOrder": 1,
        "isActive": true
      }
    ],
    "reviewsSummary": {
      "averageRating": 4.8,
      "totalReviewsCount": 562,
      "googleMapsUrl": "https://www.google.com/maps/place/..."
    },
    "reviews": [
      {
        "id": "review-vietnamese",
        "reviewerName": "Bích Trâm 한유미",
        "reviewerInitials": "BT",
        "rating": 5,
        "reviewLanguage": "VI",
        "reviewContent": "Chội ôi donkatsu ở đây siu mềm siu ngon...",
        "ownerResponse": "Cutlet Spring cám ơn chị Bích Trâm ạ!...",
        "isFeatured": true
      }
    ],
    "restaurant": { ... },
    "headerFooter": {
      "logoUrl": "https://res.cloudinary.com/.../logo.png",
      "phoneNumber": "039 376 2717",
      "hotlineVisible": true,
      "brandNameEn": "CUTLET SPRING",
      "brandNameKr": "봄돈까스"
    }
  }
}
```

### 8.2 Additional Public Endpoints
- `GET /api/public/ingredients`: Active atelier ingredients list
- `GET /api/public/reviews`: Active curated Google reviews list
- `GET /api/public/reviews/summary`: Rating score, total review count, and Google Maps links
- `GET /api/public/header-footer`: Branding, notice policies, and hotline configuration

---

## 9. Admin Homepage CMS Management (`/api/admin/cms`)
*Administrative CMS operations protected by Spring Security HTTP Session + CSRF*

### 9.1 Sections
- `GET /api/admin/cms/sections`: List all sections (`ROLE_ADMIN`, `ROLE_STAFF`)
- `PUT /api/admin/cms/sections/{id}`: Update section titles and visibility (`ROLE_ADMIN`)
- `PUT /api/admin/cms/sections/reorder`: Reorder sections by ID sequence (`ROLE_ADMIN`)

### 9.2 Hero & Introduction
- `GET /api/admin/cms/hero`: Get hero configuration (`ROLE_ADMIN`, `ROLE_STAFF`)
- `PUT /api/admin/cms/hero`: Update 4-language titles, taglines, CTAs, and metrics (`ROLE_ADMIN`)
- `POST /api/admin/cms/hero/image`: Upload hero visual to Cloudinary (`ROLE_ADMIN`)

### 9.3 Ingredients
- `GET /api/admin/cms/ingredients`: List all ingredients (`ROLE_ADMIN`, `ROLE_STAFF`)
- `GET /api/admin/cms/ingredients/{id}`: Get ingredient details (`ROLE_ADMIN`, `ROLE_STAFF`)
- `POST /api/admin/cms/ingredients`: Create new 4-language ingredient (`ROLE_ADMIN`)
- `PUT /api/admin/cms/ingredients/{id}`: Update existing ingredient (`ROLE_ADMIN`)
- `PATCH /api/admin/cms/ingredients/{id}/status`: Toggle active status (`ROLE_ADMIN`)
- `DELETE /api/admin/cms/ingredients/{id}`: Delete ingredient and remove Cloudinary asset (`ROLE_ADMIN`)
- `POST /api/admin/cms/ingredients/{id}/image`: Upload ingredient visual to Cloudinary (`ROLE_ADMIN`)

### 9.4 Google Reviews
- `GET /api/admin/cms/reviews`: List all curated reviews (`ROLE_ADMIN`, `ROLE_STAFF`)
- `POST /api/admin/cms/reviews`: Add curated review with owner reply (`ROLE_ADMIN`)
- `PUT /api/admin/cms/reviews/{id}`: Update review and owner reply (`ROLE_ADMIN`)
- `PATCH /api/admin/cms/reviews/{id}/status`: Toggle review publication status (`ROLE_ADMIN`)
- `PATCH /api/admin/cms/reviews/{id}/featured`: Toggle featured badge (`ROLE_ADMIN`)
- `DELETE /api/admin/cms/reviews/{id}`: Delete curated review (`ROLE_ADMIN`)

### 9.5 Header & Footer Settings
- `GET /api/admin/cms/header-footer`: Get header and footer settings (`ROLE_ADMIN`, `ROLE_STAFF`)
- `PUT /api/admin/cms/header-footer`: Update logo, hotline, policies, and copyright (`ROLE_ADMIN`)
- `POST /api/admin/cms/header-footer/logo`: Upload brand logo to Cloudinary (`ROLE_ADMIN`)



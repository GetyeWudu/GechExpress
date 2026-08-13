# GechExpress — Accounts API Documentation

## 1. Overview

GechExpress uses **JWT (JSON Web Token) authentication**. After a successful registration or login, the backend issues two tokens:

- **Access token** — used to authenticate normal API requests. Short-lived.
- **Refresh token** — used only to obtain a new access token when the old one expires. Never send this as a normal `Authorization` header.

| Token | Purpose | Sent as |
|---|---|---|
| Access token | Authenticate API requests | `Authorization: Bearer ACCESS_TOKEN` |
| Refresh token | Obtain a new access token | In the request body of `/auth/token/refresh/` or `/auth/logout/` |

**Base URL (all endpoints below):**
```
http://127.0.0.1:8000/api/v1
```

**Accounts-specific base (used for auth endpoints):**
```
http://127.0.0.1:8000/api/v1/auth
```

Every protected request must include the access token in its headers:
```
Authorization: Bearer ACCESS_TOKEN
```

---

## 2. Register

Creates a new customer account. This is the entry point for any new user of the platform.

**URL**
```
POST /api/v1/auth/register/
```
Full development URL:
```
http://127.0.0.1:8000/api/v1/auth/register/
```

**Authentication:** Public — no access token required.

**Headers**
```
Content-Type: application/json
```

**Request format**
```json
{
    "email": "john@gmail.com",
    "password": "Password123!",
    "password_confirm": "Password123!",
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "0912345678"
}
```

**Field reference**

| Field | Type | Required | Description |
|---|---|---|---|
| email | string | Yes | User's email address |
| password | string | Yes | Minimum 8 characters |
| password_confirm | string | Yes | Must match `password` exactly |
| first_name | string | Yes | First name |
| last_name | string | Yes | Last name |
| phone_number | string | Yes | Phone number |

**Response format — success (`201 Created`)**
```json
{
    "user": {
        "id": 2,
        "email": "john@gmail.com",
        "first_name": "John",
        "last_name": "Doe",
        "phone_number": "0912345678",
        "role": "CUSTOMER",
        "account_status": "ACTIVE"
    },
    "tokens": {
        "access": "ACCESS_TOKEN",
        "refresh": "REFRESH_TOKEN"
    }
}
```

**Important frontend behavior:** a newly registered user automatically becomes `role = CUSTOMER` and `account_status = ACTIVE`. The frontend never sends `role` or `account_status` — the backend controls these values entirely, and any values submitted by the client are ignored.

**Error responses**

Invalid email (`400 Bad Request`):
```json
{
    "email": ["Enter a valid email address."]
}
```

Missing fields (`400 Bad Request`):
```json
{
    "password": ["This field is required."],
    "password_confirm": ["This field is required."]
}
```

Password mismatch (`400 Bad Request`):
```json
{
    "password": ["Passwords do not match."]
}
```

---

## 3. Login

Authenticates an existing user and issues a fresh token pair.

**URL**
```
POST /api/v1/auth/login/
```

**Authentication:** Public.

**Headers**
```
Content-Type: application/json
```

**Request format**
```json
{
    "email": "john@gmail.com",
    "password": "Password123!"
}
```

**Response format — success (`200 OK`)**
```json
{
    "user": {
        "id": 2,
        "email": "john@gmail.com",
        "first_name": "John",
        "last_name": "Doe",
        "phone_number": "0912345678",
        "role": "CUSTOMER",
        "account_status": "ACTIVE"
    },
    "tokens": {
        "access": "ACCESS_TOKEN",
        "refresh": "REFRESH_TOKEN"
    }
}
```

**Error responses**

Invalid credentials (`400 Bad Request`) — returned both for a nonexistent email and an incorrect password, intentionally, so the response never reveals whether an email exists in the system:
```json
{
    "non_field_errors": ["Invalid email or password."]
}
```

Suspended account:
```json
{
    "detail": "Your account is suspended."
}
```

Disabled / non-active account:
```json
{
    "detail": "Your account is not active."
}
```

**Frontend login flow**
```
Login form
    ↓
POST /auth/login/
    ↓
Receive access + refresh tokens
    ↓
Store authentication state
    ↓
Use access token for protected requests
```

The frontend should also persist `user.role` and `user.account_status` locally, since both are useful for controlling what the UI shows.

---

## 4. Refresh Access Token

Used to silently obtain a new access token once the old one expires, without forcing the user to log in again.

**URL**

Note: this endpoint lives outside `/auth/` because it's defined directly in `config/urls.py`.
```
POST /api/v1/auth/token/refresh/
```
Full URL:
```
http://127.0.0.1:8000/api/v1/auth/token/refresh/
```

**Authentication:** Public — the access token is not required here, only the refresh token in the body.

**Request format**
```json
{
    "refresh": "REFRESH_TOKEN"
}
```

**Response format — success (`200 OK`)**
```json
{
    "access": "NEW_ACCESS_TOKEN"
}
```

**Frontend usage pattern**
```
API request
    ↓
401 Unauthorized
    ↓
POST /auth/token/refresh/
    ↓
Send refresh token
    ↓
Receive new access token
    ↓
Retry original request
```

---

## 5. Logout

Invalidates the current session by blacklisting the refresh token.

**URL**
```
POST /api/v1/auth/logout/
```

**Authentication:** Required.

**Headers**
```
Authorization: Bearer ACCESS_TOKEN
Content-Type: application/json
```

**Request format**
```json
{
    "refresh": "REFRESH_TOKEN"
}
```

**Response format — success (`205 Reset Content`)**
```json
{
    "detail": "Successfully logged out."
}
```
The refresh token is blacklisted server-side and can no longer be used to obtain new access tokens.

**Error responses**

Missing refresh token (`400 Bad Request`):
```json
{
    "detail": "Refresh token is required."
}
```

Invalid refresh token (`400 Bad Request`):
```json
{
    "detail": "Invalid refresh token."
}
```

**Frontend logout flow**
```
Logout button
    ↓
POST /auth/logout/
    ↓
Backend blacklists refresh token
    ↓
Clear access token
    ↓
Clear refresh token
    ↓
Clear user/auth state
    ↓
Redirect to login
```

---

## 6. Change Password

Allows an already-authenticated user to change their own password.

**URL**
```
POST /api/v1/auth/password-change/
```

**Authentication:** Required.

**Headers**
```
Authorization: Bearer ACCESS_TOKEN
Content-Type: application/json
```

**Request format**
```json
{
    "current_password": "OldPassword123!",
    "new_password": "NewPassword123!",
    "confirm_new_password": "NewPassword123!"
}
```

**Response format — success (`200 OK`)**
```json
{
    "detail": "Password changed successfully."
}
```

**Error responses**

Incorrect current password (`400 Bad Request`):
```json
{
    "current_password": ["Current password is incorrect."]
}
```

Password mismatch (`400 Bad Request`):
```json
{
    "new_password": ["New passwords do not match."]
}
```

---

## 7. Password Reset Request

Starts the "forgot password" flow by emailing a reset link/token to the user.

**URL**
```
POST /api/v1/auth/password-reset-request/
```

**Authentication:** Public.

**Request format**
```json
{
    "email": "john@gmail.com"
}
```

**Response format — success (`200 OK`)**
```json
{
    "detail": "If an account exists, a reset email has been sent."
}
```

**Important security behavior:** this exact same response is returned regardless of whether the email exists in the system. For example, submitting:
```json
{
    "email": "doesnotexist@gmail.com"
}
```
still produces the same `200 OK` response above. This prevents attackers from using this endpoint to enumerate which emails are registered.

---

## 8. Google Login

Authenticates (or silently creates) a user via Google Sign-In.

**URL**
```
POST /api/v1/auth/google/
```

**Authentication:** Public.

**Request format**
```json
{
    "credential": "GOOGLE_ID_TOKEN"
}
```

**Important:** `credential` is **not** the user's email — it's the Google credential/ID token returned by Google Sign-In on the frontend, e.g.:
```json
{
    "credential": "eyJhbGciOiJSUzI1NiIs..."
}
```

**Error responses**

Missing credential (`400 Bad Request`):
```json
{
    "credential": ["This field is required."]
}
```

Invalid credential (`400 Bad Request`):
```json
{
    "detail": "Invalid Google credential."
}
```

**Note:** the real Google login flow is pending frontend integration testing. The intended end-to-end flow is:
```
Google Sign-In
      ↓
Google returns credential
      ↓
POST /auth/google/
      ↓
Backend verifies credential
      ↓
Find/create GechExpress user
      ↓
Return JWT
```

---

## 9. Admin User API — Overview

The admin endpoints live under a separate URL namespace from the auth endpoints above.

**Base URL**
```
http://127.0.0.1:8000/api/v1/admin
```

Every admin endpoint requires an admin-level access token:
```
Authorization: Bearer ADMIN_ACCESS_TOKEN
```

Available roles in the system:
- `CUSTOMER`
- `SELLER`
- `ADMIN`

---

## 10. Admin — List Users

**URL**
```
GET /api/v1/admin/users/
```

**Authentication:** Required — ADMIN role.

**Response format — success (`200 OK`)**

Returns a list of user objects, each shaped like:
```json
{
    "id": 2,
    "email": "mother@gmail.com",
    "first_name": "Emebet",
    "last_name": "Mother",
    "phone_number": "0912345678",
    "role": "CUSTOMER",
    "account_status": "ACTIVE",
    "is_active": true,
    "created_at": "2026-08-13T...",
    "updated_at": "2026-08-13T...",
    "last_login": "2026-08-13T..."
}
```

---

## 11. Admin — Get Single User

**URL**
```
GET /api/v1/admin/users/{id}/
```
Example:
```
GET /api/v1/admin/users/2/
```

**Authentication:** Required — ADMIN role.

**Response format — success (`200 OK`)**
```json
{
    "id": 2,
    "email": "mother@gmail.com",
    "first_name": "Emebet",
    "last_name": "Mother",
    "phone_number": "0912345678",
    "role": "CUSTOMER",
    "account_status": "ACTIVE",
    "is_active": true,
    "created_at": "...",
    "updated_at": "...",
    "last_login": "..."
}
```

**Error response:** if the user doesn't exist → `404 Not Found`.

---

## 12. Admin — Change User Role

**URL**
```
PATCH /api/v1/admin/users/{id}/role/
```
Example:
```
PATCH /api/v1/admin/users/2/role/
```

**Authentication:** Required — ADMIN role.

**Request format**
```json
{
    "role": "SELLER"
}
```
Valid values: `CUSTOMER`, `SELLER`, `ADMIN`.

**Response format — success (`200 OK`)**

Returns the updated user object, e.g.:
```json
{
    "id": 2,
    "email": "mother@gmail.com",
    "role": "SELLER",
    "account_status": "ACTIVE",
    "is_active": true
}
```

**Error response:** invalid role value (anything outside `CUSTOMER`/`SELLER`/`ADMIN`) → `400 Bad Request`, rejected by the serializer.

**Important business rules**
- An administrator cannot change their own role.
- The last active administrator in the system cannot be demoted.

---

## 13. Admin — Change Account Status

**URL**
```
PATCH /api/v1/admin/users/{id}/status/
```
Example:
```
PATCH /api/v1/admin/users/2/status/
```

**Authentication:** Required — ADMIN role.

**Request format**

Use one of the valid `account_status` values, e.g.:
```json
{
    "account_status": "SUSPENDED"
}
```

**Response format — success (`200 OK`)**

Returns the updated user object.

**Status synchronization behavior:** the service automatically keeps `is_active` in sync with `account_status`:
```
ACTIVE     →  is_active = true
SUSPENDED  →  is_active = false
```

**Important business rules**
- An admin cannot change their own status.
- The last active administrator cannot be suspended or deactivated.

---

## 14. Admin Filtering

The admin user list supports filtering by `role`, `account_status`, and `is_active`.

**Filter by role**
```
GET /api/v1/admin/users/?role=CUSTOMER
GET /api/v1/admin/users/?role=SELLER
GET /api/v1/admin/users/?role=ADMIN
```

**Filter by account status**
```
GET /api/v1/admin/users/?account_status=ACTIVE
GET /api/v1/admin/users/?account_status=SUSPENDED
```

**Filter by active state**
```
GET /api/v1/admin/users/?is_active=true
GET /api/v1/admin/users/?is_active=false
```

**Combining filters**

Filters can be combined freely. Example:
```
GET /api/v1/admin/users/?role=SELLER&account_status=ACTIVE
```
This means: *give me users whose role is SELLER **and** whose account status is ACTIVE.*

Another example:
```
GET /api/v1/admin/users/?role=SELLER&account_status=SUSPENDED
```

---

## 15. Admin Search

The backend supports free-text search across these fields:
```
search_fields = ["email", "first_name", "last_name", "phone_number"]
```

Usage:
```
GET /api/v1/admin/users/?search=mother
GET /api/v1/admin/users/?search=mother@gmail.com
GET /api/v1/admin/users/?search=0912345678
```

---

## 16. Admin Ordering

Supported ordering fields:
```
created_at
updated_at
email
first_name
last_name
role
account_status
last_login
```

**Ascending example**
```
GET /api/v1/admin/users/?ordering=email
```

**Descending example** (prefix the field with `-`)
```
GET /api/v1/admin/users/?ordering=-email
```

**Newest users first**
```
GET /api/v1/admin/users/?ordering=-created_at
```

**Oldest users first**
```
GET /api/v1/admin/users/?ordering=created_at
```

---

## 17. Admin — Combined Filtering, Search & Ordering

All of the above query parameters can be combined in a single request.

**Example**
```
GET /api/v1/admin/users/?role=SELLER&account_status=ACTIVE&search=john&ordering=-created_at
```

Breakdown of what this query does:

| Parameter | Value | Effect |
|---|---|---|
| role | SELLER | Only sellers |
| account_status | ACTIVE | Only active accounts |
| search | john | Matches email/first_name/last_name/phone_number containing "john" |
| ordering | -created_at | Newest first |

This kind of combined query is especially useful for building an admin dashboard with search + filter + sort controls.

---

## 18. Authorization Rules Summary

**Public endpoints** (no token required):
```
POST /auth/register/
POST /auth/login/
POST /auth/google/
POST /auth/password-reset-request/
POST /auth/token/refresh/
```

**Authenticated endpoints** (user access token required):
```
POST /auth/logout/
POST /auth/password-change/
```

**Admin endpoints** (admin access token required):
```
GET   /admin/users/
GET   /admin/users/{id}/
PATCH /admin/users/{id}/role/
PATCH /admin/users/{id}/status/
```

---

## 19. Recommended Frontend Authentication State

The React application should maintain a state object conceptually shaped like this:
```json
{
    "user": {
        "id": 2,
        "email": "mother@gmail.com",
        "first_name": "Emebet",
        "last_name": "Mother",
        "phone_number": "0912345678",
        "role": "CUSTOMER",
        "account_status": "ACTIVE"
    },
    "accessToken": "...",
    "refreshToken": "..."
}
```

This lets the frontend branch its UI based on role:
```
CUSTOMER  → customer interface
SELLER    → seller dashboard
ADMIN     → admin dashboard
```

**Important:** frontend role checks are for UI convenience only. The backend remains the sole source of truth for authorization — a user cannot become an admin simply by changing something in the React state or local storage.

---

## 20. Axios Request Pattern

An Axios interceptor can automatically attach the access token to every outgoing request, so it doesn't need to be added manually each time:
```javascript
axiosInstance.interceptors.request.use((config) => {
    const token = getAccessToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});
```

---

## 21. Recommended Frontend Project Structure

```
src/
├── api/
│   ├── client.js
│   └── accounts.js
│
├── auth/
│   ├── AuthContext.jsx
│   ├── authStorage.js
│   └── useAuth.js
│
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── ForgotPassword.jsx
│   ├── ChangePassword.jsx
│   └── ...
```

`accounts.js` should expose functions such as:
```
register()
login()
logout()
refreshToken()
changePassword()
requestPasswordReset()
googleLogin()
```

For the admin side:
```
getUsers()
getUser()
changeUserRole()
changeUserStatus()
```

---

## 22. Key Backend Behaviors to Remember

| Area | Behavior |
|---|---|
| Registration | Backend automatically sets `role = CUSTOMER` and `account_status = ACTIVE`; frontend cannot override these. |
| Login | Backend returns `user`, `access` token, and `refresh` token together. |
| Logout | Frontend must send the refresh token in the request body — it isn't inferred from the header. |
| Protected requests | Frontend sends the access token via `Authorization: Bearer ACCESS_TOKEN`. |
| Admin access | Only users with `role = ADMIN` should see the admin interface, but the backend enforces this regardless of what the frontend shows. |
| Seller access | Sellers will eventually get seller-specific features; permissions for these must also be enforced server-side. |

---

## 23. Full Endpoint Summary

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/auth/register/` | Public | Create customer account |
| POST | `/auth/login/` | Public | Log in |
| POST | `/auth/token/refresh/` | Refresh token | Get a new access token |
| POST | `/auth/logout/` | User | Log out (blacklists refresh token) |
| POST | `/auth/password-change/` | User | Change password |
| POST | `/auth/password-reset-request/` | Public | Request a password reset email |
| POST | `/auth/google/` | Public | Google authentication |
| GET | `/admin/users/` | Admin | List all users |
| GET | `/admin/users/{id}/` | Admin | Get a single user |
| PATCH | `/admin/users/{id}/role/` | Admin | Change a user's role |
| PATCH | `/admin/users/{id}/status/` | Admin | Change a user's account status |

# API Documentation

Version: 1.0
Base URL: `http://localhost:8080/api`

---

## Table of Contents

1. [Authentication](#authentication)
2. [Admin Endpoints](#admin-endpoints)
3. [Customer Endpoints](#customer-endpoints)
4. [Error Handling](#error-handling)
5. [Pagination](#pagination)
6. [Examples](#examples)

---

## Authentication

All admin endpoints require JWT authentication via the `Authorization` header.

### Headers

```http
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

### Token Lifecycle

- **Expiration:** 24 hours
- **Refresh:** Re-login required after expiration
- **Storage:** Client-side (localStorage recommended)

---

## Admin Authentication

### Register Admin

```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:** `201 Created`
```json
{
  "message": "Usuario registrado correctamente. Revisa tu email para activar la cuenta.",
  "userId": 1
}
```

**Validation Rules:**
- `password`: Minimum 8 characters
- `email`: Valid email format
- All fields required

---

### Activate Account

```http
GET /api/auth/activate/:token
```

**Parameters:**
- `token` (path): Activation token from email

**Response:** `200 OK`
```json
{
  "message": "Cuenta activada correctamente. Ya puedes iniciar sesión."
}
```

---

### Login

```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:** `200 OK`
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Errors:**
- `401`: Invalid credentials
- `401`: Account not activated

---

### Forgot Password

```http
POST /api/auth/forgot-password
```

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:** `200 OK`
```json
{
  "message": "Si el email existe, recibirás un enlace para restablecer tu contraseña."
}
```

Note: Same response for security (doesn't reveal if email exists)

---

### Reset Password

```http
POST /api/auth/reset-password/:token
```

**Parameters:**
- `token` (path): Reset token from email

**Request Body:**
```json
{
  "password": "NewSecurePass123"
}
```

**Response:** `200 OK`
```json
{
  "message": "Contraseña actualizada correctamente. Ya puedes iniciar sesión."
}
```

---

### Get Current User

```http
GET /api/auth/me
```

**Headers:** Requires `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

---

## Customer Authentication

Customer authentication follows the same pattern but with `/api/auth/customer` prefix.

### Endpoints

```http
POST   /api/auth/customer/register
GET    /api/auth/customer/activate/:token
POST   /api/auth/customer/login
POST   /api/auth/customer/forgot-password
POST   /api/auth/customer/reset-password/:token
GET    /api/auth/customer/me
```

**Key Differences:**
- No Redis session (JWT only)
- Token payload contains `customerId` instead of `userId`
- Protected routes use `verifyCustomerToken` middleware

---

## Admin Endpoints

All admin endpoints require authentication via `Authorization: Bearer <token>` header.

### Standard CRUD Pattern

Most admin resources follow this RESTful pattern:

```http
GET    /api/admin/{resource}           # List all (with pagination)
POST   /api/admin/{resource}           # Create new
GET    /api/admin/{resource}/:id       # Get single
PUT    /api/admin/{resource}/:id       # Update
DELETE /api/admin/{resource}/:id       # Delete (soft delete)
```

### Available Resources

- `users` - Admin users
- `customers` - Customer users
- `promoters` - Event promoters
- `events` - Events
- `event-categories` - Event categories
- `event-occurrences` - Event dates/times
- `event-prices` - Pricing tiers
- `customer-events` - Customer event registrations
- `faqs` - FAQ entries
- `heroes` - Hero banners
- `languages` - Language/locale settings
- `towns` - Location data
- `promoter-spots` - Promoter venues
- `bots` - Bot configurations
- `customer-bots` - Customer-bot relationships
- `customer-bot-chats` - Chat messages
- `emails` - Sent email tracking

---

### Example: Events Endpoint

#### List Events

```http
GET /api/admin/events?page=1&size=10
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `size` (optional): Items per page (default: 10)
- Any field name for filtering

**Response:** `200 OK`
```json
{
  "rows": [
    {
      "id": 1,
      "name": "Summer Music Festival",
      "description": "Annual summer festival",
      "categoryId": 2,
      "createdAt": "2026-01-15T10:00:00.000Z",
      "updatedAt": "2026-01-20T14:30:00.000Z"
    }
  ],
  "count": 25,
  "meta": {
    "total": 25,
    "pages": 3,
    "currentPage": 1,
    "size": 10
  }
}
```

---

#### Create Event

```http
POST /api/admin/events
```

**Request Body:**
```json
{
  "name": "Summer Music Festival",
  "description": "Annual summer festival featuring top artists",
  "categoryId": 2,
  "spotId": 5,
  "promoterId": 3
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "name": "Summer Music Festival",
  "description": "Annual summer festival featuring top artists",
  "categoryId": 2,
  "spotId": 5,
  "promoterId": 3,
  "createdAt": "2026-01-29T12:00:00.000Z",
  "updatedAt": "2026-01-29T12:00:00.000Z"
}
```

**Errors:**
- `422`: Validation error
- `401`: Unauthorized (missing/invalid token)

---

#### Get Single Event

```http
GET /api/admin/events/1
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Summer Music Festival",
  "description": "Annual summer festival",
  "categoryId": 2,
  "category": {
    "id": 2,
    "name": "Music"
  },
  "createdAt": "2026-01-15T10:00:00.000Z",
  "updatedAt": "2026-01-20T14:30:00.000Z"
}
```

**Errors:**
- `404`: Event not found

---

#### Update Event

```http
PUT /api/admin/events/1
```

**Request Body:**
```json
{
  "name": "Summer Music Festival 2026",
  "description": "Updated description"
}
```

**Response:** `200 OK`
```json
{
  "message": "El elemento ha sido actualizado correctamente."
}
```

---

#### Delete Event

```http
DELETE /api/admin/events/1
```

**Response:** `200 OK`
```json
{
  "message": "El elemento ha sido borrado correctamente."
}
```

Note: Soft delete (paranoid) - record marked as deleted but not removed from database.

---

### Customer-Bot Management

#### List Customer-Bot Relationships

```http
GET /api/admin/customer-bots?customerId=5
```

**Response:** `200 OK`
```json
{
  "rows": [
    {
      "id": 1,
      "customerId": 5,
      "botId": 1,
      "status": "active",
      "bot": {
        "id": 1,
        "name": "Support Bot"
      },
      "createdAt": "2026-01-29T10:00:00.000Z"
    }
  ],
  "count": 1,
  "meta": {
    "total": 1,
    "pages": 1,
    "currentPage": 1,
    "size": 10
  }
}
```

---

#### List Chat Messages

```http
GET /api/admin/customer-bot-chats?customerBotId=1&emisor=customer
```

**Query Parameters:**
- `customerBotId`: Filter by customer-bot relationship
- `emisor`: Filter by sender ('customer' or 'bot')

**Response:** `200 OK`
```json
{
  "rows": [
    {
      "id": 10,
      "customerBotId": 1,
      "emisor": "customer",
      "message": "Hello, I need help with my order",
      "customerBot": {
        "id": 1,
        "customer": {
          "id": 5,
          "name": "Jane Smith",
          "email": "jane@example.com"
        },
        "bot": {
          "id": 1,
          "name": "Support Bot"
        }
      },
      "createdAt": "2026-01-29T14:25:00.000Z"
    }
  ],
  "count": 15,
  "meta": {
    "total": 15,
    "pages": 2,
    "currentPage": 1,
    "size": 10
  }
}
```

---

### Email Tracking

#### List Sent Emails

```http
GET /api/admin/emails?userType=customer&readed=false
```

**Query Parameters:**
- `userType`: 'user' or 'customer'
- `userId`: Specific user ID
- `emailTemplate`: 'activationUrl', 'resetPassword', etc.
- `readed`: 'true' or 'false'

**Response:** `200 OK`
```json
{
  "rows": [
    {
      "id": 5,
      "userId": 10,
      "userType": "customer",
      "emailTemplate": "activationUrl",
      "sendAt": "2026-01-29T12:00:00.000Z",
      "readed": false,
      "readedAt": null,
      "uuid": "abc123def456",
      "createdAt": "2026-01-29T12:00:00.000Z"
    }
  ],
  "count": 8,
  "meta": {
    "total": 8,
    "pages": 1,
    "currentPage": 1,
    "size": 10
  }
}
```

---

#### Mark Email as Read

```http
PUT /api/admin/emails/5
```

**Request Body:**
```json
{
  "readed": true,
  "readedAt": "2026-01-29T12:05:30.000Z"
}
```

**Response:** `200 OK`
```json
{
  "message": "Email actualizado correctamente."
}
```

---

## Customer Endpoints

### Chat with AI Bot

```http
POST /api/customer/chats
```

**Request Body:**
```json
{
  "threadId": "thread_abc123",
  "message": "What events are happening this weekend?"
}
```

**Response:** `200 OK`
```json
{
  "threadId": "thread_abc123",
  "response": "This weekend we have 3 events: Summer Music Festival on Saturday, Art Exhibition on Sunday, and Food Fair both days.",
  "toolCalls": [],
  "escalated": false
}
```

**Tool Calls:**
- `search_product`: Searches events/products
- `escalate_to_human_due_to_user_behavior`: Escalates to admin
- `escalate_to_human_no_answer`: AI cannot answer

---

### Search Events

```http
GET /api/customer/search?q=music&type=event
```

**Query Parameters:**
- `q`: Search query
- `type`: 'event' or 'product'

**Response:** `200 OK`
```json
{
  "results": [
    {
      "id": 1,
      "name": "Summer Music Festival",
      "description": "Annual festival",
      "score": 0.95
    }
  ]
}
```

---

## Error Handling

### Error Response Format

```json
{
  "message": "Error description",
  "statusCode": 400,
  "stack": "Error stack trace (development only)"
}
```

### HTTP Status Codes

| Code | Meaning | Common Causes |
|------|---------|---------------|
| `200` | OK | Successful GET/PUT/DELETE |
| `201` | Created | Successful POST |
| `400` | Bad Request | Validation error, malformed request |
| `401` | Unauthorized | Missing/invalid token, not activated |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | Duplicate entry (e.g., email already exists) |
| `422` | Unprocessable Entity | Sequelize validation error |
| `500` | Internal Server Error | Server error |

---

## Pagination

All list endpoints support pagination via query parameters:

```http
GET /api/admin/events?page=2&size=25
```

**Parameters:**
- `page`: Page number (default: 1)
- `size`: Items per page (default: 10)

**Response Format:**
```json
{
  "rows": [...],
  "count": 100,
  "meta": {
    "total": 100,
    "pages": 4,
    "currentPage": 2,
    "size": 25
  }
}
```

---

## Filtering

Most list endpoints support filtering by field names:

```http
GET /api/admin/events?categoryId=2&status=active
```

Any query parameter matching a model field will filter results.

---

## Examples

### Complete Authentication Flow

```bash
# 1. Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'

# 2. Check email and click activation link
# GET /api/auth/activate/abc123token456

# 3. Login
TOKEN=$(curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }' | jq -r '.token')

# 4. Access protected resource
curl http://localhost:8080/api/admin/events \
  -H "Authorization: Bearer $TOKEN"
```

---

### Create Event with Full Flow

```bash
# 1. Login and get token
TOKEN="your-jwt-token-here"

# 2. Create category first
CATEGORY_ID=$(curl -X POST http://localhost:8080/api/admin/event-categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Music",
    "description": "Music events"
  }' | jq -r '.id')

# 3. Create event
curl -X POST http://localhost:8080/api/admin/events \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Summer Music Festival\",
    \"description\": \"Annual summer festival\",
    \"categoryId\": $CATEGORY_ID
  }"
```

---

### Customer Chat Example

```bash
# Start conversation
curl -X POST http://localhost:8080/api/customer/chats \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What events are happening this weekend?"
  }'

# Continue conversation with threadId
curl -X POST http://localhost:8080/api/customer/chats \
  -H "Content-Type: application/json" \
  -d '{
    "threadId": "thread_abc123",
    "message": "Tell me more about the music festival"
  }'
```

---

## Rate Limiting

Currently not implemented. Recommended for production:
- Use `express-rate-limit`
- Limit: 100 requests per 15 minutes per IP
- Auth endpoints: 5 requests per 15 minutes per IP

---

## Versioning

Current version: `v1` (implicit)
Future versions will use URL prefix: `/api/v2/...`

---

## Additional Resources

- [README.md](./README.md) - Setup and installation
- [STABILIZATION-REPORT.md](./STABILIZATION-REPORT.md) - Detailed architecture and issue tracking

---

**Last Updated:** 2026-01-29

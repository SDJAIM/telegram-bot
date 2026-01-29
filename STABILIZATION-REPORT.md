# Telegram Bot Project - Stabilization Report

**Generated:** 2026-01-29
**Engineer:** Senior Staff Software Engineer (Claude)
**Status:** Phase 2 Complete - Ready for Implementation
**Last Updated:** 2026-01-29

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Phase 0: Baseline & Discovery](#phase-0-baseline--discovery)
3. [Phase 1: Issue Register](#phase-1-issue-register)
4. [Phase 2: Fix Plan](#phase-2-fix-plan)
5. [Critical Findings](#critical-findings)
6. [Decision Points](#decision-points)
7. [Fix Checklist](#fix-checklist)
8. [Environment Variables Audit](#environment-variables-audit)
9. [Dependency Analysis](#dependency-analysis)

---

## Executive Summary

### Project Overview

This is a **full-stack event management platform** with AI-powered customer support, not just a simple Telegram bot.

**Technology Stack:**
- Backend: Node.js + Express 5.1.0
- Primary DB: MySQL 8+ (Sequelize ORM)
- Secondary DB: MongoDB (Mongoose - for chat)
- Cache: Redis 5.10.0
- Frontend: Vanilla JavaScript Web Components + Vite
- AI: OpenAI Assistants API
- Bot: Telegram Bot API (polling mode)
- Real-time: WebSocket

**Three User Systems:**
1. **Admins (Users)** - CMS management, full control
2. **Customers** - Public users, event browsing, AI chat
3. **Promoters** - Event organizers (backend only, no frontend)

### Severity Summary

| Severity | Count | Status |
|----------|-------|--------|
| **BLOCKER** | 4 | 🔴 Requires immediate attention |
| **MAJOR** | 6 | 🟡 High priority |
| **MINOR** | 11 | 🟢 Medium priority |
| **TRIVIAL** | 3 | ⚪ Low priority |
| **TOTAL** | 24 | - |

### Critical Security Issue

**⚠️ SECURITY CRITICAL:** 15 out of 16 admin routes are completely unprotected. Any unauthenticated user can access all CRUD operations for customers, events, promoters, etc.

---

## Phase 0: Baseline & Discovery

### Repository Structure

```
telegram-bot/
├── api/                                    # Node.js backend (Express)
│   ├── index.js                            # Server startup
│   ├── src/
│   │   ├── app.js                          # Express app setup
│   │   ├── routes/                         # API route definitions
│   │   │   ├── index.js                    # Central route registry
│   │   │   ├── auth.js                     # Admin auth routes
│   │   │   ├── customer-auth.js            # Customer auth routes
│   │   │   ├── admin/                      # Admin resource routes (16 files)
│   │   │   └── customer/                   # Customer resource routes
│   │   ├── controllers/                    # Request handlers
│   │   │   ├── auth/                       # Auth logic (admin & customer)
│   │   │   ├── admin/                      # Admin CRUD controllers (19 files)
│   │   │   └── customer/                   # Customer controllers
│   │   ├── models/
│   │   │   ├── sequelize/                  # MySQL models (23 files)
│   │   │   └── mongoose/                   # MongoDB models (4 files)
│   │   ├── middlewares/                    # Express middleware
│   │   ├── services/                       # Business logic
│   │   │   ├── telegram-service.js         # Bot polling & messaging
│   │   │   ├── openai-service.js           # AI chatbot
│   │   │   ├── websocket-service.js        # Real-time pub/sub
│   │   │   ├── email-service.js            # SMTP/Gmail
│   │   │   └── search-service.js           # ChromaDB vector search
│   │   ├── migrations/                     # Database migrations (23 files)
│   │   ├── events/                         # Event handlers
│   │   ├── templates/                      # Email templates
│   │   └── config/                         # Sequelize config
│   └── .env.example                        # Environment variables
│
├── client/                                 # Frontend (5 separate Vite apps)
│   ├── admin/
│   │   ├── front-admin/                    # Admin panel (port 5171)
│   │   └── auth-admin/                     # Admin auth form
│   ├── customer/
│   │   ├── front-customer/                 # Customer portal (port 5177)
│   │   └── auth-customer/                  # Customer auth form
│   └── auth/                               # Email activation component
│
├── proxy.js                                # Dev proxy (port 80)
├── package.json                            # Root orchestrator
└── README                                  # Setup instructions
```

### Entrypoints

| File | Purpose |
|------|---------|
| `api/index.js` | Main server - starts Express on port 8080, WebSocket upgrades |
| `api/src/app.js` | Express config - middleware, routes, sessions, error handling |
| `api/src/routes/index.js` | Central route registry - mounts all API routes |
| `proxy.js` | Dev proxy - routes /api, /admin, / traffic |

### Route Registration

**File:** `api/src/routes/index.js`

```javascript
// Authentication
router.use('/auth', require('./auth'));                    // Admin auth
router.use('/auth/customer', require('./customer-auth'));   // Customer auth

// Admin Resources (🔴 MOST MISSING verifyToken!)
router.use('/admin/users', verifyToken, require('./admin/users'));  // ✅ ONLY ONE PROTECTED
router.use('/admin/customers', require('./admin/customers'));        // 🔴 UNPROTECTED
router.use('/admin/bots', require('./admin/bots'));                  // 🔴 UNPROTECTED
router.use('/admin/customer-bot-chats', require('./admin/customer-bot-chats'));  // 🔴 UNPROTECTED
router.use('/admin/customer-bots', require('./admin/customer-bots'));  // 🔴 UNPROTECTED
router.use('/admin/customer-events', require('./admin/customer-events'));  // 🔴 UNPROTECTED
router.use('/admin/events', require('./admin/events'));              // 🔴 UNPROTECTED
router.use('/admin/event-categories', require('./admin/event-categories'));  // 🔴 UNPROTECTED
router.use('/admin/event-occurrences', require('./admin/event-occurrences'));  // 🔴 UNPROTECTED
router.use('/admin/event-prices', require('./admin/event-prices'));  // 🔴 UNPROTECTED
router.use('/admin/faqs', require('./admin/faqs'));                  // 🔴 UNPROTECTED
router.use('/admin/heroes', require('./admin/heroes'));              // 🔴 UNPROTECTED
router.use('/admin/languages', require('./admin/languages'));        // 🔴 UNPROTECTED
router.use('/admin/promoters', require('./admin/promoters'));        // 🔴 UNPROTECTED
router.use('/admin/promoter-spots', require('./admin/promoter-spots'));  // 🔴 UNPROTECTED
router.use('/admin/towns', require('./admin/towns'));                // 🔴 UNPROTECTED

// Customer Resources (public or protected by verifyCustomerToken in controllers)
router.use('/customer/faqs', require('./customer/faqs'));
router.use('/customer/heroes', require('./customer/heroes'));
router.use('/customer/chats', require('./customer/chats'));
router.use('/customer/search', require('./customer/search'));
```

### Telegram Bot Configuration

**Connection:** Long polling (NOT webhook)
**File:** `api/src/services/telegram-service.js`
**Token:** `process.env.TELEGRAM_ADMIN_TOKEN`
**Chat ID:** `process.env.TELEGRAM_ADMIN_CHAT_ID`

**Purpose:**
- Human escalation from AI chatbot
- Admin receives customer messages in Telegram group
- Admin replies routed back to customer via WebSocket

### Database Models

**Sequelize (MySQL) - 23 models:**
- Users: `user`, `user-credential`, `user-activation-token`, `user-reset-password-token`
- Customers: `customer`, `customer-credential`, `customer-activation-token`, `customer-reset-password-token`, `customer-event`
- Promoters: `promoter`, `promoter-credential`, `promoter-activation-token`, `promoter-spot`
- Events: `event`, `event-category`, `event-occurrence`, `event-price`, `spot`, `town`
- System: `bot`, `email` (SentEmail), `email-error`

**Mongoose (MongoDB) - 4 models:**
- `chats` (conversation history)
- `faq` (FAQ content)
- `hero` (hero banners)
- `language` (locale data)

**🔴 MISSING MODELS:**
- `customer-bot` (table exists via migration, no model)
- `customer-bot-chat` (table exists via migration, no model)
- `image` (referenced in code, doesn't exist)

---

## Phase 1: Issue Register

### BLOCKER Issues (Must Fix Before Production)

#### SEC-001: 15 Admin Routes Completely Unprotected

**Evidence:** `api/src/routes/index.js:9-23`

```javascript
// Line 8: ONLY THIS ONE has verifyToken
router.use('/admin/users', verifyToken, require('./admin/users'));

// Lines 9-23: ALL MISSING verifyToken
router.use('/admin/customers', require('./admin/customers'));
router.use('/admin/events', require('./admin/events'));
// ... 13 more unprotected routes
```

**Impact:** Any unauthenticated user can:
- List all customers: `GET /api/admin/customers`
- Delete events: `DELETE /api/admin/events/:id`
- Modify data: `PUT /api/admin/*/:id`
- Full CRUD on all resources

**Root Cause:** Inconsistent middleware application. Only first route protected.

**Proposed Fix:**
```javascript
// Apply verifyToken to ALL admin routes
router.use('/admin/users', verifyToken, require('./admin/users'));
router.use('/admin/customers', verifyToken, require('./admin/customers'));
router.use('/admin/bots', verifyToken, require('./admin/bots'));
// ... apply to all 16 routes
```

**Risk:** HIGH - Frontend must send valid JWT tokens or will break

**Verification:**
```bash
# Test without auth - should return 401
curl http://localhost:8080/api/admin/customers

# Test with valid token - should return 200
curl -H "Authorization: Bearer <valid-token>" http://localhost:8080/api/admin/customers
```

**Status:** [ ] Not Fixed
**Assigned To:** _______
**Fixed Date:** _______

---

#### BUG-001: /api/admin/events Route Will Crash

**Evidence:** `api/src/routes/admin/events.js:5`

```javascript
const { validateAdmin } = require('../../middlewares/user-tracking')

router.get('/', validateAdmin, eventController.list)
router.post('/', validateAdmin, eventController.create)
// ...
```

But `api/src/middlewares/user-tracking.js` exports:
```javascript
module.exports = async (req, res, next) => {
  // ... NO validateAdmin export
}
```

**Grep Search Results:**
```
$ grep -r "validateAdmin" api/src
api/src/routes/admin/events.js:5:const { validateAdmin } = require('../../middlewares/user-tracking')
api/src/routes/admin/events.js:7:router.get('/', validateAdmin, eventController.list)
# ... NO DEFINITION FOUND
```

**Impact:** Server crashes when accessing any `/api/admin/events/*` endpoint

**Root Cause:** Missing function. Likely incomplete refactor or copy-paste error.

**Proposed Fix:**
```javascript
// In routes/admin/events.js
// Remove validateAdmin entirely
const express = require('express')
const router = express.Router()
const eventController = require('../../controllers/admin/event-controller')

router.get('/', eventController.list)
router.post('/', eventController.create)
router.get('/:id', eventController.show)
router.put('/:id', eventController.update)
router.delete('/:id', eventController.delete)

module.exports = router
```

Then apply `verifyToken` at route registry level (fixes SEC-001 simultaneously).

**Risk:** LOW - Simple removal

**Verification:**
```bash
# Should not crash
curl http://localhost:8080/api/admin/events
```

**Status:** [ ] Not Fixed
**Assigned To:** _______
**Fixed Date:** _______

---

#### BUG-002: /api/admin/customer-bots Route Will Crash

**Evidence:** `api/src/routes/admin/customer-bots.js:2`

```javascript
const controller = require('../../controllers/admin/customer-bot-controller')
```

But `api/src/controllers/admin/customer-bot-controller.js` is **EMPTY** (1 line, no exports).

**Impact:** Route crashes on access. Will throw "controller.getAll is not a function"

**Root Cause:** Stub controller committed without implementation.

**Proposed Fix - Option A (Delete):**
If feature not needed:
1. Delete `api/src/routes/admin/customer-bots.js`
2. Delete `api/src/controllers/admin/customer-bot-controller.js`
3. Remove from `api/src/routes/index.js:12`
4. Consider deleting migration `20250709160000-create-customer-bot-chats-table.js`

**Proposed Fix - Option B (Implement):**
If feature needed:
1. Create Sequelize model `api/src/models/sequelize/customer-bot.js`
2. Implement CRUD controller (copy pattern from `customer-controller.js`)
3. Test all endpoints

**Decision Required:** [ ] Delete feature [ ] Implement feature

**Risk:** MEDIUM - Need to determine product requirements

**Status:** [ ] Not Fixed (Awaiting Decision)
**Assigned To:** _______
**Fixed Date:** _______

---

#### BUG-003: /api/admin/customer-bot-chats Route Will Crash

**Evidence:** `api/src/routes/admin/customer-bot-chats.js:2`

```javascript
const controller = require('../../controllers/admin/customer-bot-chat-controller')
```

But `api/src/controllers/admin/customer-bot-chat-controller.js` is **EMPTY**.

**Impact:** Same as BUG-002

**Root Cause:** Same as BUG-002

**Proposed Fix:** Same options as BUG-002 (delete or implement)

**Decision Required:** [ ] Delete feature [ ] Implement feature

**Status:** [ ] Not Fixed (Awaiting Decision)
**Assigned To:** _______
**Fixed Date:** _______

---

### MAJOR Issues (High Priority)

#### BUG-004: Email Controller References Non-Existent Model

**Evidence:** `api/src/controllers/admin/email-controller.js:2`

```javascript
const Email = sequelizeDb.Email
```

But `api/src/models/sequelize/email.js` defines:

```javascript
class SentEmail extends Model { ... }
SentEmail.init({ ... }, {
  sequelize,
  modelName: 'SentEmail',  // ← Exported as SentEmail, not Email
  tableName: 'emails'
})
```

**Impact:** Controller will crash: "Cannot read property 'findOne' of undefined"

**Root Cause:** Model naming mismatch. File is `email.js`, class is `SentEmail`.

**Proposed Fix:**

```javascript
// In email-controller.js
const SentEmail = sequelizeDb.SentEmail  // Change from Email to SentEmail

// Update all references (6 locations):
// Line 7: const data = await SentEmail.create(req.body)
// Line 32: const result = await SentEmail.findAndCountAll({ ... })
// Line 56: const data = await SentEmail.findByPk(id)
// Line 74: const [numberRowsAffected] = await SentEmail.update(req.body, { where: { id } })
// Line 98: const numberRowsAffected = await SentEmail.destroy({ where: { id } })
```

**Risk:** LOW - Simple rename, no logic change

**Verification:**
```bash
# After adding route (currently no route exists)
curl http://localhost:8080/api/admin/emails
```

**Status:** [ ] Not Fixed
**Assigned To:** _______
**Fixed Date:** _______

---

#### BUG-005: Image Controller Has Multiple Broken Dependencies

**Evidence:** `api/src/controllers/admin/image-controller.js`

```javascript
// Line 3: Model doesn't exist
const Image = mongooseDb.Image  // ❌ No image.js in mongoose/models

// Line 7: Service doesn't exist
const result = await req.imageService.uploadImage(req.files)  // ❌ Not in expose-services.js

// Line 80: Service doesn't exist
await req.imageService.deleteImages(filename)  // ❌ Not in expose-services.js
```

**Mongoose models available:**
```bash
$ ls api/src/models/mongoose/
chats.js  faq.js  hero.js  language.js  index.js
# ❌ NO image.js
```

**Exposed services:**
```javascript
// api/src/middlewares/expose-services.js
const services = {
  telegramService: new (require('../services/telegram-service'))(...)
  // ❌ NO imageService
}
```

**Impact:** Controller cannot function. Multiple undefined errors.

**Root Cause:** Incomplete feature - controller created but dependencies missing.

**Proposed Fix - Option A (Delete):**
1. Delete `api/src/controllers/admin/image-controller.js`
2. Confirm no routes reference it (already verified - none exist)

**Proposed Fix - Option B (Implement):**
1. Create `api/src/models/mongoose/image.js`
2. Create `api/src/services/image-service.js`
3. Add imageService to `expose-services.js`
4. Create route in `api/src/routes/admin/images.js`
5. Add route to `routes/index.js`

**Decision Required:** [ ] Delete feature [ ] Implement feature

**Status:** [ ] Not Fixed (Awaiting Decision)
**Assigned To:** _______
**Fixed Date:** _______

---

#### DOC-002: No API Documentation

**Evidence:** No Swagger, OpenAPI, or markdown API docs exist.

**Impact:**
- Developers cannot understand endpoints without reading code
- Frontend integration requires code inspection
- No request/response examples

**Proposed Fix:**

Create `API-DOCUMENTATION.md` with:
- All endpoints (grouped by resource)
- Authentication requirements
- Request body schemas
- Response schemas
- Error codes
- Examples

OR implement Swagger/OpenAPI:
```bash
npm install swagger-jsdoc swagger-ui-express
```

**Risk:** NONE - Documentation only

**Status:** [ ] Not Fixed
**Assigned To:** _______
**Fixed Date:** _______

---

#### MISSING-001: No Models for Customer-Bot Tables

**Evidence:**

Migration exists:
```bash
api/src/migrations/20250709160000-create-customer-bot-chats-table.js
```

Routes exist:
```javascript
api/src/routes/index.js:11: router.use('/admin/customer-bot-chats', ...)
api/src/routes/index.js:12: router.use('/admin/customer-bots', ...)
```

But NO models:
```bash
$ ls api/src/models/sequelize/ | grep customer-bot
# ❌ NO RESULTS
```

**Impact:** Controllers cannot access database (if implemented)

**Root Cause:** Migration run but models never created

**Proposed Fix:**

Create `api/src/models/sequelize/customer-bot.js`:
```javascript
'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class CustomerBot extends Model {
    static associate(models) {
      CustomerBot.belongsTo(models.Customer, { foreignKey: 'customerId', as: 'customer' })
      CustomerBot.belongsTo(models.Bot, { foreignKey: 'botId', as: 'bot' })
    }
  }

  CustomerBot.init({
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    botId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    // Add other fields from migration
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'CustomerBot',
    paranoid: true,
    tableName: 'customer_bots'
  })

  return CustomerBot
}
```

Similar for `customer-bot-chat.js`.

**Decision Required:** Only if implementing BUG-002/003

**Status:** [ ] Not Fixed (Awaiting Decision)
**Assigned To:** _______
**Fixed Date:** _______

---

#### TEST-001: Zero Test Files Exist

**Evidence:**

```bash
$ find api -name "*.test.js" -o -name "*.spec.js"
# ❌ NO RESULTS
```

```json
// api/package.json
"test": "echo \"Error: no test specified\" && exit 1"
```

**Impact:**
- No regression detection
- Manual testing only
- High risk of breaking changes

**Proposed Fix:**

1. Install Jest:
```bash
cd api && npm install --save-dev jest supertest
```

2. Update package.json:
```json
"test": "jest",
"test:watch": "jest --watch",
"test:coverage": "jest --coverage"
```

3. Create test structure:
```
api/
  src/
    __tests__/
      auth/
        auth-controller.test.js
        customer-auth-controller.test.js
      middlewares/
        auth.test.js
      routes/
        admin-routes.test.js
```

4. Write critical path tests:
- [ ] Admin login flow
- [ ] Customer login flow
- [ ] JWT token validation
- [ ] Admin route protection
- [ ] CRUD operations

**Risk:** MEDIUM - Setup takes time, must not break CI/CD

**Status:** [ ] Not Fixed
**Assigned To:** _______
**Fixed Date:** _______

---

### MINOR Issues

#### DEAD-001: 4 Unused Auth Controller/Route Files

**Evidence:**

Files exist but no imports:
```bash
api/src/controllers/auth/auth-user-controller.js    # Used by auth-users.js (also dead)
api/src/controllers/auth/auth-users.js              # Not in routes/index.js
api/src/controllers/auth/auth-activate-controller.js # No imports
api/src/controllers/auth/route-controller.js        # No imports
```

Grep confirms:
```bash
$ grep -r "auth-user-controller\|auth-users\|auth-activate-controller\|route-controller" api/src/routes
# Only self-references, no external imports
```

**Impact:** Dead code increases maintenance burden

**Root Cause:** Old auth system replaced, files not cleaned up

**Proposed Fix:**

Delete all 4 files:
```bash
rm api/src/controllers/auth/auth-user-controller.js
rm api/src/controllers/auth/auth-users.js
rm api/src/controllers/auth/auth-activate-controller.js
rm api/src/controllers/auth/route-controller.js
```

**Risk:** LOW - No imports means safe to delete

**Verification:**
```bash
# After delete, confirm no references
grep -r "auth-user-controller" api/src
# Should return no results

npm run dev
# Should start without errors
```

**Status:** [ ] Not Fixed
**Assigned To:** _______
**Fixed Date:** _______

---

#### DEAD-002: Email and Image Controllers Have No Routes

**Evidence:**

Controllers exist:
```bash
api/src/controllers/admin/email-controller.js    # Full implementation
api/src/controllers/admin/image-controller.js    # Full implementation (but broken)
```

But NO routes:
```bash
$ grep -r "email-controller\|image-controller" api/src/routes
# ❌ NO RESULTS
```

**Impact:** Dead code (but email-controller has bugs, image-controller completely broken)

**Proposed Fix - Option A (Delete):**
```bash
rm api/src/controllers/admin/email-controller.js
rm api/src/controllers/admin/image-controller.js
```

**Proposed Fix - Option B (Add Routes):**
Fix bugs first, then create routes

**Decision Required:** [ ] Delete [ ] Add routes after fixing

**Status:** [ ] Not Fixed (Awaiting Decision)
**Assigned To:** _______
**Fixed Date:** _______

---

#### INCONSIST-001: Inconsistent bcrypt Package

**Evidence:**

```javascript
// api/src/controllers/auth/auth-user-controller.js:1
const bcrypt = require('bcryptjs')  // ❌ bcryptjs
```

```json
// api/package.json:32
"bcrypt": "^6.0.0"  // ✅ bcrypt
```

**Impact:** File would crash if used (but it's dead code)

**Proposed Fix:** Fixed by DEAD-001 (delete the file)

**Status:** [ ] Not Fixed (Will be fixed by DEAD-001)
**Assigned To:** _______
**Fixed Date:** _______

---

#### INCONSIST-002: User-Tracking Middleware Executes After next()

**Evidence:** `api/src/middlewares/user-tracking.js`

```javascript
module.exports = async (req, res, next) => {
  next()  // ← Passes control immediately

  try {
    // Then does work AFTER next()
    if (!req.ip || req.ip !== '::1') {
      const ip = req.ip.replace('::ffff:', '')
      const response = await fetch(`http://ip-api.com/json/${ip}`)
      const data = await response.json()
      console.log(data)
    }
  } catch (error) {
    console.error('Error fetching user tracking data:', error)
  }
}
```

**Impact:**
- Fire-and-forget pattern (not necessarily bad)
- Cannot handle errors properly
- External API call happens outside request lifecycle

**Proposed Fix - Option A (Move next()):**
```javascript
module.exports = async (req, res, next) => {
  try {
    if (!req.ip || req.ip !== '::1') {
      const ip = req.ip.replace('::ffff:', '')
      const response = await fetch(`http://ip-api.com/json/${ip}`)
      const data = await response.json()
      console.log(data)
    }
  } catch (error) {
    console.error('Error fetching user tracking data:', error)
  }

  next()  // ← Move to end
}
```

**Proposed Fix - Option B (Remove entirely):**
If IP tracking not needed, delete the middleware.

**Decision Required:** [ ] Fix pattern [ ] Remove entirely

**Status:** [ ] Not Fixed (Awaiting Decision)
**Assigned To:** _______
**Fixed Date:** _______

---

#### DEBUG-001: Debug console.log in Production Code

**Evidence:** `api/index.js:2`

```javascript
console.log('Dialect cargado:', process.env.DATABASE_DIALECT)
```

**Impact:** Clutters logs, unprofessional

**Proposed Fix:**

```javascript
// Remove line 2 entirely
global.__basedir = __dirname

const { wss } = require('./src/services/websocket-service')
// ...
```

**Risk:** NONE

**Status:** [ ] Not Fixed
**Assigned To:** _______
**Fixed Date:** _______

---

#### DEBUG-002: Multiple console.log/error Statements

**Evidence:** Grep found 32 occurrences across 14 files

**Files:**
- app.js
- events/new-user.js
- user-tracking.js
- telegram-service.js
- error-handler.js
- openai-service.js
- mongoose/index.js
- email-service.js
- search-controller.js
- chat-controller.js
- hero-controller.js
- auth-user-controller.js (dead file)
- customer-auth-controller.js
- auth-controller.js

**Impact:** Functional but not best practice for production

**Proposed Fix - Option A (Keep for now):**
Document as acceptable for MVP stage

**Proposed Fix - Option B (Implement logger):**
```bash
npm install winston
```

Create `api/src/utils/logger.js`:
```javascript
const winston = require('winston')

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
})

module.exports = logger
```

Replace all `console.log` → `logger.info`
Replace all `console.error` → `logger.error`

**Decision Required:** [ ] Keep as-is [ ] Implement logger

**Status:** [ ] Not Fixed (Awaiting Decision)
**Assigned To:** _______
**Fixed Date:** _______

---

#### DOC-003: Hardcoded Domain in proxy.js

**Evidence:** `proxy.js:7`

```javascript
const options = {
  target: 'http://127.0.0.1:8080',
  cookieDomainRewrite: 'dev-youthing.com',  // ← Wrong project?
  changeOrigin: true,
  // ...
}
```

**Impact:** Cookies may not work correctly. Domain looks like different project.

**Proposed Fix:**

```javascript
cookieDomainRewrite: process.env.COOKIE_DOMAIN || 'localhost',
```

Add to `.env.example`:
```
COOKIE_DOMAIN=localhost
```

**Risk:** MEDIUM - May affect cookie behavior

**Decision Required:** What is the correct domain?

**Status:** [ ] Not Fixed (Awaiting Decision)
**Assigned To:** _______
**Fixed Date:** _______

---

#### SEC-002: API_URL Used Unsafely

**Evidence:** `api/src/app.js:26`

```javascript
domain: new URL(process.env.API_URL).hostname,
```

**Impact:** If `API_URL` is missing or malformed, server crashes on startup

**Proposed Fix:**

Create `api/src/utils/validate-env.js`:
```javascript
function validateEnv() {
  const required = [
    'DATABASE_HOST',
    'DATABASE_USER',
    'DATABASE_PASSWORD',
    'DATABASE_NAME',
    'MONGODB_URI',
    'REDIS_URL',
    'SESSION_SECRET',
    'JWT_SECRET',
    'API_URL',
    'TELEGRAM_ADMIN_TOKEN',
    'TELEGRAM_ADMIN_CHAT_ID',
    'OPENAI_API_KEY',
    'OPENAI_ASSISTANT_CHATBOT_ID'
  ]

  const missing = required.filter(key => !process.env[key])

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:')
    missing.forEach(key => console.error(`  - ${key}`))
    process.exit(1)
  }

  // Validate API_URL format
  try {
    new URL(process.env.API_URL)
  } catch (err) {
    console.error('❌ API_URL is not a valid URL:', process.env.API_URL)
    process.exit(1)
  }

  console.log('✅ Environment variables validated')
}

module.exports = validateEnv
```

Call in `api/index.js`:
```javascript
require('./src/utils/validate-env')()
// ... rest of code
```

**Risk:** LOW - Only adds validation

**Status:** [ ] Not Fixed
**Assigned To:** _______
**Fixed Date:** _______

---

#### NAMING-001: Inconsistent Route Naming

**Evidence:**

Routes use kebab-case:
- `customer-bot-chats` (plural)
- `customer-bots` (plural)
- `event-categories` (plural)
- But: singular-singular vs plural-plural inconsistent

**Impact:** Minor - just inconsistency

**Proposed Fix - Option A:**
Document kebab-case + plurals as standard, leave as-is

**Proposed Fix - Option B:**
Standardize all to singular (requires frontend changes)

**Decision Required:** [ ] Keep as-is [ ] Standardize

**Status:** [ ] Not Fixed (Awaiting Decision)
**Assigned To:** _______
**Fixed Date:** _______

---

#### ARCH-001: MongoDB and MySQL Both Used, Separation Unclear

**Evidence:** Chat uses MongoDB, everything else uses MySQL

**Impact:** New developers may not understand when to use which

**Proposed Fix:**

Add to README:

```markdown
## Database Architecture

### MySQL (Primary Database)
Use for:
- Transactional data (users, events, orders)
- Relational data with foreign keys
- Data requiring ACID compliance

Models location: `api/src/models/sequelize/`

### MongoDB (Secondary Database)
Use for:
- Chat conversation history
- Unstructured content (FAQs, heroes)
- Data requiring flexible schema

Models location: `api/src/models/mongoose/`

### Why Both?
- MySQL: Strong consistency for critical business data
- MongoDB: Flexible schema for conversational AI and CMS content
```

**Risk:** NONE - Documentation only

**Status:** [ ] Not Fixed
**Assigned To:** _______
**Fixed Date:** _______

---

#### MIGRATE-001: No Migration Rollback Documentation

**Evidence:** 23 migrations exist, no docs on rollback

**Proposed Fix:**

Add to README:

```markdown
## Database Migrations

### Run Migrations
```bash
cd api
npx sequelize-cli db:migrate
```

### Rollback Last Migration
```bash
npx sequelize-cli db:migrate:undo
```

### Rollback All Migrations
```bash
npx sequelize-cli db:migrate:undo:all
```

### Check Migration Status
```bash
npx sequelize-cli db:migrate:status
```

### Handling Failed Migrations

If a migration fails halfway:
1. Manually inspect database to see what was created
2. Rollback: `npx sequelize-cli db:migrate:undo`
3. Fix migration file
4. Re-run: `npx sequelize-cli db:migrate`

### Development vs Production

**Development:** Can rollback and modify freely
**Production:** Never rollback! Only add new migrations to fix issues
```

**Risk:** NONE - Documentation only

**Status:** [ ] Not Fixed
**Assigned To:** _______
**Fixed Date:** _______

---

### TRIVIAL Issues

#### TYPO-001: Spanish Typo in Error Message

**Evidence:** `api/src/controllers/auth/auth-activate-controller.js:49`

```javascript
res.status(500).send({ message: 'Algún error ha surgido al activar la cuenta. Pongasé en contacto con nosotros.' })
//                                                                                   ^^^^^^^^
//                                                                                   Wrong: Pongasé
//                                                                                   Correct: Póngase
```

**Proposed Fix:**
```javascript
res.status(500).send({ message: 'Algún error ha surgido al activar la cuenta. Póngase en contacto con nosotros.' })
```

**Risk:** NONE

**Note:** This file is dead code (DEAD-001), so fix only if keeping the file

**Status:** [ ] Not Fixed
**Assigned To:** _______
**Fixed Date:** _______

---

#### TYPO-002: Wrong Error Message in Delete Method

**Evidence:** `api/src/controllers/admin/email-controller.js:102`

```javascript
exports.delete = async (req, res, next) => {
  try {
    const id = req.params.id
    const numberRowsAffected = await Email.destroy({ where: { id } })

    if (numberRowsAffected !== 1) {
      const err = new Error()
      err.message = `No se puede actualizar el elemento con la id=${id}. Tal vez no se ha encontrado.`
      //                        ^^^^^^^^^^
      //                        Wrong: "actualizar" (update)
      //                        Correct: "borrar" (delete)
      err.statusCode = 404
      throw err
    }
    // ...
}
```

**Proposed Fix:**
```javascript
err.message = `No se puede borrar el elemento con la id=${id}. Tal vez no se ha encontrado.`
```

**Risk:** NONE

**Status:** [ ] Not Fixed
**Assigned To:** _______
**Fixed Date:** _______

---

#### DOC-001: README Format Unprofessional

**Evidence:** `README:1` - Starts with emojis, informal style

**Proposed Fix:**

Restructure README:
1. Keep all technical content
2. Remove excessive emojis (keep 1-2 for section headers max)
3. Add sections: Overview, Architecture, Setup, Development, Deployment
4. Consider creating separate `ARCHITECTURE.md`

**Risk:** NONE

**Status:** [ ] Not Fixed
**Assigned To:** _______
**Fixed Date:** _______

---

## Phase 2: Fix Plan

**Status:** ✅ Complete - Ready for Implementation
**Based on Decisions:** Q1-Q6 (see Decision Points section)

### Implementation Strategy

Fixes will be applied in **ORDERED CHECKPOINTS** to minimize risk and allow for testing at each stage.

**Principle:** Fix critical security issues first, then broken functionality, then cleanup.

---

### CHECKPOINT 1: Security & Critical Bugs (BLOCKER Priority)

**Goal:** Make admin panel secure and prevent crashes
**Risk:** HIGH - Changes authentication, may break frontend
**Estimated Files:** 3 files modified
**Verification:** All admin routes return 401 without auth, 200 with valid token

#### Tasks:

##### 1.1: Apply Authentication to All Admin Routes
**File:** `api/src/routes/index.js`
**Issue:** SEC-001

```javascript
// BEFORE (vulnerable):
router.use('/admin/users', verifyToken, require('./admin/users'));
router.use('/admin/customers', require('./admin/customers'));  // ❌ NO AUTH
router.use('/admin/events', require('./admin/events'));        // ❌ NO AUTH
// ... 13 more unprotected

// AFTER (secure):
router.use('/admin/users', verifyToken, require('./admin/users'));
router.use('/admin/customers', verifyToken, require('./admin/customers'));
router.use('/admin/bots', verifyToken, require('./admin/bots'));
router.use('/admin/customer-bot-chats', verifyToken, require('./admin/customer-bot-chats'));
router.use('/admin/customer-bots', verifyToken, require('./admin/customer-bots'));
router.use('/admin/customer-events', verifyToken, require('./admin/customer-events'));
router.use('/admin/events', verifyToken, require('./admin/events'));
router.use('/admin/event-categories', verifyToken, require('./admin/event-categories'));
router.use('/admin/event-occurrences', verifyToken, require('./admin/event-occurrences'));
router.use('/admin/event-prices', verifyToken, require('./admin/event-prices'));
router.use('/admin/faqs', verifyToken, require('./admin/faqs'));
router.use('/admin/heroes', verifyToken, require('./admin/heroes'));
router.use('/admin/languages', verifyToken, require('./admin/languages'));
router.use('/admin/promoters', verifyToken, require('./admin/promoters'));
router.use('/admin/promoter-spots', verifyToken, require('./admin/promoter-spots'));
router.use('/admin/towns', verifyToken, require('./admin/towns'));
```

**Verification Commands:**
```bash
# Test without auth - should return 401
curl -i http://localhost:8080/api/admin/customers
curl -i http://localhost:8080/api/admin/events
curl -i http://localhost:8080/api/admin/promoters

# Test with valid token - should return 200
# First login to get token
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123"}' | jq -r '.token')

# Then test protected routes
curl -i -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/admin/customers
curl -i -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/admin/events
# All should return 200
```

##### 1.2: Fix Events Route validateAdmin Error
**File:** `api/src/routes/admin/events.js`
**Issue:** BUG-001

```javascript
// BEFORE (crashes):
'use strict'
const express = require('express')
const router = express.Router()
const eventController = require('../../controllers/admin/event-controller')
const { validateAdmin } = require('../../middlewares/user-tracking')  // ❌ DOESN'T EXIST

router.get('/', validateAdmin, eventController.list)
router.post('/', validateAdmin, eventController.create)
router.get('/:id', validateAdmin, eventController.show)
router.put('/:id', validateAdmin, eventController.update)
router.delete('/:id', validateAdmin, eventController.delete)

module.exports = router

// AFTER (fixed - auth via routes/index.js):
'use strict'
const express = require('express')
const router = express.Router()
const eventController = require('../../controllers/admin/event-controller')

router.get('/', eventController.list)
router.post('/', eventController.create)
router.get('/:id', eventController.show)
router.put('/:id', eventController.update)
router.delete('/:id', eventController.delete)

module.exports = router
```

**Verification:**
```bash
# Should not crash server on startup
npm run dev

# Should respond (not crash) when accessed
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/admin/events
```

##### 1.3: Remove Debug Console.log
**File:** `api/index.js`
**Issue:** DEBUG-001

```javascript
// BEFORE:
// Load environment variables first
console.log('Dialect cargado:', process.env.DATABASE_DIALECT)  // ❌ REMOVE THIS

global.__basedir = __dirname
// ...

// AFTER:
// Load environment variables first
global.__basedir = __dirname
// ...
```

**Verification:** Visual inspection of startup logs (should be clean)

---

**CHECKPOINT 1 VERIFICATION:**
```bash
cd api
npm run dev
# Server should start without errors
# No "Dialect cargado" message
# Test all 16 admin routes with/without auth
```

**GATE:** Do NOT proceed until all admin routes are protected and events route works.

---

### CHECKPOINT 2: Implement Customer-Bot Feature (MAJOR Priority)

**Goal:** Make customer-bot routes functional
**Risk:** MEDIUM - New feature, database already migrated
**Estimated Files:** 4 files created, 2 modified
**Verification:** CRUD operations work on customer-bots and customer-bot-chats

#### Tasks:

##### 2.1: Create CustomerBot Sequelize Model
**File:** `api/src/models/sequelize/customer-bot.js` (NEW)
**Issue:** MISSING-001, BUG-002

```javascript
'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class CustomerBot extends Model {
    static associate(models) {
      CustomerBot.belongsTo(models.Customer, {
        foreignKey: 'customerId',
        as: 'customer'
      })
      CustomerBot.belongsTo(models.Bot, {
        foreignKey: 'botId',
        as: 'bot'
      })
    }
  }

  CustomerBot.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'customers',
        key: 'id'
      }
    },
    botId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'bots',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      defaultValue: 'active'
    },
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'CustomerBot',
    paranoid: true,
    tableName: 'customer_bots',
    timestamps: true
  })

  return CustomerBot
}
```

##### 2.2: Create CustomerBotChat Sequelize Model
**File:** `api/src/models/sequelize/customer-bot-chat.js` (NEW)
**Issue:** MISSING-001, BUG-003

```javascript
'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class CustomerBotChat extends Model {
    static associate(models) {
      CustomerBotChat.belongsTo(models.Customer, {
        foreignKey: 'customerId',
        as: 'customer'
      })
      CustomerBotChat.belongsTo(models.Bot, {
        foreignKey: 'botId',
        as: 'bot'
      })
    }
  }

  CustomerBotChat.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'customers',
        key: 'id'
      }
    },
    botId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'bots',
        key: 'id'
      }
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    sender: {
      type: DataTypes.ENUM('customer', 'bot'),
      allowNull: false
    },
    threadId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'CustomerBotChat',
    paranoid: true,
    tableName: 'customer_bot_chats',
    timestamps: true
  })

  return CustomerBotChat
}
```

##### 2.3: Implement CustomerBot Controller
**File:** `api/src/controllers/admin/customer-bot-controller.js` (REPLACE)
**Issue:** BUG-002

```javascript
const sequelizeDb = require('../../models/sequelize')
const CustomerBot = sequelizeDb.CustomerBot
const Op = sequelizeDb.Sequelize.Op

exports.getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.size) || 10
    const offset = (page - 1) * limit

    const result = await CustomerBot.findAndCountAll({
      include: [
        { model: sequelizeDb.Customer, as: 'customer', attributes: ['id', 'name', 'email'] },
        { model: sequelizeDb.Bot, as: 'bot', attributes: ['id', 'name'] }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    })

    result.meta = {
      total: result.count,
      pages: Math.ceil(result.count / limit),
      currentPage: page,
      size: limit
    }

    res.status(200).send(result)
  } catch (err) {
    next(err)
  }
}

exports.getById = async (req, res, next) => {
  try {
    const id = req.params.id
    const data = await CustomerBot.findByPk(id, {
      include: [
        { model: sequelizeDb.Customer, as: 'customer' },
        { model: sequelizeDb.Bot, as: 'bot' }
      ]
    })

    if (!data) {
      const err = new Error('CustomerBot no encontrado')
      err.statusCode = 404
      throw err
    }

    res.status(200).send(data)
  } catch (err) {
    next(err)
  }
}

exports.create = async (req, res, next) => {
  try {
    const data = await CustomerBot.create(req.body)
    res.status(201).send(data)
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      err.statusCode = 422
    }
    next(err)
  }
}

exports.update = async (req, res, next) => {
  try {
    const id = req.params.id
    const [numberRowsAffected] = await CustomerBot.update(req.body, { where: { id } })

    if (numberRowsAffected !== 1) {
      const err = new Error('CustomerBot no encontrado o no actualizado')
      err.statusCode = 404
      throw err
    }

    res.status(200).send({ message: 'CustomerBot actualizado correctamente' })
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      err.statusCode = 422
    }
    next(err)
  }
}

exports.delete = async (req, res, next) => {
  try {
    const id = req.params.id
    const numberRowsAffected = await CustomerBot.destroy({ where: { id } })

    if (numberRowsAffected !== 1) {
      const err = new Error('CustomerBot no encontrado')
      err.statusCode = 404
      throw err
    }

    res.status(200).send({ message: 'CustomerBot eliminado correctamente' })
  } catch (err) {
    next(err)
  }
}
```

##### 2.4: Implement CustomerBotChat Controller
**File:** `api/src/controllers/admin/customer-bot-chat-controller.js` (REPLACE)
**Issue:** BUG-003

```javascript
const sequelizeDb = require('../../models/sequelize')
const CustomerBotChat = sequelizeDb.CustomerBotChat
const Op = sequelizeDb.Sequelize.Op

exports.getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.size) || 10
    const offset = (page - 1) * limit

    const result = await CustomerBotChat.findAndCountAll({
      include: [
        { model: sequelizeDb.Customer, as: 'customer', attributes: ['id', 'name', 'email'] },
        { model: sequelizeDb.Bot, as: 'bot', attributes: ['id', 'name'] }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    })

    result.meta = {
      total: result.count,
      pages: Math.ceil(result.count / limit),
      currentPage: page,
      size: limit
    }

    res.status(200).send(result)
  } catch (err) {
    next(err)
  }
}

exports.getOne = async (req, res, next) => {
  try {
    const id = req.params.id
    const data = await CustomerBotChat.findByPk(id, {
      include: [
        { model: sequelizeDb.Customer, as: 'customer' },
        { model: sequelizeDb.Bot, as: 'bot' }
      ]
    })

    if (!data) {
      const err = new Error('Chat no encontrado')
      err.statusCode = 404
      throw err
    }

    res.status(200).send(data)
  } catch (err) {
    next(err)
  }
}

exports.create = async (req, res, next) => {
  try {
    const data = await CustomerBotChat.create(req.body)
    res.status(201).send(data)
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      err.statusCode = 422
    }
    next(err)
  }
}

exports.update = async (req, res, next) => {
  try {
    const id = req.params.id
    const [numberRowsAffected] = await CustomerBotChat.update(req.body, { where: { id } })

    if (numberRowsAffected !== 1) {
      const err = new Error('Chat no encontrado o no actualizado')
      err.statusCode = 404
      throw err
    }

    res.status(200).send({ message: 'Chat actualizado correctamente' })
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      err.statusCode = 422
    }
    next(err)
  }
}

exports.delete = async (req, res, next) => {
  try {
    const id = req.params.id
    const numberRowsAffected = await CustomerBotChat.destroy({ where: { id } })

    if (numberRowsAffected !== 1) {
      const err = new Error('Chat no encontrado')
      err.statusCode = 404
      throw err
    }

    res.status(200).send({ message: 'Chat eliminado correctamente' })
  } catch (err) {
    next(err)
  }
}
```

**Verification:**
```bash
# Test CustomerBot CRUD
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/admin/customer-bots
curl -H "Authorization: Bearer $TOKEN" -X POST http://localhost:8080/api/admin/customer-bots \
  -H "Content-Type: application/json" \
  -d '{"customerId":1,"botId":1,"status":"active"}'

# Test CustomerBotChat CRUD
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/admin/customer-bot-chats
curl -H "Authorization: Bearer $TOKEN" -X POST http://localhost:8080/api/admin/customer-bot-chats \
  -H "Content-Type: application/json" \
  -d '{"customerId":1,"botId":1,"message":"Test","sender":"customer"}'
```

---

**CHECKPOINT 2 VERIFICATION:**
```bash
# Models loaded correctly
node -e "const db = require('./api/src/models/sequelize'); console.log(Object.keys(db));"
# Should include CustomerBot and CustomerBotChat

# Controllers functional
npm run dev
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/admin/customer-bots
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/admin/customer-bot-chats
```

**GATE:** Do NOT proceed until customer-bot routes return data without crashing.

---

### CHECKPOINT 3: Implement Email Management Feature (MAJOR Priority)

**Goal:** Make email management functional
**Risk:** LOW - Bug fix + route addition
**Estimated Files:** 2 files modified, 1 created
**Verification:** Email CRUD operations work

#### Tasks:

##### 3.1: Fix Email Controller Model Name
**File:** `api/src/controllers/admin/email-controller.js`
**Issue:** BUG-004

```javascript
// Line 2: Change from:
const Email = sequelizeDb.Email

// To:
const SentEmail = sequelizeDb.SentEmail
```

Replace all 6 occurrences of `Email` with `SentEmail`:
- Line 7: `await SentEmail.create(req.body)`
- Line 32: `await SentEmail.findAndCountAll({`
- Line 56: `await SentEmail.findByPk(id)`
- Line 74: `await SentEmail.update(req.body, { where: { id } })`
- Line 98: `await SentEmail.destroy({ where: { id } })`

##### 3.2: Fix Delete Error Message Typo
**File:** `api/src/controllers/admin/email-controller.js`
**Issue:** TYPO-002

```javascript
// Line 102: Change from:
err.message = `No se puede actualizar el elemento con la id=${id}. Tal vez no se ha encontrado.`

// To:
err.message = `No se puede borrar el elemento con la id=${id}. Tal vez no se ha encontrado.`
```

##### 3.3: Create Email Route
**File:** `api/src/routes/admin/emails.js` (NEW)

```javascript
const express = require('express')
const router = express.Router()
const controller = require('../../controllers/admin/email-controller.js')

router.post('/', controller.create)
router.get('/', controller.findAll)
router.get('/:id', controller.findOne)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)

module.exports = router
```

##### 3.4: Register Email Route
**File:** `api/src/routes/index.js`

Add after line 23 (after towns):
```javascript
router.use('/admin/emails', verifyToken, require('./admin/emails'))
```

**Verification:**
```bash
# Test email CRUD
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/admin/emails
curl -H "Authorization: Bearer $TOKEN" -X POST http://localhost:8080/api/admin/emails \
  -H "Content-Type: application/json" \
  -d '{"subject":"Test Email","path":"/templates/test.ejs"}'
```

---

**CHECKPOINT 3 VERIFICATION:**
```bash
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/admin/emails
# Should return list of sent emails (may be empty)
```

**GATE:** Email routes functional.

---

### CHECKPOINT 4: Delete Dead Code & Fix Middleware (MINOR Priority)

**Goal:** Clean up unused files and fix middleware pattern
**Risk:** LOW - Removing unused code
**Estimated Files:** 4 deleted, 1 modified
**Verification:** Server starts, no broken imports

#### Tasks:

##### 4.1: Delete Unused Auth Controllers
**Files:** (DELETE ALL)
**Issue:** DEAD-001

```bash
rm api/src/controllers/auth/auth-user-controller.js
rm api/src/controllers/auth/auth-users.js
rm api/src/controllers/auth/auth-activate-controller.js
rm api/src/controllers/auth/route-controller.js
```

##### 4.2: Delete Broken Image Controller
**File:** `api/src/controllers/admin/image-controller.js` (DELETE)
**Issue:** BUG-005, DEAD-002
**Note:** Per Q2 decision - frontend view only, backend not needed yet

```bash
rm api/src/controllers/admin/image-controller.js
```

##### 4.3: Fix User Tracking Middleware Pattern
**File:** `api/src/middlewares/user-tracking.js`
**Issue:** INCONSIST-002

```javascript
// BEFORE (bad pattern):
module.exports = async (req, res, next) => {
  next()  // ❌ Passes control immediately

  try {
    if (!req.ip || req.ip !== '::1') {
      const ip = req.ip.replace('::ffff:', '')
      const response = await fetch(`http://ip-api.com/json/${ip}`)
      const data = await response.json()
      console.log(data)
    }
  } catch (error) {
    console.error('Error fetching user tracking data:', error)
  }
}

// AFTER (correct pattern):
module.exports = async (req, res, next) => {
  try {
    if (!req.ip || req.ip !== '::1') {
      const ip = req.ip.replace('::ffff:', '')
      const response = await fetch(`http://ip-api.com/json/${ip}`)
      const data = await response.json()
      console.log(data)
    }
  } catch (error) {
    console.error('Error fetching user tracking data:', error)
  }

  next()  // ✅ Move to end
}
```

**Verification:**
```bash
# Confirm no broken imports
grep -r "auth-user-controller\|auth-users\|auth-activate-controller\|route-controller\|image-controller" api/src
# Should return NO results

# Server starts
npm run dev
# No errors

# Middleware executes properly
curl http://localhost:8080/api/auth/user/check-signin
# Check server logs - should show IP tracking data
```

---

**CHECKPOINT 4 VERIFICATION:**
```bash
# Count files
ls api/src/controllers/auth/*.js | wc -l
# Should be 2 (auth-controller.js, customer-auth-controller.js)

# Server starts
npm run dev
# No import errors
```

**GATE:** Dead code removed, server stable.

---

### CHECKPOINT 5: Documentation & Polish (TRIVIAL Priority)

**Goal:** Professional documentation, fix typos
**Risk:** NONE - Documentation only
**Estimated Files:** 2 modified
**Verification:** README readable, typos fixed

#### Tasks:

##### 5.1: Fix Spanish Typo in Auth Activate Controller
**File:** `api/src/controllers/auth/auth-activate-controller.js`
**Issue:** TYPO-001
**Note:** Only if this file still exists (should be deleted in Checkpoint 4.1)

```javascript
// Line 49: Change from:
message: 'Algún error ha surgido al activar la cuenta. Pongasé en contacto con nosotros.'

// To:
message: 'Algún error ha surgido al activar la cuenta. Póngase en contacto con nosotros.'
```

**SKIP THIS if file was deleted in 4.1** ✅

##### 5.2: Reformat README for Professional Tone
**File:** `README`
**Issue:** DOC-001

Changes:
1. Remove excessive emojis (keep max 2-3 for section headers)
2. Add sections: Overview, Architecture, API Documentation link
3. Keep all technical content intact
4. Add troubleshooting section
5. Professional formatting

(Full README rewrite provided separately)

##### 5.3: Create API Documentation Stub
**File:** `API-DOCUMENTATION.md` (NEW)
**Issue:** DOC-002

Basic structure:
```markdown
# API Documentation

## Authentication

### Admin Authentication
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

### Customer Authentication
- POST /api/auth/customer/register
- POST /api/auth/customer/login

## Admin Endpoints (Require JWT Token)

### Customers
- GET /api/admin/customers
- POST /api/admin/customers
- GET /api/admin/customers/:id
- PUT /api/admin/customers/:id
- DELETE /api/admin/customers/:id

... (all other endpoints)
```

(Full API docs can be expanded later)

---

**CHECKPOINT 5 VERIFICATION:**
Manual review of README and API docs.

---

### Summary of Changes

| Checkpoint | Files Modified | Files Created | Files Deleted | Risk |
|------------|---------------|---------------|---------------|------|
| 1. Security & Critical | 2 | 0 | 0 | HIGH |
| 2. Customer-Bot | 2 | 2 | 0 | MEDIUM |
| 3. Email Management | 1 | 2 | 0 | LOW |
| 4. Dead Code Cleanup | 1 | 0 | 5 | LOW |
| 5. Documentation | 1 | 1 | 0 | NONE |
| **TOTAL** | **7** | **5** | **5** | - |

---

### Rollback Plan (If Something Goes Wrong)

**If Checkpoint 1 breaks:**
```bash
git checkout api/src/routes/index.js
git checkout api/src/routes/admin/events.js
git checkout api/index.js
```

**If Checkpoint 2 breaks:**
```bash
rm api/src/models/sequelize/customer-bot.js
rm api/src/models/sequelize/customer-bot-chat.js
# Restore empty controllers (git checkout)
git checkout api/src/controllers/admin/customer-bot-controller.js
git checkout api/src/controllers/admin/customer-bot-chat-controller.js
```

**If Checkpoint 3 breaks:**
```bash
git checkout api/src/controllers/admin/email-controller.js
rm api/src/routes/admin/emails.js
git checkout api/src/routes/index.js
```

**If Checkpoint 4 breaks:**
```bash
git checkout api/src/middlewares/user-tracking.js
# Restore deleted files if needed (unlikely)
```

**If Checkpoint 5 breaks:**
```bash
git checkout README
rm API-DOCUMENTATION.md
```

---

### Testing Plan

After each checkpoint, run:

```bash
# 1. Server starts without errors
npm run dev

# 2. All routes respond
curl http://localhost:8080/api/auth/user/check-signin
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/admin/customers

# 3. Database queries work
node -e "const db = require('./api/src/models/sequelize'); db.Customer.findAll().then(console.log);"

# 4. Frontend still connects
# Visit http://localhost:5171 (admin panel)
# Visit http://localhost:5177 (customer portal)
```

---

### Final Verification Commands

After all checkpoints complete:

```bash
# 1. Install dependencies (if needed)
cd api && npm install

# 2. Start server
npm run dev

# 3. Verify all admin routes protected
for route in customers events promoters faqs heroes; do
  echo "Testing /api/admin/$route without auth:"
  curl -i http://localhost:8080/api/admin/$route | head -1
done
# All should show "401 Unauthorized"

# 4. Test with valid auth
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123"}' | jq -r '.token')

for route in customers events promoters faqs heroes customer-bots customer-bot-chats emails; do
  echo "Testing /api/admin/$route with auth:"
  curl -i -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/admin/$route | head -1
done
# All should show "200 OK"

# 5. Verify no dead code
find api/src -name "*controller.js" | xargs grep -l "module.exports = async" | wc -l
# Should not include deleted files

# 6. Verify models loaded
node -e "const db = require('./api/src/models/sequelize'); console.log(Object.keys(db).sort());"
# Should include CustomerBot, CustomerBotChat, SentEmail

# 7. Test frontend
open http://localhost:5171  # Admin panel
open http://localhost:5177  # Customer portal
```

---

## Critical Findings

### 🔴 SECURITY CRITICAL

**Issue:** 15 out of 16 admin routes have NO authentication

**Affected Routes:**
- `/api/admin/customers`
- `/api/admin/bots`
- `/api/admin/customer-bot-chats`
- `/api/admin/customer-bots`
- `/api/admin/customer-events`
- `/api/admin/events`
- `/api/admin/event-categories`
- `/api/admin/event-occurrences`
- `/api/admin/event-prices`
- `/api/admin/faqs`
- `/api/admin/heroes`
- `/api/admin/languages`
- `/api/admin/promoters`
- `/api/admin/promoter-spots`
- `/api/admin/towns`

**Immediate Risk:**
Any visitor can:
- List all customers and users
- Delete events
- Modify all system data
- Access sensitive information

**MUST FIX BEFORE DEPLOYMENT**

---

### 🔴 BROKEN ROUTES

Three route families will crash immediately:

1. **`/api/admin/events/*`** - Missing `validateAdmin` function
2. **`/api/admin/customer-bots/*`** - Empty controller
3. **`/api/admin/customer-bot-chats/*`** - Empty controller

**Current State:** Routes registered but non-functional

---

### 🟡 INCOMPLETE FEATURES

Multiple half-implemented features:

| Feature | Database | Models | Controllers | Routes | Status |
|---------|----------|--------|-------------|--------|--------|
| customer-bot | ✅ (migration) | ❌ | ❌ (empty) | ✅ (broken) | 25% complete |
| customer-bot-chat | ✅ (migration) | ❌ | ❌ (empty) | ✅ (broken) | 25% complete |
| Image upload | ❌ | ❌ | ✅ (broken) | ❌ | 25% complete |
| Email management | ✅ (model exists) | ✅ (wrong name) | ✅ (bug) | ❌ | 50% complete |

**Recommendation:** Decide to FINISH or DELETE each feature

---

### 🟢 DEAD CODE

Files that exist but are completely unused:

**Auth Controllers (4 files):**
- `controllers/auth/auth-user-controller.js`
- `controllers/auth/auth-users.js`
- `controllers/auth/auth-activate-controller.js`
- `controllers/auth/route-controller.js`

**Admin Controllers (2 files - if routes not added):**
- `controllers/admin/email-controller.js`
- `controllers/admin/image-controller.js`

**Safe to delete:** Yes - no imports found

---

## Decision Points

Before proceeding to Phase 2 (Fix Plan), the following decisions are required:

### Q1: Customer-Bot Feature

**Context:** Migration exists, controllers empty, models missing

**Options:**
- [ ] **Option A:** Delete feature entirely (routes, controllers, migrations)
- [x] **Option B:** Implement feature (create models, implement controllers)
- [ ] **Option C:** Keep stub for future (comment out routes, add TODO)

**Decision:** ✅ **IMPLEMENT** - Create full backend implementation (models + controllers)
**Decided By:** Product Owner
**Date:** 2026-01-29

---

### Q2: Image Upload Feature

**Context:** Controller exists but broken (no model, no service, no routes)

**Options:**
- [ ] **Option A:** Delete controller
- [ ] **Option B:** Implement feature (create model, service, routes, test)
- [x] **Option C:** Mark for future - frontend view only

**Decision:** ✅ **FRONTEND VIEW ONLY** - Delete broken backend controller, create frontend component for future integration
**Decided By:** Product Owner
**Date:** 2026-01-29

---

### Q3: Email Management Feature

**Context:** Controller exists with bugs, no routes

**Options:**
- [ ] **Option A:** Delete controller
- [x] **Option B:** Fix bugs (model name) and add routes

**Decision:** ✅ **IMPLEMENT** - Fix model name bug, create routes, make functional
**Decided By:** Product Owner
**Date:** 2026-01-29

---

### Q4: IP Tracking Middleware

**Context:** Unusual pattern (runs after next()), makes external API calls

**Options:**
- [x] **Option A:** Fix pattern (move next() to end)
- [ ] **Option B:** Remove entirely (not critical for MVP)

**Decision:** ✅ **FIX PATTERN** - Refactor middleware to proper async pattern (await IP lookup, then call next())
**Decided By:** Product Owner
**Date:** 2026-01-29

---

### Q5: Logging Strategy

**Context:** 32 console.log statements across 14 files

**Options:**
- [x] **Option A:** Keep as-is (acceptable for MVP)
- [ ] **Option B:** Implement winston/pino logger

**Decision:** ✅ **KEEP CONSOLE.LOG** - Acceptable for current development phase, revisit for production
**Decided By:** Product Owner
**Date:** 2026-01-29

---

### Q6: Cookie Domain Configuration

**Context:** Hardcoded "dev-youthing.com" in proxy.js

**Questions:**
1. Is "dev-youthing.com" correct for this project?
2. Should it be configurable via .env?

**Decision:** ✅ **KEEP "YOUTHING" DOMAIN** - This is correct for local development ("youthing" or similar domain)
**Decided By:** Product Owner
**Date:** 2026-01-29
**Note:** Currently in local development environment, domain is appropriate

---

## Fix Checklist

### Phase 2: Planning
- [x] All decisions (Q1-Q6) made and documented
- [x] Fix plan created with ordered steps
- [x] Checkpoints defined with verification steps
- [x] Risk assessment completed for each change

### Phase 3: Implementation - BLOCKERS

#### SEC-001: Protect Admin Routes
- [ ] Apply `verifyToken` to all 15 unprotected routes
- [ ] Test each route without auth (expect 401)
- [ ] Test each route with valid token (expect 200)
- [ ] Verify frontend sends Authorization header
- [ ] Update frontend if broken

#### BUG-001: Fix Events Route
- [ ] Remove `validateAdmin` import from `events.js`
- [ ] Remove `validateAdmin` from all route handlers
- [ ] Test GET `/api/admin/events` (should not crash)
- [ ] Test POST `/api/admin/events` with data
- [ ] Verify authentication works via routes/index.js

#### BUG-002: Customer-Bot Route
- [ ] **If Delete:** Remove route from index.js, delete files
- [ ] **If Implement:** Create model, implement controller, test
- [ ] Verify route works or is removed

#### BUG-003: Customer-Bot-Chat Route
- [ ] **If Delete:** Remove route from index.js, delete files
- [ ] **If Implement:** Create model, implement controller, test
- [ ] Verify route works or is removed

### Phase 3: Implementation - MAJOR

#### BUG-004: Fix Email Controller Model Name
- [ ] Change `Email` to `SentEmail` (6 locations)
- [ ] **If adding routes:** Create `admin/emails.js` route file
- [ ] **If adding routes:** Add to routes/index.js
- [ ] Test CRUD operations

#### BUG-005: Fix or Delete Image Controller
- [ ] **If Delete:** Remove controller file
- [ ] **If Implement:** Create Image model, imageService, routes
- [ ] Test upload/delete functionality

#### DOC-002: Create API Documentation
- [ ] Choose format (Swagger or Markdown)
- [ ] Document all endpoints (auth, admin, customer)
- [ ] Include request/response examples
- [ ] Document error codes
- [ ] Add authentication section

#### MISSING-001: Create Customer-Bot Models
- [ ] **Only if implementing:** Create `customer-bot.js` model
- [ ] **Only if implementing:** Create `customer-bot-chat.js` model
- [ ] Define associations
- [ ] Test model queries

#### TEST-001: Add Test Framework
- [ ] Install Jest + supertest
- [ ] Create test folder structure
- [ ] Write auth tests (login, register, token validation)
- [ ] Write admin route protection tests
- [ ] Write CRUD operation tests
- [ ] Configure CI/CD if exists

### Phase 3: Implementation - MINOR

#### DEAD-001: Delete Unused Auth Files
- [ ] Delete `auth-user-controller.js`
- [ ] Delete `auth-users.js`
- [ ] Delete `auth-activate-controller.js`
- [ ] Delete `route-controller.js`
- [ ] Grep to confirm no references
- [ ] Test server startup

#### DEAD-002: Delete or Route Email/Image Controllers
- [ ] **If Delete:** Remove email-controller.js, image-controller.js
- [ ] **If Keep:** Add routes and test
- [ ] Verify no broken imports

#### INCONSIST-002: Fix User-Tracking Middleware
- [ ] **If Fix:** Move next() to end of try block
- [ ] **If Delete:** Remove middleware from app.js
- [ ] Test middleware execution

#### DEBUG-001: Remove Debug Console.log
- [ ] Remove line 2 from `api/index.js`
- [ ] Test server startup (logs clean)

#### DEBUG-002: Handle Console.log Statements
- [ ] **If Logger:** Install winston, create logger, replace all instances
- [ ] **If Keep:** Document as acceptable for current phase

#### DOC-003: Fix Hardcoded Domain
- [ ] Add `COOKIE_DOMAIN` to .env.example
- [ ] Update proxy.js to use env variable
- [ ] Test cookie behavior in dev mode

#### SEC-002: Add Environment Variable Validation
- [ ] Create `validate-env.js` utility
- [ ] Call in `index.js` before server start
- [ ] Test with missing variables (should exit gracefully)
- [ ] Test with invalid API_URL (should show error)

#### NAMING-001: Standardize Route Naming
- [ ] **If Standardizing:** Rename routes, update frontend
- [ ] **If Keeping:** Document naming convention

#### ARCH-001: Document Database Architecture
- [ ] Add MySQL vs MongoDB section to README
- [ ] Explain when to use each
- [ ] Add examples

#### MIGRATE-001: Document Migration Process
- [ ] Add migration commands to README
- [ ] Document rollback process
- [ ] Add troubleshooting section

### Phase 3: Implementation - TRIVIAL

#### TYPO-001: Fix Spanish Typo
- [ ] Change "Pongasé" to "Póngase" in auth-activate-controller.js
- [ ] (Only if keeping file - otherwise deleted by DEAD-001)

#### TYPO-002: Fix Delete Error Message
- [ ] Change "actualizar" to "borrar" in email-controller.js line 102

#### DOC-001: Reformat README
- [ ] Remove excessive emojis
- [ ] Add professional structure
- [ ] Keep all technical content
- [ ] Consider separate ARCHITECTURE.md

### Phase 4: Documentation & Cleanup

#### README Updates
- [ ] Add architecture overview
- [ ] Add development workflow
- [ ] Add testing instructions
- [ ] Add deployment instructions
- [ ] Add troubleshooting section
- [ ] Add contribution guidelines

#### API Documentation
- [ ] Create comprehensive API docs
- [ ] Add Postman collection (optional)
- [ ] Add example requests/responses

#### Code Comments
- [ ] Add JSDoc comments to complex functions
- [ ] Document business logic decisions
- [ ] Add inline comments for non-obvious code

#### Database Documentation
- [ ] Document all tables and relationships
- [ ] Add ER diagram (optional)
- [ ] Document migration strategy

### Phase 5: Final Verification

#### Security Verification
- [ ] All admin routes protected (test without auth → 401)
- [ ] JWT tokens validated correctly
- [ ] No sensitive data in logs
- [ ] Environment variables not committed

#### Functionality Verification
- [ ] All routes respond (no crashes)
- [ ] Auth flow works (register → activate → login)
- [ ] Admin CRUD operations work
- [ ] Customer features work
- [ ] Telegram bot responds
- [ ] WebSocket connections work
- [ ] Email sending works

#### Code Quality Verification
- [ ] No dead code remains
- [ ] No console.log in production (or documented)
- [ ] No hardcoded values
- [ ] All TODOs addressed or documented

#### Documentation Verification
- [ ] README complete and accurate
- [ ] API docs exist and complete
- [ ] All setup steps verified
- [ ] All environment variables documented

#### Testing Verification
- [ ] All tests pass
- [ ] Coverage meets minimum threshold
- [ ] Critical paths tested

### Run Commands for Final Verification

```bash
# Install all dependencies
npm run install

# Setup environment
cd api
cp .env.example .env
cp src/config/config-example.json src/config/config.json
# Edit both files with real values

# Start Redis
redis-server

# Create database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS \`telegram-bot\`;"

# Run migrations
cd api
npx sequelize-cli db:migrate

# Start API server
cd api
npm run dev
# Verify: Server starts without errors

# In another terminal: Start frontends
cd telegram-bot
npm run dev
# Verify: All 5 frontends + proxy start

# Test admin routes (should return 401 without auth)
curl http://localhost:8080/api/admin/customers
# Expected: 401 Unauthorized

# Test admin login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@admin.com","password":"password"}'
# Expected: 200 with JWT token

# Test protected route with token
curl -H "Authorization: Bearer <token>" \
  http://localhost:8080/api/admin/customers
# Expected: 200 with data

# Run tests
cd api
npm test
# Expected: All tests pass

# Check for dead code
cd api
find src -name "*.js" -exec grep -l "TODO\|FIXME\|XXX" {} \;
# Review all TODOs

# Verify no hardcoded secrets
grep -r "password\|secret\|token" src --include="*.js" | grep -v process.env
# Review results
```

---

## Environment Variables Audit

**All variables documented in `.env.example`:** ✅ YES

| Variable | Required | Used In | Validated | Notes |
|----------|----------|---------|-----------|-------|
| NODE_ENV | ✅ | app.js, error-handler.js | ❌ | Should validate: development/production/test |
| PORT | ✅ | index.js | ❌ | Should validate: number, 1-65535 |
| DEFAULT_LANGUAGE | ✅ | user-agent.js | ❌ | Should validate: es/en |
| DB_TYPE | ⚠️ | Not used | ❌ | Can be removed from .env.example |
| DATABASE_HOST | ✅ | models/sequelize/index.js | ❌ | Should validate: exists |
| DATABASE_DIALECT | ✅ | models/sequelize/index.js | ❌ | Should validate: mysql/postgres/etc |
| DATABASE_USER | ✅ | models/sequelize/index.js | ❌ | Should validate: exists |
| DATABASE_PASSWORD | ✅ | models/sequelize/index.js | ❌ | Should validate: exists |
| DATABASE_NAME | ✅ | models/sequelize/index.js | ❌ | Should validate: exists |
| MONGODB_URI | ✅ | models/mongoose/index.js | ❌ | Should validate: URI format |
| REDIS_URL | ✅ | app.js | ❌ | Should validate: URI format |
| SESSION_SECRET | ✅ | app.js | ❌ | Should validate: min length 32 |
| JWT_SECRET | ✅ | auth.js, controllers | ❌ | Should validate: min length 32 |
| OPENAI_API_KEY | ✅ | openai-service.js | ❌ | Should validate: starts with sk- |
| OPENAI_ASSISTANT_CHATBOT_ID | ✅ | chat-controller.js | ❌ | Should validate: exists |
| TELEGRAM_ADMIN_TOKEN | ✅ | expose-services.js | ❌ | Should validate: format |
| TELEGRAM_ADMIN_CHAT_ID | ✅ | expose-services.js | ❌ | Should validate: number |
| EMAIL_TYPE | ✅ | email-service.js | ✅ | Validated: gmail/smtp |
| API_URL | ✅ | app.js, email-service.js | ❌ | **CRITICAL:** Will crash if invalid |
| GOOGLE_EMAIL | ⚠️ | email-service.js | ❌ | Only if EMAIL_TYPE=gmail |
| GOOGLE_CLIENT_ID | ⚠️ | email-service.js | ❌ | Only if EMAIL_TYPE=gmail |
| GOOGLE_CLIENT_SECRET | ⚠️ | email-service.js | ❌ | Only if EMAIL_TYPE=gmail |
| GOOGLE_REFRESH_TOKEN | ⚠️ | email-service.js | ❌ | Only if EMAIL_TYPE=gmail |
| EMAIL | ⚠️ | email-service.js | ❌ | Only if EMAIL_TYPE=smtp |
| EMAIL_HOST | ⚠️ | email-service.js | ❌ | Only if EMAIL_TYPE=smtp |
| EMAIL_PORT | ⚠️ | email-service.js | ❌ | Only if EMAIL_TYPE=smtp |
| EMAIL_PASSWORD | ⚠️ | email-service.js | ❌ | Only if EMAIL_TYPE=smtp |

**Recommendation:** Implement SEC-002 to validate all variables at startup

---

## Dependency Analysis

### No Circular Dependencies Found ✅

### Broken Import Chains ❌

```
routes/admin/events.js
  → user-tracking.js (validateAdmin)
    → ❌ DOES NOT EXIST

routes/admin/customer-bots.js
  → customer-bot-controller.js
    → ❌ EMPTY FILE (1 line)

routes/admin/customer-bot-chats.js
  → customer-bot-chat-controller.js
    → ❌ EMPTY FILE (1 line)

controllers/admin/email-controller.js
  → sequelizeDb.Email
    → ❌ WRONG NAME (should be SentEmail)

controllers/admin/image-controller.js
  → mongooseDb.Image
    → ❌ DOES NOT EXIST
  → req.imageService
    → ❌ NOT IN expose-services.js
```

### Orphaned Files (No Imports) 🗑️

```
controllers/auth/auth-user-controller.js
  ← Used by: auth-users.js (which is also orphaned)

controllers/auth/auth-users.js
  ← Used by: NOBODY (not in routes/index.js)

controllers/auth/auth-activate-controller.js
  ← Used by: NOBODY

controllers/auth/route-controller.js
  ← Used by: NOBODY

controllers/admin/email-controller.js
  ← Used by: NOBODY (no routes)

controllers/admin/image-controller.js
  ← Used by: NOBODY (no routes)
```

### Package Dependencies Audit

**Unused packages in package.json:**
```bash
# Check for unused dependencies
npm install -g depcheck
cd api
depcheck
```

**Outdated packages:**
```bash
cd api
npm outdated
```

**Security vulnerabilities:**
```bash
cd api
npm audit
npm audit fix
```

---

## Notes & Observations

### Positive Findings ✅

1. **Clean separation of concerns:** Controllers, routes, models well-organized
2. **Consistent naming:** Most files follow clear patterns
3. **Modern Node features:** Uses async/await, ES6 imports
4. **Good ORM usage:** Sequelize and Mongoose properly configured
5. **Middleware architecture:** Clean middleware pattern
6. **Transaction support:** Auth uses database transactions correctly
7. **Password security:** bcrypt properly implemented
8. **JWT implementation:** Correct token generation and validation

### Areas of Concern ⚠️

1. **No input validation:** Controllers lack request validation (consider express-validator)
2. **No rate limiting:** No protection against brute force attacks
3. **No request logging:** Cannot audit API access
4. **No error codes:** Generic error messages, hard to debug
5. **No health check endpoint:** Cannot monitor server status
6. **No graceful shutdown:** Server doesn't handle SIGTERM/SIGINT
7. **No database connection pooling config:** Using defaults
8. **No CORS configuration:** May cause issues in production

### Recommended Future Enhancements 🚀

1. **Input validation:** Add express-validator or joi
2. **Rate limiting:** Add express-rate-limit
3. **Request logging:** Add morgan or winston-express
4. **Health check:** Add `/health` endpoint
5. **API versioning:** Add `/v1/` prefix to routes
6. **Error codes:** Standardize error response format
7. **Pagination:** Standardize pagination across all list endpoints
8. **Caching:** Add Redis caching for frequently accessed data
9. **File upload:** Standardize file upload handling
10. **Background jobs:** Add bull or agenda for async tasks

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-29 | Claude (SSE) | Initial baseline and issue register |
| 1.1 | _____ | _____ | _____ |
| 1.2 | _____ | _____ | _____ |

---

## Sign-Off

**Phase 0 (Baseline):** ✅ Complete
**Phase 1 (Issue Register):** ✅ Complete
**Phase 2 (Fix Plan):** ✅ Complete
**Phase 3 (Implementation):** ⏸️ Ready to Start
**Phase 4 (Documentation):** ⏸️ Pending
**Phase 5 (Final Delivery):** ⏸️ Pending

---

**Last Updated:** 2026-01-29
**Next Review:** After Q1-Q6 decisions made

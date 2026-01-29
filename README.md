# Event Management Platform with AI-Powered Customer Support

A full-stack event management system featuring AI chatbot integration, Telegram notifications, and comprehensive admin/customer portals.

## Overview

This platform provides event management capabilities with three distinct user types, AI-powered customer support via OpenAI Assistants API, and Telegram bot integration for admin notifications.

**Key Features:**
- Multi-tenant architecture (Admins, Customers, Promoters)
- AI chatbot with human escalation workflow
- Real-time admin notifications via Telegram
- Event browsing and management
- Email verification and password reset
- WebSocket real-time updates

## Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Backend** | Node.js + Express | 5.1.0 |
| **Primary Database** | MySQL | 8+ (Sequelize ORM) |
| **Secondary Database** | MongoDB | (Mongoose) |
| **Cache & Sessions** | Redis | 5.10.0 |
| **Frontend** | Web Components + Vite | - |
| **AI Integration** | OpenAI Assistants API | Latest |
| **Bot Integration** | Telegram Bot API | 0.66.0 |
| **Real-time** | WebSocket (ws) | 8.18.0 |
| **Authentication** | JWT + bcrypt | - |
| **Email** | Nodemailer (SMTP/Gmail OAuth) | 7.0.12 |
| **Vector Search** | ChromaDB | 3.0.17 |

## Architecture

### User Types

**1. Admins (Users)**
- Role: Internal staff, system administrators
- Capabilities: Full CRUD on all resources, view reports
- Frontend: `client/admin/front-admin/` (Web Components + Redux)
- Authentication: JWT + Redis sessions

**2. Customers**
- Role: Public users, event attendees
- Capabilities: Browse events, AI chat, manage profile
- Frontend: `client/customer/front-customer/` (Web Components)
- Authentication: JWT only

**3. Promoters**
- Role: Event organizers
- Capabilities: Manage own events and venues
- Status: Backend implemented, frontend pending

### Database Architecture

**MySQL (Primary - Transactional Data):**
- User management (users, customers, promoters)
- Credentials and tokens (activation, password reset)
- Events and categories
- Locations and pricing

**MongoDB (Secondary - Unstructured Data):**
- Chat conversation history
- CMS content (FAQs, heroes)
- Flexible schema for AI interactions

**Redis (Cache & Sessions):**
- Admin session storage
- Real-time pub/sub for WebSocket
- Caching layer

## Quick Start

### Prerequisites

- Node.js 18+
- MySQL 8+
- MongoDB
- Redis
- Git

### Installation

```bash
# 1. Clone repository
git clone <repository-url>
cd telegram-bot

# 2. Install API dependencies
cd api
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your credentials

# 4. Configure database
cp src/config/config-example.json src/config/config.json
# Edit config.json with MySQL credentials

# 5. Start Redis
redis-server

# 6. Create MySQL database
mysql -u root -p -e "CREATE DATABASE \`telegram-bot\`;"

# 7. Run migrations
npx sequelize-cli db:migrate

# 8. Start API server
npm run dev
# Server runs on http://localhost:8080
```

### Frontend Setup

```bash
# Install all frontend dependencies
cd ..
npm run install

# Start all frontends + proxy (development)
npm run dev
# Proxy runs on http://localhost:80
# - /api → API server (port 8080)
# - /admin → Admin panel (port 5171)
# - / → Customer portal (port 5177)
```

## Environment Variables

Required variables in `api/.env`:

```env
# Server
NODE_ENV=development
PORT=8080
API_URL=http://localhost:8080

# Database
DATABASE_HOST=localhost
DATABASE_DIALECT=mysql
DATABASE_USER=root
DATABASE_PASSWORD=your-password
DATABASE_NAME=telegram-bot
MONGODB_URI=mongodb://localhost:27017/telegram-bot

# Redis
REDIS_URL=redis://localhost:6379

# Security
SESSION_SECRET=your-session-secret-here
JWT_SECRET=your-jwt-secret-here

# OpenAI
OPENAI_API_KEY=sk-your-key
OPENAI_ASSISTANT_CHATBOT_ID=asst_your-id

# Telegram Bot
TELEGRAM_ADMIN_TOKEN=your-bot-token
TELEGRAM_ADMIN_CHAT_ID=your-chat-id

# Email (choose one)
EMAIL_TYPE=gmail  # or 'smtp'

# Gmail OAuth (if EMAIL_TYPE=gmail)
GOOGLE_EMAIL=your-email@gmail.com
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REFRESH_TOKEN=your-refresh-token

# SMTP (if EMAIL_TYPE=smtp)
EMAIL=your-email@example.com
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_PASSWORD=your-password
```

## API Documentation

### Authentication Endpoints

#### Admin Authentication
```
POST   /api/auth/register          Register admin user
GET    /api/auth/activate/:token   Activate admin account
POST   /api/auth/login             Admin login (returns JWT + creates session)
POST   /api/auth/forgot-password   Request password reset
POST   /api/auth/reset-password/:token  Reset password
GET    /api/auth/me                Get current admin (requires JWT)
GET    /api/auth/user/check-signin Check session status
```

#### Customer Authentication
```
POST   /api/auth/customer/register          Register customer
GET    /api/auth/customer/activate/:token   Activate customer account
POST   /api/auth/customer/login             Customer login (returns JWT)
POST   /api/auth/customer/forgot-password   Request password reset
POST   /api/auth/customer/reset-password/:token  Reset password
GET    /api/auth/customer/me                Get current customer (requires JWT)
```

### Admin Endpoints (All require JWT via `Authorization: Bearer <token>`)

```
# User Management
GET/POST/PUT/DELETE   /api/admin/users
GET/POST/PUT/DELETE   /api/admin/customers
GET/POST/PUT/DELETE   /api/admin/promoters

# Event Management
GET/POST/PUT/DELETE   /api/admin/events
GET/POST/PUT/DELETE   /api/admin/event-categories
GET/POST/PUT/DELETE   /api/admin/event-occurrences
GET/POST/PUT/DELETE   /api/admin/event-prices
GET/POST/PUT/DELETE   /api/admin/customer-events

# Content Management
GET/POST/PUT/DELETE   /api/admin/faqs
GET/POST/PUT/DELETE   /api/admin/heroes
GET/POST/PUT/DELETE   /api/admin/languages

# Bot Management
GET/POST/PUT/DELETE   /api/admin/bots
GET/POST/PUT/DELETE   /api/admin/customer-bots
GET/POST/PUT/DELETE   /api/admin/customer-bot-chats

# Location Management
GET/POST/PUT/DELETE   /api/admin/towns
GET/POST/PUT/DELETE   /api/admin/promoter-spots

# Email Tracking
GET/POST/PUT/DELETE   /api/admin/emails
```

### Customer Endpoints

```
GET    /api/customer/faqs          List FAQs (public)
GET    /api/customer/heroes        List hero banners (public)
POST   /api/customer/chats         Send message to AI chatbot
GET    /api/customer/search        Search events/products
```

## Development

### Project Structure

```
telegram-bot/
├── api/                    # Backend API
│   ├── index.js            # Server entry point
│   ├── src/
│   │   ├── app.js          # Express configuration
│   │   ├── routes/         # Route definitions
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Database models
│   │   │   ├── sequelize/  # MySQL models
│   │   │   └── mongoose/   # MongoDB models
│   │   ├── middlewares/    # Express middleware
│   │   ├── services/       # Business logic
│   │   ├── migrations/     # Database migrations
│   │   ├── events/         # Event handlers
│   │   └── templates/      # Email templates
│   └── .env.example
├── client/                 # Frontend applications
│   ├── admin/
│   │   ├── front-admin/    # Admin panel
│   │   └── auth-admin/     # Admin auth form
│   ├── customer/
│   │   ├── front-customer/ # Customer portal
│   │   └── auth-customer/  # Customer auth form
│   └── auth/               # Email activation
├── proxy.js                # Development proxy
└── package.json            # Root package
```

### Database Migrations

```bash
# Create new migration
npx sequelize-cli migration:generate --name migration-name

# Run migrations
npx sequelize-cli db:migrate

# Rollback last migration
npx sequelize-cli db:migrate:undo

# Rollback all migrations
npx sequelize-cli db:migrate:undo:all

# Check migration status
npx sequelize-cli db:migrate:status
```

### Running Tests

```bash
cd api
npm test
```

Note: Test framework needs to be set up (currently placeholder).

## Troubleshooting

### Common Errors

**"Cannot find module 'connect-redis'"**
```bash
cd api && npm install
```

**"ECONNREFUSED ::1:6379"**
```bash
# Redis not running
redis-server
```

**"Config file not found"**
```bash
# Create config file
cp api/src/config/config-example.json api/src/config/config.json
```

**"ER_ACCESS_DENIED_ERROR"**
- Check MySQL credentials in `.env` and `config.json`

**"Table 'users' doesn't exist"**
```bash
# Run migrations
cd api
npx sequelize-cli db:migrate
```

**"Correo o contraseña inválidos" (after registration)**
- Account not activated - check email for activation link

## Features

### AI Chatbot
- Powered by OpenAI Assistants API
- Context-aware conversations with thread management
- Tool calling capabilities:
  - Product/event search via ChromaDB
  - Human escalation workflow
  - Context analysis

### Human Escalation Workflow
1. Customer chats with AI assistant
2. AI determines escalation needed (user behavior or no answer)
3. Message sent to Telegram admin group
4. Admin replies in Telegram
5. Response relayed to customer via WebSocket
6. Conversation saved to MongoDB

### Real-time Features
- WebSocket pub/sub system
- Channel-based message routing
- Admin notification system
- Live customer support

## Production Deployment

### Recommended Setup
- PM2 for process management
- Nginx as reverse proxy
- Let's Encrypt for SSL
- Environment-specific configs

### Security Checklist
- [ ] Change all default secrets (SESSION_SECRET, JWT_SECRET)
- [ ] Use strong database passwords
- [ ] Enable HTTPS in production
- [ ] Configure CORS properly
- [ ] Set NODE_ENV=production
- [ ] Review and restrict API_URL domain
- [ ] Enable rate limiting
- [ ] Configure firewall rules

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

[Specify License]

## Support

For issues and questions:
- GitHub Issues: [repository-url]/issues
- Documentation: See `STABILIZATION-REPORT.md` for detailed architecture

---

**Built with Claude Code** - AI-assisted development for faster, cleaner code.

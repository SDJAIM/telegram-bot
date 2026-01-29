# Telegram Bot Verification - Test Plan

## Overview

This document provides manual testing procedures for the Telegram bot verification/login flow implemented in the customer registration system.

## Prerequisites

1. **Environment Setup:**
   ```bash
   cd api
   npm install
   ```

2. **Environment Variables:**
   Ensure `.env` file has:
   ```env
   TELEGRAM_CUSTOMER_BOT_TOKEN=your-bot-token-here
   TELEGRAM_CUSTOMER_BOT_NAME=@YourBotName
   EMAIL_TYPE=gmail  # or smtp
   # ... other email config
   ```

3. **Database Migration:**
   ```bash
   cd api
   npx sequelize-cli db:migrate
   ```

4. **Start Server:**
   ```bash
   cd api
   npm run dev
   ```

5. **Telegram Bot Setup:**
   - Create a bot via @BotFather on Telegram
   - Get the bot token
   - Add token to `.env` as `TELEGRAM_CUSTOMER_BOT_TOKEN`
   - Add bot username to `.env` as `TELEGRAM_CUSTOMER_BOT_NAME`

---

## Test Cases

### Test 1: Customer Registration & Code Generation

**Objective:** Verify that registration creates a 6-digit verification code and sends it via email.

**Steps:**

1. Register a new customer:
   ```bash
   curl -X POST http://localhost:8080/api/auth/customer/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "testuser@example.com",
       "password": "SecurePass123"
     }'
   ```

2. **Expected Response:**
   ```json
   {
     "message": "Usuario registrado correctamente. Revisa tu email para activar la cuenta.",
     "customerId": 1
   }
   ```

3. **Database Verification:**
   ```sql
   SELECT * FROM bot_verifications WHERE email = 'testuser@example.com';
   ```

   **Expected Result:**
   - `email`: testuser@example.com
   - `verificationCode`: 6-digit code (e.g., 012345, 768390)
   - `telegramUserId`: NULL
   - `createdAt`: Current timestamp

4. **Email Verification:**
   - Check email inbox for activation email
   - Email should contain:
     - Step 1: Activation link
     - Step 2: Bot name and verification code
     - Example: `/login testuser@example.com:123456`

**Pass Criteria:**
- ✅ Registration returns 201 status
- ✅ `bot_verifications` record created
- ✅ `verificationCode` is exactly 6 digits (including leading zeros)
- ✅ Email contains both activation link AND bot verification instructions

---

### Test 2: Code Format - Leading Zeros

**Objective:** Verify that codes with leading zeros are properly formatted.

**Steps:**

1. Register multiple users and check codes:
   ```bash
   # Register 5-10 test users
   for i in {1..10}; do
     curl -X POST http://localhost:8080/api/auth/customer/register \
       -H "Content-Type: application/json" \
       -d "{\"name\":\"User$i\",\"email\":\"user$i@test.com\",\"password\":\"Pass1234\"}"
   done
   ```

2. **Database Check:**
   ```sql
   SELECT email, verificationCode, LENGTH(verificationCode) as code_length
   FROM bot_verifications;
   ```

**Pass Criteria:**
- ✅ ALL codes have `code_length = 6`
- ✅ Codes may include values like `000123`, `001234`, etc.
- ✅ Codes are stored as strings (not integers)

---

### Test 3: Telegram Bot - Unverified User Gate

**Objective:** Verify that unverified users are blocked and receive login instructions.

**Steps:**

1. Open Telegram and find your bot (use the bot name from env var)

2. Send any message (NOT /login):
   ```
   Hello
   ```

3. **Expected Response:**
   ```
   Para poder usar el bot debes escribir: /login email:codigo

   Ejemplo: /login carlossedagambin@gmail.com:768390
   ```

4. Try other messages:
   ```
   /start
   /help
   Test message
   ```

**Pass Criteria:**
- ✅ ALL messages return the login instructions
- ✅ No other bot functionality is accessible
- ✅ Instructions are in Spanish
- ✅ Instructions show correct format

---

### Test 4: Telegram Bot - /login Success

**Objective:** Verify successful login links telegramUserId.

**Steps:**

1. Get verification code from email or database:
   ```sql
   SELECT email, verificationCode FROM bot_verifications
   WHERE email = 'testuser@example.com';
   ```

2. In Telegram bot, send:
   ```
   /login testuser@example.com:123456
   ```
   (Replace `123456` with actual code from step 1)

3. **Expected Response:**
   ```
   ¡Verificación exitosa! Tu cuenta de Telegram ha sido vinculada correctamente. Ya puedes usar el bot.
   ```

4. **Database Verification:**
   ```sql
   SELECT email, verificationCode, telegramUserId
   FROM bot_verifications
   WHERE email = 'testuser@example.com';
   ```

   **Expected Result:**
   - `telegramUserId`: Your Telegram user ID (numeric string)
   - Other fields unchanged

5. Send another message:
   ```
   /start
   ```

6. **Expected Response:**
   ```
   ¡Hola! Estás verificado con el email: testuser@example.com

   Bienvenido al bot. Aquí puedes interactuar con nuestros servicios.
   ```

**Pass Criteria:**
- ✅ Login succeeds with correct credentials
- ✅ `telegramUserId` is saved in database
- ✅ User can now access bot normally
- ✅ Subsequent messages don't ask for login

---

### Test 5: Telegram Bot - /login Format Variations

**Objective:** Verify robust parsing of /login command.

**Test Inputs:**

| Input | Expected Result |
|-------|----------------|
| `/login test@example.com:123456` | ✅ Success (if valid) |
| `/LOGIN test@example.com:123456` | ✅ Success (case insensitive) |
| `/login test@example.com : 123456` | ✅ Success (spaces around :) |
| `/login  test@example.com:123456` | ✅ Success (extra space after command) |
| `/login test@example.com` | ❌ Format error |
| `/login test@example.com:12345` | ❌ Code must be 6 digits |
| `/login test@example.com:1234567` | ❌ Code must be 6 digits |
| `/login invalid-email:123456` | ❌ Invalid email format |
| `/login test@example.com:abc123` | ❌ Code must be digits only |

**Steps:**

1. For each input above, send the message to bot
2. Verify expected result

**Pass Criteria:**
- ✅ Valid formats are accepted
- ✅ Invalid formats are rejected with appropriate error messages
- ✅ Error messages don't reveal whether email or code was wrong

---

### Test 6: Telegram Bot - /login Wrong Credentials

**Objective:** Verify error handling for invalid credentials.

**Steps:**

1. Try with wrong email:
   ```
   /login wrongemail@example.com:123456
   ```

2. **Expected Response:**
   ```
   Email o código incorrectos. Por favor, verifica e intenta de nuevo.
   ```

3. Try with wrong code:
   ```
   /login testuser@example.com:999999
   ```

4. **Expected Response:**
   ```
   Email o código incorrectos. Por favor, verifica e intenta de nuevo.
   ```

**Pass Criteria:**
- ✅ Same error message for both cases (security)
- ✅ No database changes
- ✅ User remains unverified

---

### Test 7: Telegram Bot - Already Linked Account

**Objective:** Verify that a Telegram user cannot link multiple email accounts.

**Steps:**

1. Successfully link first account (see Test 4)

2. Register a second account:
   ```bash
   curl -X POST http://localhost:8080/api/auth/customer/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Second User",
       "email": "second@example.com",
       "password": "SecurePass123"
     }'
   ```

3. Get the new verification code

4. From the SAME Telegram account, try to login:
   ```
   /login second@example.com:654321
   ```

5. **Expected Response:**
   ```
   Ya estás vinculado a una cuenta. Si necesitas cambiar de cuenta, contacta al soporte.
   ```

6. **Database Verification:**
   ```sql
   SELECT email, telegramUserId FROM bot_verifications
   WHERE email = 'second@example.com';
   ```

   **Expected Result:**
   - `telegramUserId`: Still NULL (not linked)

**Pass Criteria:**
- ✅ Second login attempt is rejected
- ✅ First account remains linked
- ✅ Second account remains unlinked

---

### Test 8: Code Reuse Prevention

**Objective:** Verify that a verification code cannot be used twice.

**Steps:**

1. Successfully link account A to Telegram user 1 (see Test 4)

2. From a DIFFERENT Telegram account (user 2), try to use the same code:
   ```
   /login testuser@example.com:123456
   ```

3. **Expected Response:**
   ```
   Email o código incorrectos. Por favor, verifica e intenta de nuevo.
   ```

**Pass Criteria:**
- ✅ Code cannot be reused
- ✅ Only one telegramUserId is linked per verification record

---

### Test 9: Database Indexes & Performance

**Objective:** Verify that indexes exist for efficient lookups.

**Steps:**

1. Check indexes:
   ```sql
   SHOW INDEXES FROM bot_verifications;
   ```

2. **Expected Indexes:**
   - `PRIMARY` on `id`
   - `bot_verifications_email` on `email`
   - `bot_verifications_code` on `verificationCode`
   - `bot_verifications_telegram_user_id` on `telegramUserId` (UNIQUE)

3. Test query performance:
   ```sql
   EXPLAIN SELECT * FROM bot_verifications
   WHERE email = 'test@example.com' AND verificationCode = '123456';
   ```

   Should use indexes (not full table scan)

**Pass Criteria:**
- ✅ All expected indexes exist
- ✅ Queries use indexes (check EXPLAIN output)

---

### Test 10: Email Template Content

**Objective:** Verify email contains all required information.

**Steps:**

1. Register a user and check email

2. **Email Must Contain:**
   - ✅ User's name
   - ✅ Activation link (Step 1)
   - ✅ Bot name from env var
   - ✅ Full `/login` command example
   - ✅ Verification code displayed prominently
   - ✅ Email address in login command
   - ✅ Professional formatting
   - ✅ Spanish language

**Pass Criteria:**
- ✅ All elements present
- ✅ No placeholder text (e.g., "undefined", "null")
- ✅ Code is exactly 6 digits

---

## Edge Cases & Security Tests

### Security Test 1: No Code Logging

**Objective:** Ensure verification codes are never logged to console/files.

**Steps:**

1. Set log level to verbose if available

2. Register multiple users

3. Search server logs for verification codes:
   ```bash
   grep -r "123456\|000000\|verificationCode" api/logs/
   ```

**Pass Criteria:**
- ✅ No verification codes in logs
- ✅ Only generic messages like "Verification code generated"

---

### Security Test 2: SQL Injection in /login

**Objective:** Verify input sanitization.

**Test Inputs:**
```
/login test@example.com' OR '1'='1:123456
/login test@example.com:123456'; DROP TABLE bot_verifications;--
```

**Pass Criteria:**
- ✅ No database errors
- ✅ No SQL injection successful
- ✅ Sequelize ORM handles sanitization

---

### Performance Test: Concurrent Registrations

**Objective:** Verify system handles concurrent registrations.

**Steps:**

1. Run concurrent registration requests:
   ```bash
   for i in {1..20}; do
     curl -X POST http://localhost:8080/api/auth/customer/register \
       -H "Content-Type: application/json" \
       -d "{\"name\":\"Concurrent$i\",\"email\":\"concurrent$i@test.com\",\"password\":\"Pass1234\"}" &
   done
   wait
   ```

2. **Database Check:**
   ```sql
   SELECT COUNT(*) FROM bot_verifications WHERE email LIKE 'concurrent%';
   ```

**Pass Criteria:**
- ✅ 20 records created
- ✅ All codes are unique
- ✅ No duplicate emails
- ✅ No database errors

---

## Cleanup After Testing

```sql
-- Remove test data
DELETE FROM bot_verifications WHERE email LIKE '%test.com';
DELETE FROM bot_verifications WHERE email LIKE '%example.com';
DELETE FROM customer_activation_tokens WHERE customerId IN (
  SELECT id FROM customers WHERE email LIKE '%test.com'
);
DELETE FROM customer_credentials WHERE email LIKE '%test.com';
DELETE FROM customers WHERE email LIKE '%test.com';
```

---

## Expected Results Summary

| Test | Expected Outcome |
|------|-----------------|
| Registration | Creates 6-digit code in DB |
| Code Format | Always 6 digits (with leading zeros) |
| Unverified Gate | All messages blocked except /login |
| /login Success | Links telegramUserId, grants access |
| Format Variations | Robust parsing, accepts valid formats |
| Wrong Credentials | Generic error, no details leaked |
| Already Linked | Prevents multiple account linking |
| Code Reuse | Codes work only once |
| Indexes | All indexes present and used |
| Email Content | Complete information, proper formatting |

---

## Troubleshooting

### Bot Not Responding

1. Check bot token is valid
2. Verify polling is active: `console.log` should show "Customer Telegram bot initialized"
3. Check firewall/network for Telegram API access

### Email Not Sending

1. Verify email config in `.env`
2. Check email service logs
3. Ensure template file exists: `api/src/templates/emails/es/activation-telegram-bot.ejs`

### Database Errors

1. Run migrations: `npx sequelize-cli db:migrate`
2. Check database connection
3. Verify model is loaded: Check `api/src/models/sequelize/index.js`

---

## Test Report Template

```
Date: _______________
Tester: _______________
Environment: Development / Staging / Production

Test Results:
[ ] Test 1: Registration & Code Generation - PASS / FAIL
[ ] Test 2: Code Format - Leading Zeros - PASS / FAIL
[ ] Test 3: Unverified User Gate - PASS / FAIL
[ ] Test 4: /login Success - PASS / FAIL
[ ] Test 5: Format Variations - PASS / FAIL
[ ] Test 6: Wrong Credentials - PASS / FAIL
[ ] Test 7: Already Linked - PASS / FAIL
[ ] Test 8: Code Reuse - PASS / FAIL
[ ] Test 9: Database Indexes - PASS / FAIL
[ ] Test 10: Email Template - PASS / FAIL

Security Tests:
[ ] No Code Logging - PASS / FAIL
[ ] SQL Injection Prevention - PASS / FAIL

Performance Tests:
[ ] Concurrent Registrations - PASS / FAIL

Issues Found:
_______________________________________
_______________________________________

Notes:
_______________________________________
_______________________________________
```

---

**Last Updated:** 2026-01-29

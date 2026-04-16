# SmartBus - Startup & Troubleshooting Guide

## ✅ Quick Start

### 1. Prerequisites

- **Node.js**: v18 or higher
- **MongoDB**: Running on `mongodb://localhost:27017`
- **npm**: Latest version

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

The `.env` file has been configured with:

```
VITE_CLERK_PUBLISHABLE_KEY=...
MONGODB_URI=mongodb://localhost:27017/smartbus
JWT_SECRET=smartbus_jwt_secret_key_2026_india
JWT_EXPIRES_IN=7d
PORT=5000
VITE_API_URL=http://localhost:5000
```

### 4. Start MongoDB

**Option A: Local MongoDB**

```bash
mongod
```

**Option B: Docker**

```bash
docker run -d -p 27017:27017 --name smartbus-mongo mongo:latest
```

### 5. Run Development Servers

**Terminal 1 - Frontend (Vite on port 5173)**

```bash
npm run dev
```

**Terminal 2 - Backend API (Express on port 5000)**

```bash
npm run dev:api
```

**Terminal 3 - WebSocket Server (Optional, on port 3001)**

```bash
npm run dev:ws
```

**Or Run All at Once**

```bash
npm run dev:all
```

---

## 🔍 Verify Setup is Working

### Step 1: Test Backend Connection

Open browser console and run:

```js
fetch("http://localhost:5000")
  .then((r) => r.json())
  .then((d) => console.log("✅ Backend OK:", d))
  .catch((e) => console.error("❌ Backend Failed:", e));
```

**Expected Output:**

```json
{
  "message": "API is running...",
  "status": "ok",
  "timestamp": "2026-04-16T10:30:00.000Z"
}
```

### Step 2: Test Health Check

```js
fetch("http://localhost:5000/api/health")
  .then((r) => r.json())
  .then((d) => console.log("✅ Health OK:", d))
  .catch((e) => console.error("❌ Health Failed:", e));
```

### Step 3: Test Login (After Adding Test User)

```js
fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "test@gmail.com", password: "123456" }),
  credentials: "include",
})
  .then((r) => r.json())
  .then((d) => console.log("✅ Login OK:", d))
  .catch((e) => console.error("❌ Login Failed:", e));
```

---

## 🚫 Troubleshooting

### Issue: "Failed to fetch" Error

**Cause 1: Backend not running**

- Check if terminal shows `🚀 SmartBus API Server running on http://localhost:5000`
- Solution: Run `npm run dev:api`

**Cause 2: MongoDB not connected**

- Check backend logs for: `❌ MongoDB Connection Failed`
- Solution:
  - Ensure MongoDB is running: `mongod`
  - Check MONGODB_URI in `.env`
  - Verify connection: `mongodb://localhost:27017` is accessible

**Cause 3: CORS Blocked**

- Check browser console for CORS errors
- Solution: Verify `.env` has `VITE_API_URL=http://localhost:5000`
- Frontend port must be `5173`, `3000`, or `5174` (configured in CORS)

**Cause 4: Wrong Port**

- Check if backend is on `5000`, frontend on `5173`
- Solution: Update `.env` accordingly

---

## 📊 Backend Logs Guide

### Successful Startup

```
📡 Attempting to connect to MongoDB: mongodb://localhost:27017/smartbus
✅ MongoDB Connected: localhost
🚀 SmartBus API Server running on http://localhost:5000
```

### Database Connection Failed

```
❌ MongoDB Connection Failed: connect ECONNREFUSED 127.0.0.1:27017
⚠️  Server running WITHOUT database — API calls requiring DB will fail.
```

→ **Fix**: Start MongoDB with `mongod`

---

## 🧪 API Testing

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@gmail.com","password":"123456"}'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@gmail.com","password":"123456"}'
```

### Get Current User (Requires Auth Token)

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📝 Environment Variables

| Variable         | Value                                | Purpose               |
| ---------------- | ------------------------------------ | --------------------- |
| `MONGODB_URI`    | `mongodb://localhost:27017/smartbus` | Database connection   |
| `JWT_SECRET`     | `smartbus_jwt_secret_key_2026_india` | Token signing         |
| `JWT_EXPIRES_IN` | `7d`                                 | Token expiration      |
| `PORT`           | `5000`                               | Backend server port   |
| `VITE_API_URL`   | `http://localhost:5000`              | Frontend API base URL |

---

## 🔄 API Request Flow

1. **Frontend** (`http://localhost:5173`) makes request to:

   - `http://localhost:5000/api/auth/login`

2. **CORS Check** (server allows `localhost:5173`)

   - ✅ Request allowed

3. **Backend** (`http://localhost:5000`) receives request:

   - Validates email & password
   - Queries MongoDB for user
   - Returns JWT token

4. **Frontend** stores token and redirects to dashboard

---

## 🔧 Common Configuration Issues

### Issue: API calls fail with "Failed to fetch"

**Solution Checklist:**

- [ ] Backend running on port 5000?
- [ ] MongoDB running locally?
- [ ] `.env` has `VITE_API_URL=http://localhost:5000`?
- [ ] Frontend running on port 5173?
- [ ] No firewall blocking port 5000?
- [ ] CORS origins in `server.ts` include `http://localhost:5173`?

### Issue: "Invalid credentials" after login

**Solution:**

- Register user first: `npm run db:seed`
- Or create user via API endpoint

### Issue: JWT Token errors

**Solution:**

- Clear localStorage: `localStorage.clear()`
- Check `JWT_SECRET` in `.env` matches server

---

## 📚 Useful Commands

```bash
# Install dependencies
npm install

# Start frontend only
npm run dev

# Start backend only
npm run dev:api

# Start WebSocket server
npm run dev:ws

# Start all servers
npm run dev:all

# Seed database with test users
npm run db:seed

# Build for production
npm build

# Run linter
npm run lint
```

---

## ✨ Next Steps After Setup

1. ✅ Verify backend is running
2. ✅ Verify MongoDB is connected
3. ✅ Test login endpoint
4. ✅ Create test user
5. ✅ Try login from frontend
6. ✅ Check user dashboard

---

**Last Updated:** 2026-04-16
**Project:** SmartBus Real-Time Tracking System

# 🏗️ BrightBook Architecture - Production Deployment

## Visual Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        RENDER.COM CLOUD                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐         ┌──────────────────────┐     │
│  │  Frontend (Static)   │         │   Backend (API)      │     │
│  │                      │         │                      │     │
│  │  React + Vite        │◄───────►│  FastAPI             │     │
│  │  brightbook-frontend │   HTTP   │  brightbook-api      │     │
│  │  .onrender.com       │         │  .onrender.com       │     │
│  │                      │         │                      │     │
│  │  - User Interface    │         │  - REST API          │     │
│  │  - Routes            │         │  - Business Logic    │     │
│  │  - State Management  │         │  - Auth (JWT)        │     │
│  │  - API Client        │         │  - Assessment AI     │     │
│  └──────────────────────┘         └──────────┬───────────┘     │
│                                             │                   │
│                                             │ SQL               │
│                                             ▼                   │
│                                   ┌───────────────────┐        │
│                                   │  Persistent Disk  │        │
│                                   │                   │        │
│                                   │  SQLite Database  │        │
│                                   │  (1 GB Free)      │        │
│                                   │                   │        │
│                                   │  - Parents        │        │
│                                   │  - Children       │        │
│                                   │  - Progress       │        │
│                                   │  - Activities     │        │
│                                   └───────────────────┘        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │
                              │ git push
                              │
        ┌─────────────────────┴────────────────────┐
        │            GitHub Repository              │
        │                                          │
        │  - Source Code                           │
        │  - Configuration Files                   │
        │  - Documentation                         │
        └──────────────────────────────────────────┘

                              ▲
                              │
                              │ Developers
                              │
        ┌─────────────────────┴────────────────────┐
        │            Your Browser                  │
        │                                          │
        │  https://brightbook-frontend.onrender.com│
        └──────────────────────────────────────────┘
```

---

## 🔄 Data Flow

### User Registration Flow
```
1. User → Frontend: Sign up form
2. Frontend → Backend: POST /users/
3. Backend → Database: Create parent record
4. Backend → Frontend: Success + user data
5. Frontend → localStorage: Save token + user data
```

### Assessment Flow
```
1. Child → Frontend: Take assessment (15 questions)
2. Frontend → Backend: POST /assessments/submit
3. Backend → AI: Analyze answers
4. Backend → Database: Save results
5. Backend → Database: Generate learning plan
6. Backend → Frontend: Return level + plan
7. Frontend → Child: Show results
```

### Activity Flow
```
1. Child → Frontend: Play activity
2. Frontend → Backend: Record progress
3. Backend → Database: Save score + time
4. Backend → Database: Check achievements
5. Backend → Frontend: New badge earned?
6. Frontend → Child: Celebration! 🎉
```

---

## 🔐 Security Architecture

```
┌──────────────────────────────────────────────────┐
│             Security Layers                      │
├──────────────────────────────────────────────────┤
│                                                  │
│  1. CORS (Cross-Origin Resource Sharing)        │
│     └─ Only allows frontend domain              │
│                                                  │
│  2. JWT Authentication                          │
│     ├─ Token stored in localStorage             │
│     ├─ Sent with every API request              │
│     └─ Verified by backend middleware           │
│                                                  │
│  3. Password Hashing                            │
│     └─ bcrypt before storing in DB              │
│                                                  │
│  4. Input Validation                            │
│     ├─ Pydantic models (backend)                │
│     └─ React form validation (frontend)         │
│                                                  │
│  5. SQL Injection Protection                    │
│     └─ SQLModel/SQLAlchemy ORM                  │
│                                                  │
│  6. Environment Variables                       │
│     └─ Secrets in Render dashboard, not code    │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## 🌐 Environment Architecture

### Development Environment
```
Frontend (localhost:5173)
    ↓
Backend (localhost:8000)
    ↓
Database (./database.db)
```

### Production Environment
```
Frontend (https://*.onrender.com)
    ↓ VITE_API_URL
Backend (https://*.onrender.com)
    ↓ DATABASE_URL
Database (/opt/render/project/data/database.db)
```

---

## 📦 Service Details

### Frontend Service (Static Site)
```
Name: brightbook-frontend
Type: Static Site
Build: npm run build
Output: dist/
Deploy: Auto on git push
SSL: Automatic (HTTPS)
```

### Backend Service (Web Service)
```
Name: brightbook-api
Type: Web Service
Runtime: Python 3
Start: uvicorn backend.main:app --host 0.0.0.0 --port $PORT
Deploy: Auto on git push
SSL: Automatic (HTTPS)
```

### Database (Disk Storage)
```
Type: Persistent Disk
Mount: /opt/render/project/data
Size: 1 GB (Free tier)
File: database.db (SQLite)
```

---

## 🚀 Deployment Pipeline

```
Developer                    GitHub                    Render
────────                    ───────                    ──────

1. Make changes
   ├─ Edit code
   └─ Test locally

2. Commit changes
   ├─ git add .
   ├─ git commit -m "..."
   └─ git push origin main

                              ├─ Webhook triggered
                              │
                              ├─ Build starts
                              │  ├─ npm install
                              │  ├─ npm run build
                              │  └─ Create dist/
                              │
                              └─ Deploy complete
                                 └─ New URL live!

3. Monitor
   └─ Check Render dashboard
```

---

## 📊 Scaling Strategy

### Current (Free Tier)
```
1 Web Service (Python)
1 Static Site (Frontend)
1 Disk Storage (1 GB)
→ Handles ~100 users
```

### Growth Path
```
Level 1: $7/month
├─ Faster response times
└─ No cold starts

Level 2: $25/month
├─ PostgreSQL database
├─ Better performance
└─ Auto-scaling

Level 3: $100+/month
├─ Load balancer
├─ Multiple instances
└─ CDN integration
```

---

## 🔧 Configuration Files

### render.yaml
```yaml
services:
  - type: web          # Backend
    name: brightbook-api
    runtime: python
    ...

databases:
  - name: brightbook-db  # Optional PostgreSQL
    ...
```

### .env.production
```
VITE_API_URL=https://brightbook-api.onrender.com
```

### Backend Environment (Render Dashboard)
```
PYTHON_VERSION=3.11.0
ALLOWED_ORIGINS=https://brightbook-frontend.onrender.com
```

---

## 📈 Monitoring & Logging

### Render Dashboard
- **Real-time logs**: View stdout/stderr
- **Metrics**: CPU, memory, response time
- **Deployments**: History of deployments
- **Alerts**: Email notifications for issues

### Log Locations
```
Backend Logs:
Render Dashboard → brightbook-api → Logs

Frontend Logs:
Browser Console (F12)

Database Logs:
Same as backend logs (SQLite)
```

---

## 🎯 Key Technologies

### Frontend Stack
- **React 19.2.0** - UI framework
- **Vite 7.2.4** - Build tool
- **React Router** - Navigation
- **Lucide React** - Icons
- **Recharts** - Charts
- **Canvas-confetti** - Celebrations

### Backend Stack
- **FastAPI** - API framework
- **SQLModel** - ORM + Pydantic
- **SQLite** - Database
- **Uvicorn** - ASGI server
- **bcrypt** - Password hashing
- **JWT** - Authentication

### Infrastructure
- **Render** - Hosting platform
- **GitHub** - Code repository
- **SSL/TLS** - Automatic HTTPS

---

## 🔄 Auto-Deployment Flow

```
Git Push (GitHub)
    ↓
Render Webhook Triggered
    ↓
Build Phase
    ├─ Frontend: npm run build
    └─ Backend: pip install -r requirements.txt
    ↓
Deploy Phase
    ├─ Stop old containers
    └─ Start new containers
    ↓
Health Check
    ├─ Check service is responding
    └─ Verify deployment success
    ↓
✅ Live!
```

---

**Understanding this architecture will help you troubleshoot issues and scale your application! 🚀**

# 🎴 BrightBook Deployment - Quick Reference Card

## 🚀 15-Minute Deployment Guide

### 1️⃣ Push to GitHub (2 min)
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2️⃣ Deploy Backend (5 min)

**Go to**: https://dashboard.render.com

**Create**: Web Service
```
Name: brightbook-api
Runtime: Python 3
Build: pip install -r requirements.txt
Start: uvicorn backend.main:app --host 0.0.0.0 --port $PORT
```

**Environment Variables**:
```
PYTHON_VERSION=3.11.0
ALLOWED_ORIGINS=https://brightbook-frontend.onrender.com
```

**⚠️ IMPORTANT**: Add Disk (Advanced → Add Disk)
```
Name: data
Mount: /opt/render/project/data
Size: 1 GB
```

**📋 Copy URL**: `https://your-api.onrender.com`

### 3️⃣ Deploy Frontend (3 min)

**Go to**: https://dashboard.render.com

**Create**: Static Site
```
Name: brightbook-frontend
Build: npm run build
Publish: dist
```

**Environment Variables**:
```
VITE_API_URL=https://your-api.onrender.com
```

**📋 Copy URL**: `https://your-frontend.onrender.com`

### 4️⃣ Update CORS (2 min)

**Go to**: Backend service → Environment

**Edit**: `ALLOWED_ORIGINS`
```
https://your-actual-frontend-url.onrender.com
```

**Save** → Wait for redeploy ✅

### 5️⃣ Test (3 min)

**Backend**: Visit `https://your-api.onrender.com/docs` ✅

**Frontend**: Visit `https://your-frontend.onrender.com` ✅

**Test Flow**:
- [ ] Sign up
- [ ] Log in
- [ ] Add child
- [ ] Take assessment
- [ ] Play game

---

## 🔧 Commands Reference

### Local Development
```bash
# Backend
cd backend
uvicorn main:app --reload

# Frontend
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Git Operations
```bash
# Push changes
git add .
git commit -m "Update"
git push origin main

# Check status
git status
git log --oneline -5
```

---

## 🐛 Troubleshooting

### "Connection Refused"
```
Fix: Check CORS settings in backend
Backend → Environment → ALLOWED_ORIGINS
Add your frontend URL
```

### "502 Bad Gateway"
```
Fix: Backend is starting up
Wait 2-3 minutes for cold start
```

### "Database Locked"
```
Fix: SQLite concurrency issue
Add persistent disk to backend
Mount path: /opt/render/project/data
```

### "CORS Error"
```
Fix: Update ALLOWED_ORIGINS
Backend → Environment
Add frontend URL (comma-separated)
```

### "404 Not Found"
```
Fix: Check API routes
Visit /docs to see available endpoints
```

---

## 📊 Service URLs

| Service | Format | Example |
|---------|--------|---------|
| Backend | `https://<name>.onrender.com` | `https://brightbook-api.onrender.com` |
| Frontend | `https://<name>.onrender.com` | `https://brightbook-frontend.onrender.com` |
| API Docs | `https://<backend>/docs` | `https://brightbook-api.onrender.com/docs` |

---

## 🔑 Environment Variables

### Frontend (.env.production)
```bash
VITE_API_URL=https://brightbook-api.onrender.com
```

### Backend (Render Dashboard)
```bash
PYTHON_VERSION=3.11.0
ALLOWED_ORIGINS=https://brightbook-frontend.onrender.com
```

---

## 📁 File Structure

```
bookv1/
├── backend/
│   ├── main.py           # Backend entry point
│   ├── database.py       # Database connection
│   ├── models.py         # Data models
│   └── routers/          # API endpoints
├── src/
│   ├── components/       # React components
│   ├── pages/           # Page components
│   └── services/api.js  # API client
├── render.yaml          # Render config
├── .env.production      # Production env vars
└── package.json         # Frontend dependencies
```

---

## 💰 Free Tier Limits

| Resource | Limit | Cost |
|----------|-------|------|
| Web Service | 750 hours/month | $0 |
| Static Site | Unlimited | $0 |
| Disk Storage | 1 GB | $0 |
| Bandwidth | 100 GB/month | $0 |
| **Total** | | **$0/month** |

---

## 🔄 Update Process

### Make Changes
```bash
1. Edit code
2. Test locally (npm run dev)
3. Commit changes (git add, commit, push)
```

### Auto-Deploy
```
Render detects git push
→ Builds new version
→ Deploys automatically
→ Zero downtime ✅
```

### Time to Deploy
```
Frontend: ~2 minutes
Backend: ~3 minutes
Total: ~5 minutes
```

---

## 📞 Support Links

- **Render Dashboard**: https://dashboard.render.com
- **Render Docs**: https://render.com/docs
- **Render Status**: https://status.render.com
- **FastAPI Docs**: https://fastapi.tiangolo.com

---

## ✅ Pre-Flight Checklist

### Before Pushing
- [ ] Code tested locally
- [ ] No console errors
- [ ] Environment variables checked
- [ ] `.gitignore` updated
- [ ] Committed all changes

### After Deployment
- [ ] Backend /docs loads
- [ ] Frontend loads
- [ ] Sign up works
- [ ] Database persists
- [ ] No CORS errors

---

## 🎯 Success Metrics

Your deployment is successful when:

✅ Backend responds to `/docs`
✅ Frontend loads without errors
✅ User can sign up
✅ User can log in
✅ Assessment works
✅ Activities are playable
✅ Progress saves
✅ No errors in browser console

---

## 📝 Notes

```
Backend URL: __________________________

Frontend URL: _________________________

Deploy Date: __________________________

Database: SQLite / PostgreSQL

Status: __ Working __ Broken
```

---

**Print this page for quick reference! 🖨️**

**Last Updated**: 2026-02-22
**Version**: 1.0.0

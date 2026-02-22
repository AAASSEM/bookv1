# 📘 BrightBook Render Deployment - Quick Reference

## 🚀 Quick Start (5-Minute Guide)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Step 2: Deploy Backend (5 minutes)

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo
4. Settings:

| Setting | Value |
|---------|-------|
| Name | `brightbook-api` |
| Runtime | `Python 3` |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn backend.main:app --host 0.0.0.0 --port $PORT` |

5. **Environment Variables:**
   - `ALLOWED_ORIGINS` = `https://brightbook-frontend.onrender.com`

6. Click **"Create Web Service"** ✅

### Step 3: Deploy Frontend (3 minutes)

1. On Render dashboard, click **"New +"** → **"Static Site"**
2. Same GitHub repo
3. Settings:

| Setting | Value |
|---------|-------|
| Name | `brightbook-frontend` |
| Build Command | `npm run build` |
| Publish Directory | `dist` |

4. **Environment Variables:**
   - `VITE_API_URL` = `<your-backend-url-from-step-2>`

5. Click **"Create Static Site"** ✅

### Step 4: Update CORS (1 minute)

1. Go to your backend service on Render
2. Click **"Environment"**
3. Edit `ALLOWED_ORIGINS`:
   ```
   https://your-actual-frontend-url.onrender.com
   ```
4. Click **"Save Changes"** ✅

## ✅ That's It!

Your app is now live! 🎉

- Frontend: `https://brightbook-frontend.onrender.com`
- Backend: `https://brightbook-api.onrender.com`
- API Docs: `https://brightbook-api.onrender.com/docs`

---

## 📚 Full Guide

See **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** for detailed instructions including:
- PostgreSQL setup
- Custom domains
- Troubleshooting
- Monitoring

---

## 🔧 What Was Prepared

### ✅ Backend Ready
- Updated CORS to use environment variables
- Render-compatible configuration
- Production-ready FastAPI setup

### ✅ Frontend Ready
- Environment variable support
- Production build configuration
- API URL configuration

### ✅ Configuration Files
- `render.yaml` - Render service definitions
- `.env.production` - Production environment variables
- `DEPLOYMENT_GUIDE.md` - Complete guide
- `quick-deploy.sh` - Deployment helper script

---

## ⚡ Common Commands

### Local Development
```bash
# Backend
cd backend
uvicorn main:app --reload

# Frontend
npm run dev
```

### Production Build (Local Test)
```bash
npm run build
npm run preview
```

### Deploy to Render
```bash
# Just push to GitHub - Render auto-deploys!
git add .
git commit -m "Update production"
git push origin main
```

---

## 🐛 Quick Fixes

### Fix CORS Errors
Add your frontend URL to backend's `ALLOWED_ORIGINS`

### Fix 502 Errors
Wait 2-3 minutes for backend to start (cold start)

### Fix Database Errors
Add a Disk to backend service:
- Mount path: `/opt/render/project/data`
- Size: 1 GB

---

## 📞 Need Help?

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **FastAPI Docs**: [fastapi.tiangolo.com](https://fastapi.tiangolo.com)
- **Vite Docs**: [vitejs.dev](https://vitejs.dev)

---

## 🎉 You're Awesome!

Thanks for deploying BrightBook! 🚀

Your app is helping children learn to read! 📚

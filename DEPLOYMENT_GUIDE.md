# 🚀 BrightBook Deployment Guide - Render

This guide will walk you through deploying BrightBook (frontend + backend) to Render.com.

## 📋 Prerequisites

Before you start, make sure you have:
- [ ] GitHub account with the BrightBook code pushed
- [ ] Render.com account (free tier works!)
- [ ] All code changes committed to git

## 🗂️ Project Structure Overview

```
bookv1/
├── backend/          # FastAPI backend
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── requirements.txt
│   └── routers/
├── src/              # React frontend
│   ├── components/
│   ├── pages/
│   └── services/
├── package.json
├── vite.config.js
├── render.yaml       # Render configuration
└── .env.production   # Production environment variables
```

## 📝 Step 1: Prepare Your Repository

### 1.1 Update Gitignore
Ensure these are in your `.gitignore`:

```gitignore
# Environment variables
.env
.env.local
.env.production

# Database
database.db
*.db

# Node modules
node_modules/

# Python
__pycache__/
*.pyc
venv/
```

### 1.2 Commit All Changes
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

## 🔧 Step 2: Deploy Backend to Render

### 2.1 Create Backend Service

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

   **Basic Settings:**
   - Name: `brightbook-api`
   - Region: Closest to your users
   - Branch: `main`

   **Build & Deploy:**
   - Runtime: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`

   **Environment Variables** (click "Advanced" to add these):
   ```
   PYTHON_VERSION=3.11.0
   ALLOWED_ORIGINS=https://brightbook-frontend.onrender.com
   ```

5. Click **"Create Web Service"**

### 2.2 Note Your Backend URL

After deployment, Render will give you a URL like:
```
https://brightbook-api.onrender.com
```

Copy this URL - you'll need it for the frontend!

## 🎨 Step 3: Deploy Frontend to Render

### 3.1 Create Frontend Service

1. Go back to Render dashboard
2. Click **"New +"** → **"Static Site"**
3. Select the same repository
4. Configure:

   **Basic Settings:**
   - Name: `brightbook-frontend`
   - Branch: `main`

   **Build Settings:**
   - Build Command: `npm run build`
   - Publish Directory: `dist`

   **Environment Variables:**
   - Add variable: `VITE_API_URL`
   - Value: Your backend URL from Step 2.2

5. Click **"Create Static Site"**

### 3.2 Update CORS Settings

After your frontend deploys, you'll get a URL like:
```
https://brightbook-frontend.onrender.com
```

Now go back to your **Backend Service** on Render:

1. Go to `brightbook-api` service
2. Click **"Environment"** tab
3. Edit `ALLOWED_ORIGINS`:
   ```
   https://brightbook-frontend.onrender.com,https://your-actual-frontend-url.onrender.com
   ```
4. Click **"Save Changes"**
5. Wait for backend to redeploy (automatic)

## 🗄️ Step 4: Database Setup

### Option 1: SQLite (Free, Simple)

The app already uses SQLite! The database file will be stored at:
```
/opt/render/project/data/database.db
```

To make this persistent, in your Backend Service:
1. Go to **"Advanced"** tab
2. Add a **Disk**:
   - Name: `data`
   - Mount Path: `/opt/render/project/data`
   - Size: 1 GB (free tier)

### Option 2: PostgreSQL (Recommended for Production)

For a production-ready database, upgrade to PostgreSQL:

1. On Render dashboard, click **"New +"** → **"PostgreSQL"**
2. Name: `brightbook-db`
3. Database: `brightbook`
4. User: `brightbook`
5. Region: Same region as backend

Then update your backend code to use PostgreSQL:

```python
# In backend/database.py, replace:
DATABASE_URL = "sqlite:///./database.db"

# With (from Render environment variable):
DATABASE_URL = os.getenv("DATABASE_URL")
```

And add this environment variable to your backend service:
```
DATABASE_URL=postgresql://...
```

(You'll get this URL from Render's database dashboard)

## ✅ Step 5: Test Your Deployment

### 5.1 Check Backend Health

Visit your backend URL + `/docs`:
```
https://brightbook-api.onrender.com/docs
```

You should see the FastAPI automatic documentation!

### 5.2 Test Frontend

Visit your frontend URL:
```
https://brightbook-frontend.onrender.com
```

Test the full flow:
1. Sign up as a new parent
2. Add a child
3. Take assessment
4. Play activities
5. View dashboard

## 🔄 Step 6: Update CORS if Needed

If you see CORS errors in the browser console:

1. Go to Backend Service on Render
2. Environment tab
3. Edit `ALLOWED_ORIGINS` to add your frontend URL
4. Save and wait for redeploy

## 📊 Step 7: Monitor Your App

### Render Dashboard Features:

- **Logs**: View real-time logs
- **Metrics**: CPU, memory usage
- **Deployments**: Track deployment history
- **Alerts**: Get notified of issues

### Free Tier Limits:

- **Web Service**: 750 hours/month (enough for 24/7)
- **Static Site**: Unlimited
- **Database**: 1 GB storage (PostgreSQL free tier)

## 🐛 Common Issues & Solutions

### Issue 1: "Connection Refused"
**Cause**: Frontend can't reach backend
**Fix**: Check CORS settings and API URL

### Issue 2: "Database Locked"
**Cause**: SQLite limitations
**Fix**: Upgrade to PostgreSQL (see Step 4)

### Issue 3: "502 Bad Gateway"
**Cause**: Backend is starting up
**Fix**: Wait 2-3 minutes for cold start

### Issue 4: "404 Not Found"
**Cause**: Incorrect API routes
**Fix**: Check backend logs for errors

## 🚀 Next Steps

After successful deployment:

1. **Set up custom domain** (optional):
   - Buy domain from Namecheap, GoDaddy, etc.
   - Add in Render dashboard

2. **Enable HTTPS**:
   - Automatic on Render (free SSL certificates!)

3. **Set up monitoring**:
   - Configure Render alerts
   - Add error tracking (Sentry)

4. **Back up database**:
   - Regular exports if using PostgreSQL
   - Render does automatic backups for paid tier

## 📞 Support

If you run into issues:
- Render docs: [render.com/docs](https://render.com/docs)
- FastAPI docs: [fastapi.tiangolo.com](https://fastapi.tiangolo.com)
- Vite docs: [vitejs.dev](https://vitejs.dev)

## 🎉 You're Live!

Your BrightBook app is now live on the internet! Share the URL with parents and start helping children learn to read!

---

**Deployment Checklist:**

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Render
- [ ] CORS configured correctly
- [ ] Database working
- [ ] Test signup/login flow
- [ ] Test assessment
- [ ] Test activities
- [ ] Check browser console for errors
- [ ] Verify emails are working (if set up)

**Estimated Cost**: $0/month (free tier)
**Time to Deploy**: 20-30 minutes
**Difficulty**: ⭐⭐ (Beginner-friendly)

Good luck! 🚀

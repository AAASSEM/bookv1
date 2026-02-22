# ✅ BrightBook Production Deployment Checklist

Use this checklist to ensure everything is ready before and after deployment.

## 📋 Pre-Deployment Checklist

### Code Preparation
- [ ] All changes committed to Git
- [ ] Git repository pushed to GitHub
- [ ] `.gitignore` properly configured (excludes `.env`, `database.db`, `node_modules`)
- [ ] No hardcoded localhost URLs in production code
- [ ] Environment variables properly configured

### Backend Readiness
- [ ] `backend/requirements.txt` includes all dependencies
- [ ] CORS settings updated to use `ALLOWED_ORIGINS` environment variable
- [ ] Database initialization code works correctly
- [ ] All API endpoints tested locally
- [ ] No debugging print statements left in code

### Frontend Readiness
- [ ] `npm run build` completes without errors
- [ ] API URL configured to use environment variable
- [ ] All routes work correctly
- [ ] No console errors in browser
- [ ] Responsive design tested on mobile

### Configuration Files
- [ ] `render.yaml` created and configured
- [ ] `.env.production` created
- [ ] `DEPLOYMENT_GUIDE.md` reviewed
- [ ] Backend start command verified

---

## 🚀 Deployment Checklist

### Backend Deployment (Render Web Service)

#### Basic Settings
- [ ] Service name: `brightbook-api`
- [ ] Runtime: Python 3
- [ ] Region selected (closest to users)
- [ ] Branch: `main` (or your production branch)

#### Build Settings
- [ ] Build Command: `pip install -r requirements.txt`
- [ ] Start Command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`

#### Environment Variables
- [ ] `PYTHON_VERSION` = `3.11.0`
- [ ] `ALLOWED_ORIGINS` = `https://brightbook-frontend.onrender.com` (will update later)

#### Disk Storage (for SQLite)
- [ ] Disk created with name: `data`
- [ ] Mount path: `/opt/render/project/data`
- [ ] Size: 1 GB (free tier)

### Frontend Deployment (Render Static Site)

#### Basic Settings
- [ ] Service name: `brightbook-frontend`
- [ ] Branch: `main`
- [ ] Build Command: `npm run build`
- [ ] Publish Directory: `dist`

#### Environment Variables
- [ ] `VITE_API_URL` = Backend URL from above step

---

## ✅ Post-Deployment Checklist

### Backend Verification
- [ ] Backend URL is accessible
- [ ] API docs page loads: `https://your-backend.onrender.com/docs`
- [ ] Health check endpoint works (if configured)
- [ ] No errors in Render logs
- [ ] Database file is created in persistent storage

### Frontend Verification
- [ ] Frontend URL is accessible
- [ ] Page loads without errors
- [ ] No CORS errors in browser console
- [ ] All assets load correctly (CSS, JS, images)

### Integration Testing
- [ ] User can sign up (creates parent account)
- [ ] User can log in
- [ ] User can add child profile
- [ ] Assessment works end-to-end
- [ ] Dashboard displays correctly
- [ ] Activities are playable
- [ ] Progress is saved
- [ ] Badges are awarded
- [ ] Notifications work

### CORS Configuration Update
- [ ] Get actual frontend URL from Render
- [ ] Update backend `ALLOWED_ORIGINS` with real frontend URL
- [ ] Backend auto-redeploys after change
- [ ] Test frontend-backend connection again

### Performance Check
- [ ] Page load time is acceptable (< 5 seconds)
- [ ] API response time is acceptable (< 2 seconds)
- [ ] No memory leaks in backend logs
- [ ] No 500 errors in logs

---

## 🔒 Security Checklist

### Authentication
- [ ] Password hashing is working (bcrypt)
- [ ] JWT tokens are properly configured
- [ ] Token expiration is set appropriately
- [ ] Auth headers are properly sent

### API Security
- [ ] CORS properly configured (not open to `*`)
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (SQLModel/SQLAlchemy handles this)
- [ ] Rate limiting considered (if needed)

### Data Protection
- [ ] No sensitive data in logs
- [ ] Environment variables not exposed
- [ ] Database is not publicly accessible
- [ ] Parent/child data is isolated by user

---

## 📊 Monitoring Setup

### Render Dashboard
- [ ] Backend service dashboard bookmarked
- [ ] Frontend service dashboard bookmarked
- [ ] Logs accessible and readable
- [ ] Metrics visible (CPU, memory)

### Alerts (Optional)
- [ ] Email alerts configured for service down
- [ ] Slack alerts configured (optional)
- [ ] Response time alerts (optional)

---

## 🔄 Backup & Recovery

### Database Backup
- [ ] Database export procedure documented
- [ ] Regular backup schedule configured (if using PostgreSQL)
- [ ] Restore procedure tested

### Code Backup
- [ ] GitHub repository is up to date
- [ ] Tag release commits for version tracking
- [ ] Environment variables documented

---

## 🎯 Go-Live Checklist

### Final Checks
- [ ] All tests pass in production environment
- [ ] Team has tested the application
- [ ] Known issues documented (if any)
- [ ] Rollback plan prepared

### Documentation
- [ ] DEPLOYMENT_GUIDE.md is complete
- [ ] README_RENDER.md is available
- [ ] Support contact information visible

### Communication
- [ ] Stakeholders notified of deployment
- [ ] URL shared with users
- [ ] Support process established

---

## 🎉 Post-Launch Monitoring

### Week 1
- [ ] Check logs daily for errors
- [ ] Monitor user feedback
- [ ] Track performance metrics
- [ ] Fix any critical bugs immediately

### Month 1
- [ ] Review user analytics
- [ ] Optimize slow queries
- [ ] Update documentation based on issues found
- [ ] Plan improvements based on feedback

---

## 🆘 Emergency Contacts

### Render Support
- Dashboard: https://dashboard.render.com
- Docs: https://render.com/docs
- Status: https://status.render.com

### Critical Issues
If the site is down:
1. Check Render status page
2. Check service logs on Render dashboard
3. Verify environment variables
4. Check recent deployments
5. Rollback if necessary

---

## 📝 Notes

```
Deployment Date: _______________
Deployed By: _______________
Backend URL: _______________
Frontend URL: _______________
Database Type: SQLite / PostgreSQL
```

---

**Last Updated**: 2026-02-22
**Version**: 1.0.0
**Status**: Ready for Production ✅

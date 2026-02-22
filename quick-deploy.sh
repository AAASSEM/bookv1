#!/bin/bash

# BrightBook Quick Deployment Script for Render
# This script helps you deploy to Render.com

echo "🚀 BrightBook Deployment Assistant"
echo "=================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized. Run: git init"
    exit 1
fi

# Check if user is logged into GitHub
echo "📋 Pre-deployment Checklist:"
echo ""

# Check for required files
if [ ! -f "render.yaml" ]; then
    echo "❌ render.yaml not found"
    exit 1
fi

if [ ! -f "backend/requirements.txt" ]; then
    echo "❌ backend/requirements.txt not found"
    exit 1
fi

if [ ! -f "package.json" ]; then
    echo "❌ package.json not found"
    exit 1
fi

echo "✅ All required files found"
echo ""

# Ask for deployment URLs
echo "📝 You'll need these URLs after deployment:"
echo ""
echo "1. Backend URL (from Render): https://your-backend.onrender.com"
echo "2. Frontend URL (from Render): https://your-frontend.onrender.com"
echo ""
echo "⚠️  IMPORTANT: After backend deploys, copy the URL and update:"
echo "   - Frontend service's VITE_API_URL environment variable"
echo "   - Backend service's ALLOWED_ORIGINS environment variable"
echo ""

read -p "Have you read the DEPLOYMENT_GUIDE.md? (y/n): " confirm

if [ "$confirm" != "y" ]; then
    echo "❌ Please read DEPLOYMENT_GUIDE.md first"
    echo "📖 Open it in: " $(pwd)
    exit 1
fi

echo ""
echo "✅ Ready to deploy!"
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Prepare for deployment'"
echo "   git push origin main"
echo ""
echo "2. Go to https://dashboard.render.com"
echo ""
echo "3. Deploy BACKEND first (Web Service):"
echo "   - Runtime: Python 3"
echo "   - Build Command: pip install -r requirements.txt"
echo "   - Start Command: uvicorn backend.main:app --host 0.0.0.0 --port \$PORT"
echo "   - Environment: ALLOWED_ORIGINS=https://brightbook-frontend.onrender.com"
echo ""
echo "4. Deploy FRONTEND second (Static Site):"
echo "   - Build Command: npm run build"
echo "   - Publish Directory: dist"
echo "   - Environment: VITE_API_URL=<your-backend-url>"
echo ""
echo "5. Update CORS in backend with your frontend URL"
echo ""
echo "📖 Full instructions in: DEPLOYMENT_GUIDE.md"
echo ""
echo "🎉 Good luck with your deployment!"

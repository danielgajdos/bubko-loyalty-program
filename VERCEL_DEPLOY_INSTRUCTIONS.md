# Deploy Frontend to Vercel - Manual Steps

## Backend is Ready! ✅
Your backend is deployed and running at:
**https://backend-production-accd.up.railway.app**

Test it: https://backend-production-accd.up.railway.app/api/health

## Now Deploy Frontend (5 minutes)

### Option 1: Vercel Web Dashboard (Easiest)

1. Go to: https://vercel.com/new

2. Click "Import Project"

3. Select "Import Git Repository"

4. Enter your repo URL: `https://github.com/danielgajdos/bubko-loyalty-program`

5. Click "Import"

6. Configure:
   - **Project Name**: `kebab-loyalty-frontend`
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

7. Add Environment Variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://backend-production-accd.up.railway.app`

8. Select Branch: `kebabnakyjevskom`

9. Click "Deploy"

10. Wait 2-3 minutes for build

11. Once deployed, you'll get a URL like: `https://kebab-loyalty-frontend-xxx.vercel.app`

### Option 2: Set Custom Domain (Optional)

After deployment:
1. Go to Project Settings → Domains
2. Add domain: `kebabnakyjevskom.vercel.app`
3. Vercel will configure it automatically

## Update Backend CORS

Once you have your Vercel URL, update the backend CORS:

1. Go to Railway dashboard
2. Select your `backend` service
3. Go to Variables
4. Add variable:
   - **Name**: `FRONTEND_URL`
   - **Value**: `https://your-vercel-url.vercel.app`

Or manually edit `backend/server.js` and add your Vercel domain to the CORS whitelist.

## Test Everything

1. Visit your Vercel URL
2. Register a new user
3. Login as admin (username: `admin`, password: `admin123`)
4. Go to "Scan & Add Products"
5. Test the flow!

## Current Status

✅ Railway MySQL Database - Running
✅ Database Schema - Initialized
✅ Railway Backend - Deployed at https://backend-production-accd.up.railway.app
⏳ Vercel Frontend - Ready to deploy (follow steps above)

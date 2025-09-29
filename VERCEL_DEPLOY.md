# 🚀 Deploy Bubko to Vercel - Step by Step

## ✅ Repository Ready!
Your code is now available at: **https://github.com/danielgajdos/bubko-loyalty-program**

## 🎯 Deploy Frontend to Vercel (FREE)

### Step 1: Go to Vercel
1. Visit [vercel.com](https://vercel.com)
2. Sign up/Login with your GitHub account

### Step 2: Import Project
1. Click "New Project"
2. Import `danielgajdos/bubko-loyalty-program`
3. Vercel will auto-detect it as a Vite project

### Step 3: Configure Build Settings
Vercel should automatically detect:
- **Framework Preset**: Vite
- **Root Directory**: `./` (leave as default)
- **Build Command**: `cd frontend && npm run build`
- **Output Directory**: `frontend/dist`

### Step 4: Deploy
1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. Your frontend will be live at `https://your-app-name.vercel.app`

## 🛰️ Backend Options

### Option A: Railway (Recommended - $5/month free credit)
1. Go to [railway.app](https://railway.app)
2. Connect GitHub account
3. Deploy from `bubko-loyalty-program` repo
4. Add MySQL database service
5. Set environment variables

### Option B: Render (Free tier)
1. Go to [render.com](https://render.com)
2. Connect GitHub account
3. Create new Web Service
4. Connect to your repo, select `backend` folder
5. Add PostgreSQL database (free)

## 🔧 Environment Variables

### For Backend (Railway/Render):
```
DB_HOST=<your-db-host>
DB_USER=<your-db-user>
DB_PASSWORD=<your-db-password>
DB_NAME=bubko_loyalty
JWT_SECRET=bubko_secret_key_2024_production
PORT=3001
```

### For Frontend (Vercel):
```
VITE_API_URL=https://your-backend-url.railway.app/api
```

## 🎨 What You'll Get

✅ **Frontend**: Beautiful space-themed loyalty program
✅ **Mobile Responsive**: Works on all devices
✅ **QR Code System**: Automatic generation and scanning
✅ **Admin Portal**: Staff can manage visits
✅ **Real-time Updates**: Instant loyalty tracking

## 🌟 Features Live:
- 🚀 User registration with space theme
- 👨‍🚀 Personal astronaut profiles
- 🛸 Unique QR codes for each user
- 🎁 Automatic free visit tracking (5+1 system)
- 📊 Admin dashboard with statistics
- 📱 QR scanner for staff

## 💡 Next Steps After Deployment

1. **Test the system**: Register a test user
2. **Admin access**: Use `admin/admin123` to test scanning
3. **Custom domain**: Add your own domain in Vercel
4. **Analytics**: Add Google Analytics if needed
5. **Backup**: Set up database backups

## 🎯 Expected Timeline
- **Vercel Frontend**: 3-5 minutes
- **Railway Backend**: 5-10 minutes
- **Total Setup**: 15 minutes

## 🆘 Need Help?
If you encounter any issues:
1. Check the build logs in Vercel/Railway
2. Verify environment variables are set correctly
3. Ensure database connection is working
4. Test API endpoints manually

Your space-themed Bubko loyalty program will be live and ready for astronauts! 🌟
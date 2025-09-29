# 🚀 Deployment Guide - Bubko Loyalty Program

## Recommended Free Hosting Setup

### Option 1: Vercel + Railway (Recommended)
- **Frontend**: Vercel (Free)
- **Backend + Database**: Railway ($5/month credit - free for small usage)
- **Total Cost**: $0-5/month

### Option 2: Netlify + Render + PlanetScale
- **Frontend**: Netlify (Free)
- **Backend**: Render (Free tier with limitations)
- **Database**: PlanetScale (Free tier)
- **Total Cost**: $0/month

## 🎯 Step-by-Step Deployment

### 1. Frontend Deployment (Vercel)

1. Push code to GitHub repository
2. Connect Vercel to your GitHub account
3. Import the `bubko-loyalty` repository
4. Set build settings:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 2. Backend Deployment (Railway)

1. Create Railway account
2. Connect GitHub repository
3. Deploy from `backend` folder
4. Set environment variables:
   ```
   DB_HOST=<railway-mysql-host>
   DB_USER=<railway-mysql-user>
   DB_PASSWORD=<railway-mysql-password>
   DB_NAME=bubko_loyalty
   JWT_SECRET=your-secret-key
   PORT=3001
   ```

### 3. Database Setup (Railway MySQL)

Railway automatically provides MySQL. Run this SQL to set up tables:

```sql
-- Copy content from database/schema.sql
```

## 🔧 Configuration Files

### Frontend Environment
Create `.env.production` in frontend folder:
```
VITE_API_URL=https://your-railway-app.railway.app
```

### Backend CORS Update
Update backend to allow frontend domain:
```javascript
app.use(cors({
  origin: ['https://your-vercel-app.vercel.app', 'http://localhost:3000']
}));
```

## 🌐 Alternative Setups

### Budget Option: All-in-One
- **Render**: Host both frontend and backend
- **Supabase**: PostgreSQL database
- **Cost**: Free (with limitations)

### Premium Option: Better Performance
- **Vercel**: Frontend
- **Railway**: Backend + Database
- **Cost**: ~$5-10/month

## 📱 Mobile-First Considerations

The app is already mobile-responsive, but for better mobile experience:
- Enable PWA features
- Add offline support
- Implement push notifications

## 🔒 Security for Production

1. **Environment Variables**: Never commit secrets
2. **HTTPS**: All platforms provide SSL certificates
3. **CORS**: Configure properly for your domains
4. **Rate Limiting**: Add to prevent abuse
5. **Input Validation**: Already implemented

## 📊 Monitoring & Analytics

Free options:
- **Vercel Analytics**: Frontend performance
- **Railway Metrics**: Backend monitoring
- **Google Analytics**: User tracking

## 🚀 Quick Deploy Commands

```bash
# Frontend (after connecting to Vercel)
cd frontend
npm run build

# Backend (after connecting to Railway)
cd backend
npm start
```

## 💡 Pro Tips

1. **Use Railway for MVP**: Best balance of features and cost
2. **Start with free tiers**: Upgrade when you have users
3. **Monitor usage**: Stay within free limits
4. **Backup database**: Export data regularly
5. **Custom domain**: Makes it look professional

## 🎯 Expected Costs

- **0-100 users**: Free
- **100-1000 users**: $5-15/month
- **1000+ users**: $20-50/month

The space-themed design will look amazing on any of these platforms! 🌟
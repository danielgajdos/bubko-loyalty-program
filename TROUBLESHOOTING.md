# Troubleshooting Guide

## 🔴 Backend Login Fails / 404 Error

### Symptoms
- Cannot login to admin panel
- API returns 404 error
- Backend health check fails

### Possible Causes & Solutions

#### 1. Railway Deployment Issue

**Check Railway Status:**
```bash
# If you have Railway CLI
railway status
railway logs
```

**Or check Railway Dashboard:**
1. Go to https://railway.app
2. Open your bubko-loyalty project
3. Check deployment status
4. Look for error messages in logs

**Common Issues:**
- Build failed - Check logs for npm install errors
- Database connection failed - Verify MySQL service is running
- Port binding issue - Railway should auto-assign port

**Fix:**
- Redeploy from Railway dashboard
- Check environment variables are set
- Verify MySQL service is linked

#### 2. Database Connection Issue

**Symptoms:**
- Backend starts but crashes
- Logs show "ECONNREFUSED" or "Access denied"

**Check:**
```bash
railway logs | grep -i error
railway logs | grep -i mysql
```

**Fix:**
- Verify MySQL service is running in Railway
- Check database credentials in Railway variables
- Ensure database is accessible from backend service

#### 3. Missing Environment Variables

**Required Variables:**
- `DB_HOST` - MySQL host
- `DB_USER` - MySQL user
- `DB_PASSWORD` - MySQL password
- `DB_NAME` - Database name
- `JWT_SECRET` - JWT secret key
- `PORT` - Port (Railway auto-assigns)

**Check in Railway:**
1. Go to backend service
2. Click "Variables" tab
3. Verify all required variables exist

#### 4. Build Configuration Issue

**Check Files:**
- `railway.json` - Deployment config
- `nixpacks.toml` - Build config
- `backend/package.json` - Dependencies

**Verify:**
```bash
# Test locally
cd backend
npm install
npm start
```

If local works but Railway doesn't, it's a deployment config issue.

## 🟡 Login Works But Features Don't Work

### Product Type Selector Missing

**Cause:** Database not migrated

**Fix:**
```bash
cd bubko-loyalty/backend
railway login
railway run node migrate.js
```

### QR Scanning Fails

**Check:**
1. Camera permissions in browser
2. HTTPS connection (required for camera)
3. QR code format is correct

### Profile Shows Wrong Data

**Cause:** Database migration incomplete

**Fix:** Run migration script on production database

## 🟢 Everything Works Locally But Not in Production

### Checklist:
- [ ] Railway backend service is running
- [ ] Railway MySQL service is running
- [ ] Environment variables are set
- [ ] Database migration has been run
- [ ] Frontend is deployed to Vercel
- [ ] Frontend API URL points to Railway backend

### Test Each Component:

**1. Test Backend Health:**
```bash
curl https://perceptive-radiance-production.up.railway.app/api/health
```
Expected: `{"status":"OK",...}`

**2. Test Admin Login:**
```bash
curl -X POST https://perceptive-radiance-production.up.railway.app/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```
Expected: `{"message":"Admin login successful","token":"..."}`

**3. Test Database Connection:**
```bash
railway logs | grep "Connected to MySQL"
```

## 🔧 Quick Fixes

### Force Redeploy on Railway
1. Go to Railway dashboard
2. Click on backend service
3. Click "Deployments" tab
4. Click "Redeploy" on latest deployment

### Clear Railway Cache
1. Go to Railway dashboard
2. Click on backend service
3. Settings → Delete service
4. Reconnect from GitHub (Railway will auto-detect)

### Reset Database (CAUTION: Deletes all data)
```bash
railway connect
# Then in MySQL console:
DROP DATABASE railway;
CREATE DATABASE railway;
# Then run schema.sql
```

## 📞 Getting Help

### Check Logs
```bash
# Railway backend logs
railway logs

# Railway MySQL logs
railway logs --service mysql

# Vercel frontend logs
# Check Vercel dashboard
```

### Common Error Messages

**"Application not found"**
- Railway is still deploying
- Wait 1-2 minutes and try again
- Check Railway dashboard for deployment status

**"ECONNREFUSED"**
- Database not accessible
- Check MySQL service is running
- Verify database credentials

**"Invalid QR code"**
- QR code not in database
- User not registered
- Database migration needed

**"Unauthorized"**
- Token expired or invalid
- Login again
- Check JWT_SECRET is set

## ✅ Verification Steps

After fixing issues:

1. **Backend Health Check**
   ```bash
   curl https://perceptive-radiance-production.up.railway.app/api/health
   ```

2. **Admin Login Test**
   - Go to `/admin`
   - Login with admin/admin123
   - Should redirect to dashboard

3. **Scanner Test**
   - Go to `/admin/scanner`
   - Should see product type selector
   - Test with a QR code

4. **User Profile Test**
   - Register/login as user
   - Go to `/profile`
   - Should see separate stats for each product type

## 🚨 Emergency Rollback

If everything is broken:

1. **Rollback Backend**
   - Railway dashboard → Deployments
   - Click on previous working deployment
   - Click "Redeploy"

2. **Rollback Frontend**
   - Vercel dashboard → Deployments
   - Click on previous working deployment
   - Click "Promote to Production"

3. **Rollback Database**
   - Database changes are additive
   - Old code will still work with new schema
   - No rollback needed unless data corruption

---

**Last Updated:** November 22, 2025

**Current Status:**
- Local: ✅ Working
- Railway Backend: ⏳ Deploying
- Vercel Frontend: ✅ Deployed
- Database Migration: ⏳ Pending
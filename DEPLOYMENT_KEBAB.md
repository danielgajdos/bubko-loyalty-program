# Kebab na Kyjevskom - Deployment Guide

## Overview
This guide covers deploying the Kebab loyalty system with separate services on Railway and Vercel.

## Prerequisites
- Railway account (same account as Bubko)
- Vercel account
- Git repository with kebabnakyjevskom branch

## Step 1: Railway MySQL Database

1. Go to Railway dashboard
2. Create new MySQL service
3. Name it: `kebab-mysql`
4. Note the connection details:
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`

## Step 2: Initialize Database

Connect to your Railway MySQL and run:

```bash
mysql -h [MYSQLHOST] -P [MYSQLPORT] -u [MYSQLUSER] -p[MYSQLPASSWORD] < database/schema_kebab.sql
```

Or use Railway's MySQL client in the dashboard.

## Step 3: Railway Backend Service

1. Create new service in Railway
2. Connect to your GitHub repository
3. Select branch: `kebabnakyjevskom`
4. Set root directory: `backend`
5. Add environment variables:
   ```
   DB_HOST=[from MySQL service]
   DB_PORT=[from MySQL service]
   DB_USER=[from MySQL service]
   DB_PASSWORD=[from MySQL service]
   DB_NAME=[from MySQL service]
   JWT_SECRET=[generate random string]
   PORT=3001
   ```
6. Deploy!

## Step 4: Vercel Frontend

1. Go to Vercel dashboard
2. Import project from Git
3. Select branch: `kebabnakyjevskom`
4. Set root directory: `frontend`
5. Set build command: `npm run build`
6. Set output directory: `dist`
7. Add environment variable:
   ```
   VITE_API_URL=https://[your-railway-backend].up.railway.app
   ```
8. Set domain: `kebabnakyjevskom.vercel.app`
9. Deploy!

## Step 5: Update Backend CORS

Update `backend/server.js` CORS settings to include your Vercel domain:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://kebabnakyjevskom.vercel.app',
    /.*\.vercel\.app$/
  ],
  credentials: true
}));
```

Redeploy backend after this change.

## Step 6: Test

1. Visit https://kebabnakyjevskom.vercel.app
2. Register a test user
3. Login as admin (username: admin, password: admin123)
4. Test scanning and adding products

## Default Admin Credentials
- Username: `admin`
- Password: `admin123`
- Email: `admin@kebab-bb.sk`

**IMPORTANT:** Change the admin password immediately after first login!

## Monitoring

- Railway: Check logs in Railway dashboard
- Vercel: Check deployment logs and analytics
- Both services should show healthy status

## Troubleshooting

### Database Connection Issues
- Verify environment variables match MySQL service
- Check Railway MySQL service is running
- Ensure database schema is initialized

### CORS Errors
- Verify Vercel domain is in backend CORS whitelist
- Check VITE_API_URL is correct in Vercel env vars

### QR Code Scanning Issues
- Ensure HTTPS is enabled (required for camera access)
- Test with manual QR code entry first

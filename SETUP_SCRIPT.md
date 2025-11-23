# Automated Setup Script for Kebab na Kyjevskom

## Prerequisites
You need:
1. Railway account (logged in via CLI)
2. Vercel account (logged in via CLI)
3. GitHub repository pushed

## Install CLIs

```bash
# Install Railway CLI
npm install -g @railway/cli

# Install Vercel CLI
npm install -g vercel

# Login to Railway
railway login

# Login to Vercel
vercel login
```

## Step 1: Create Railway MySQL Database

```bash
# Create new project
railway init

# Add MySQL service
railway add --service mysql

# Get MySQL credentials
railway variables

# Note down these values:
# MYSQLHOST
# MYSQLPORT
# MYSQLUSER
# MYSQLPASSWORD
# MYSQLDATABASE
```

## Step 2: Initialize Database

```bash
# Connect to Railway MySQL
railway connect mysql

# Then paste the contents of database/schema_kebab.sql
# Or use this command:
mysql -h [MYSQLHOST] -P [MYSQLPORT] -u [MYSQLUSER] -p[MYSQLPASSWORD] [MYSQLDATABASE] < database/schema_kebab.sql
```

## Step 3: Deploy Backend to Railway

```bash
cd backend

# Link to Railway project
railway link

# Set environment variables
railway variables set DB_HOST=[your-mysql-host]
railway variables set DB_PORT=3306
railway variables set DB_USER=[your-mysql-user]
railway variables set DB_PASSWORD=[your-mysql-password]
railway variables set DB_NAME=[your-mysql-database]
railway variables set JWT_SECRET=$(openssl rand -base64 32)
railway variables set PORT=3001

# Deploy
railway up

# Get the public URL
railway domain
```

## Step 4: Deploy Frontend to Vercel

```bash
cd ../frontend

# Deploy to Vercel
vercel --prod

# When prompted:
# - Set up and deploy: Yes
# - Which scope: Your account
# - Link to existing project: No
# - Project name: kebab-loyalty-frontend
# - Directory: ./
# - Override settings: No

# Set environment variable
vercel env add VITE_API_URL production

# Enter your Railway backend URL when prompted
# Example: https://kebab-backend-production.up.railway.app

# Redeploy with env var
vercel --prod

# Set custom domain
vercel domains add kebabnakyjevskom.vercel.app
```

## Step 5: Update Backend CORS

Edit `backend/server.js` and add your Vercel domain to CORS:

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

Then redeploy backend:
```bash
cd backend
railway up
```

## Step 6: Test

Visit: https://kebabnakyjevskom.vercel.app

## Quick Commands Reference

```bash
# Railway
railway logs                    # View logs
railway status                  # Check status
railway variables               # List env vars
railway open                    # Open in browser

# Vercel
vercel logs                     # View logs
vercel ls                       # List deployments
vercel domains ls               # List domains
vercel env ls                   # List env vars
```

## Troubleshooting

### Railway backend not starting
```bash
railway logs
# Check for missing env vars or connection issues
```

### Vercel build failing
```bash
vercel logs
# Check build command and output directory
```

### Database connection failed
```bash
# Verify env vars match MySQL service
railway variables
```

### CORS errors
```bash
# Make sure Vercel domain is in backend CORS list
# Redeploy backend after changes
```

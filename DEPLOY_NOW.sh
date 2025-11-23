#!/bin/bash

# Kebab na Kyjevskom - Automated Deployment Script
# This script will deploy the entire application to Railway and Vercel

set -e  # Exit on error

echo "🥙 Kebab na Kyjevskom - Deployment Script"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're on the right branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "kebabnakyjevskom" ]; then
    echo -e "${RED}Error: You must be on the 'kebabnakyjevskom' branch${NC}"
    echo "Run: git checkout kebabnakyjevskom"
    exit 1
fi

echo -e "${GREEN}✓ On correct branch: kebabnakyjevskom${NC}"
echo ""

# Step 1: Create Railway Project
echo "Step 1: Creating Railway Project..."
echo "-----------------------------------"
echo "Creating new Railway project: kebab-loyalty"

# Note: Railway CLI doesn't support fully automated project creation
# We'll need to do this interactively or via Railway dashboard

echo -e "${YELLOW}Please create a new Railway project manually:${NC}"
echo "1. Go to https://railway.app/new"
echo "2. Click 'Deploy from GitHub repo'"
echo "3. Select your repository"
echo "4. Select branch: kebabnakyjevskom"
echo "5. Name it: kebab-loyalty"
echo ""
read -p "Press Enter when you've created the project..."

# Step 2: Add MySQL Service
echo ""
echo "Step 2: Adding MySQL Service..."
echo "--------------------------------"
echo -e "${YELLOW}In your Railway project:${NC}"
echo "1. Click '+ New'"
echo "2. Select 'Database' → 'Add MySQL'"
echo "3. Wait for it to deploy"
echo ""
read -p "Press Enter when MySQL is ready..."

# Step 3: Get MySQL credentials
echo ""
echo "Step 3: Getting MySQL Credentials..."
echo "-------------------------------------"
echo -e "${YELLOW}Copy these values from Railway MySQL service Variables tab:${NC}"
echo ""
read -p "MYSQLHOST: " MYSQL_HOST
read -p "MYSQLPORT: " MYSQL_PORT
read -p "MYSQLUSER: " MYSQL_USER
read -sp "MYSQLPASSWORD: " MYSQL_PASSWORD
echo ""
read -p "MYSQLDATABASE: " MYSQL_DATABASE

# Step 4: Initialize Database
echo ""
echo "Step 4: Initializing Database..."
echo "---------------------------------"
echo "Connecting to MySQL and running schema..."

mysql -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" < database/schema_kebab.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database initialized successfully${NC}"
else
    echo -e "${RED}✗ Database initialization failed${NC}"
    echo "You can initialize it manually later using:"
    echo "mysql -h $MYSQL_HOST -P $MYSQL_PORT -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE < database/schema_kebab.sql"
fi

# Step 5: Set Backend Environment Variables
echo ""
echo "Step 5: Setting Backend Environment Variables..."
echo "-------------------------------------------------"

# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 32)

echo "Setting environment variables in Railway..."
echo ""
echo -e "${YELLOW}In Railway, go to your backend service and add these variables:${NC}"
echo ""
echo "DB_HOST=$MYSQL_HOST"
echo "DB_PORT=$MYSQL_PORT"
echo "DB_USER=$MYSQL_USER"
echo "DB_PASSWORD=$MYSQL_PASSWORD"
echo "DB_NAME=$MYSQL_DATABASE"
echo "JWT_SECRET=$JWT_SECRET"
echo "PORT=3001"
echo ""
read -p "Press Enter when you've added the variables..."

# Step 6: Deploy Backend
echo ""
echo "Step 6: Deploying Backend..."
echo "----------------------------"
echo "Railway should auto-deploy from GitHub"
echo "Wait for deployment to complete..."
echo ""
read -p "Enter your Railway backend URL (e.g., https://xxx.up.railway.app): " BACKEND_URL

# Step 7: Deploy Frontend to Vercel
echo ""
echo "Step 7: Deploying Frontend to Vercel..."
echo "----------------------------------------"

cd frontend

# Create vercel.json if it doesn't exist
cat > vercel.json <<EOF
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "VITE_API_URL": "$BACKEND_URL"
  }
}
EOF

echo "Deploying to Vercel..."
vercel --prod --yes

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend deployed successfully${NC}"
else
    echo -e "${RED}✗ Frontend deployment failed${NC}"
    exit 1
fi

# Get Vercel URL
VERCEL_URL=$(vercel ls --prod | grep kebab | awk '{print $2}' | head -1)
echo ""
echo -e "${GREEN}Frontend deployed to: $VERCEL_URL${NC}"

cd ..

# Step 8: Update Backend CORS
echo ""
echo "Step 8: Updating Backend CORS..."
echo "---------------------------------"
echo -e "${YELLOW}Add this to your backend CORS configuration:${NC}"
echo "'https://$VERCEL_URL'"
echo ""
echo "Then redeploy your backend in Railway"
echo ""
read -p "Press Enter when done..."

# Step 9: Test
echo ""
echo "Step 9: Testing Deployment..."
echo "------------------------------"
echo "Opening frontend in browser..."
open "https://$VERCEL_URL" || xdg-open "https://$VERCEL_URL" || echo "Please open: https://$VERCEL_URL"

echo ""
echo -e "${GREEN}=========================================="
echo "🎉 Deployment Complete!"
echo "==========================================${NC}"
echo ""
echo "Frontend: https://$VERCEL_URL"
echo "Backend: $BACKEND_URL"
echo ""
echo "Default Admin Credentials:"
echo "  Username: admin"
echo "  Password: admin123"
echo ""
echo -e "${RED}⚠️  IMPORTANT: Change the admin password immediately!${NC}"
echo ""
echo "Next steps:"
echo "1. Test user registration"
echo "2. Test QR scanning"
echo "3. Add real products from menu"
echo "4. Change admin password"
echo "5. Train staff"
echo ""
echo "For troubleshooting, see TROUBLESHOOTING.md"

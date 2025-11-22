#!/bin/bash

# Production Database Migration Script for Railway
# This script runs the migration on Railway's production database

echo "🚂 Railway Production Database Migration"
echo "=========================================="
echo ""

# Check if Railway CLI is available
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Please install it first:"
    echo "   npm install -g @railway/cli"
    echo ""
    exit 1
fi

# Check if logged in to Railway
if ! railway whoami &> /dev/null; then
    echo "🔐 Please login to Railway first:"
    echo "   railway login"
    echo ""
    exit 1
fi

echo "✅ Railway CLI is ready"
echo ""

# Link to project if not already linked
if [ ! -f ".railway" ]; then
    echo "🔗 Linking to Railway project..."
    railway link
    echo ""
fi

echo "🚀 Running migration on production database..."
echo ""

# Run the migration using Railway's environment
railway run node migrate.js

echo ""
echo "✅ Migration complete!"
echo ""
echo "Next steps:"
echo "1. Check Railway logs: railway logs"
echo "2. Test the API: curl https://perceptive-radiance-production.up.railway.app/api/health"
echo "3. Test scanning with product types in the admin panel"

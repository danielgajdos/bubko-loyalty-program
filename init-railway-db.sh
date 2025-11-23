#!/bin/bash

# One-time Railway Database Initialization Script
# This script initializes the Railway MySQL database from your local machine

echo "🚀 Railway Database Initialization"
echo "===================================="
echo ""

# Get MySQL public URL from Railway
echo "📡 Getting Railway MySQL credentials..."
cd backend
MYSQL_URL=$(railway service MySQL && railway variables 2>&1 | grep "MYSQL_PUBLIC_URL" -A 3 | grep -o "mysql://[^│]*" | tr -d ' ' | head -1)

if [ -z "$MYSQL_URL" ]; then
    echo "❌ Could not get MySQL URL from Railway"
    echo "Please run: railway login"
    exit 1
fi

echo "✅ Got MySQL URL"
echo ""

# Parse the URL
# Format: mysql://user:password@host:port/database
HOST=$(echo $MYSQL_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
PORT=$(echo $MYSQL_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
USER=$(echo $MYSQL_URL | sed -n 's/mysql:\/\/\([^:]*\):.*/\1/p')
PASS=$(echo $MYSQL_URL | sed -n 's/mysql:\/\/[^:]*:\([^@]*\)@.*/\1/p')
DB=$(echo $MYSQL_URL | sed -n 's/.*\/\([^\/]*\)$/\1/p')

echo "📊 Connection Details:"
echo "   Host: $HOST"
echo "   Port: $PORT"
echo "   Database: $DB"
echo ""

# Run initialization
echo "🔧 Running database initialization..."
echo ""

DB_HOST="$HOST" DB_PORT="$PORT" DB_USER="$USER" DB_PASSWORD="$PASS" DB_NAME="$DB" node init-db.js

echo ""
echo "✅ Done!"

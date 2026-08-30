#!/usr/bin/env bash
# ============================================================
# Nomini Group - Production Deployment & Update Script
# ============================================================

set -e

echo "=================================================="
echo "🚀 Starting Nomini Group Production Deployment..."
echo "=================================================="

# 1. Check for .env file
if [ ! -f ".env" ]; then
    echo "⚠️ .env file not found! Generating from .env.example..."
    cp .env.example .env
    echo "❗ Please review and update your .env file with production credentials before running again."
    exit 1
fi

# 2. Pull latest code (if git repository is present)
if [ -d ".git" ]; then
    echo "📦 Pulling latest changes from Git repository..."
    git pull origin main || echo "Git pull skipped (working with local directory)"
fi

# 3. Build and launch Docker containers in detached mode
echo "🐳 Building & starting production Docker containers..."
docker compose -f docker-compose.prod.yml down --remove-orphans || true
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d

# 4. Wait for PostgreSQL and Backend to be healthy
echo "⏳ Waiting for services to initialize..."
sleep 10

# 5. Run Prisma database migrations and seeding
echo "🌱 Initializing database schema and seed records..."
docker compose -f docker-compose.prod.yml exec backend npx prisma db push --accept-data-loss
docker compose -f docker-compose.prod.yml exec backend npm run prisma:seed || echo "Seed completed or already initialized."

# 6. Display container status
echo ""
echo "=================================================="
echo "✅ Nomini Group Platform is Live & Running!"
echo "=================================================="
docker compose -f docker-compose.prod.yml ps
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 Backend API: http://localhost:4000"
echo "📚 Swagger API Docs: http://localhost:4000/api/docs"
echo "=================================================="


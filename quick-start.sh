#!/bin/bash

# Stock Harmony - Quick Start Script
# This script sets up both backend and frontend

echo "========================================="
echo "Stock Harmony - Quick Start Setup"
echo "========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node -v)"
echo ""

# Setup Backend
echo "========================================="
echo "Setting up Backend..."
echo "========================================="
cd backend

if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
else
    echo "✅ Backend dependencies already installed"
fi

if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "ℹ️  Edit backend/.env to configure MongoDB URI if needed"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "✅ Backend setup complete!"
echo ""

# Setup Frontend
echo "========================================="
echo "Setting up Frontend..."
echo "========================================="
cd ..

if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
else
    echo "✅ Frontend dependencies already installed"
fi

if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file from template..."
    cp .env.example .env.local
    echo "ℹ️  Edit .env.local to configure API URL if needed"
else
    echo "✅ .env.local file already exists"
fi

echo ""
echo "========================================="
echo "✅ Setup Complete!"
echo "========================================="
echo ""
echo "To start the application:"
echo ""
echo "1. Terminal 1 - Start Backend:"
echo "   cd backend && npm run dev"
echo ""
echo "2. Terminal 2 - Start Frontend:"
echo "   npm run dev"
echo ""
echo "Then:"
echo "- Backend will run on: http://localhost:5000"
echo "- Frontend will run on: http://localhost:5173"
echo ""
echo "To seed initial data (backend only):"
echo "   cd backend && npm run seed"
echo ""
echo "========================================="

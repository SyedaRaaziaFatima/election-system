#!/bin/bash

# VoteSecure Installation & Setup Script
# This script automates the initial setup of the VoteSecure project

echo "========================================="
echo "VoteSecure - Installation Script"
echo "========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js 16+ from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ npm install failed"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << 'EOF'
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_NAME=VoteSecure
EOF
    echo "⚠️  Please update .env.local with your Supabase credentials"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "========================================="
echo "✅ Setup Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Update .env.local with your Supabase credentials"
echo "2. Run Supabase schema: supabase-schema.sql"
echo "3. Start dev server: npm run dev"
echo ""
echo "For detailed setup instructions, see SETUP_GUIDE.md"
echo ""

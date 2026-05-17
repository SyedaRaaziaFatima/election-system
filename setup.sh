#!/usr/bin/env bash

# ============================================
# VoteSecure - Complete Setup Script
# ============================================
# This script sets up VoteSecure for development

set -e # Exit on error

echo "=========================================="
echo "🚀 VoteSecure - Setup Script"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check Node.js
echo -e "${BLUE}📋 Checking prerequisites...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Install from: https://nodejs.org"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node --version)${NC}"
echo -e "${GREEN}✅ npm $(npm --version)${NC}"
echo ""

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Check for .env.local
echo -e "${BLUE}🔐 Checking environment variables...${NC}"
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚠️  .env.local not found${NC}"
    echo "Your Supabase credentials should be in .env.local"
else
    echo -e "${GREEN}✅ .env.local exists${NC}"
fi
echo ""

# Summary
echo -e "${BLUE}=========================================${NC}"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Verify .env.local has your Supabase credentials"
echo "2. Run: ${GREEN}npm run dev${NC}"
echo "3. Open: ${GREEN}http://localhost:3000${NC}"
echo ""
echo -e "${YELLOW}Documentation:${NC}"
echo "- Quick Start: ${GREEN}QUICK_START.md${NC}"
echo "- Setup Guide: ${GREEN}SETUP_GUIDE.md${NC}"
echo "- API Docs: ${GREEN}API_DOCUMENTATION.md${NC}"
echo "- Deploy: ${GREEN}DEPLOYMENT_GUIDE.md${NC}"
echo ""
echo -e "${YELLOW}Important Files:${NC}"
echo "- Database Schema: ${GREEN}supabase-schema.sql${NC}"
echo "- Environment: ${GREEN}.env.local${NC}"
echo ""
echo -e "${GREEN}Happy coding! 🎉${NC}"
echo ""

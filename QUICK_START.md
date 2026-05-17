# VoteSecure - Quick Start Guide

Get VoteSecure up and running in minutes!

## ⚡ Prerequisites

- **Node.js** 16+ ([Download](https://nodejs.org))
- **npm** 7+ (included with Node.js)
- **Git** ([Download](https://git-scm.com))
- **Supabase Account** ([Free Sign-up](https://supabase.com))

## 📋 Installation Steps

### Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages:
- React 19
- Vite 5
- Tailwind CSS
- Supabase
- Framer Motion
- Recharts
- And more...

### Step 2: Update Environment Variables

The file `.env.local` already has your Supabase credentials. Verify they are correct:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

These are automatically configured from your Supabase project.

### Step 3: Setup Database Schema

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor** → **New Query**
4. Copy all contents from `supabase-schema.sql`
5. Paste into the SQL editor
6. Click **Run**

This creates all tables, indexes, and security policies.

### Step 4: Start Development Server

```bash
npm run dev
```

Open your browser and visit: **http://localhost:3000**

## 🎯 Quick Test Workflow

### 1. Create Your First Account (Voter)

1. Click **Register**
2. Enter email: `voter@test.com`
3. Enter password: `TestPassword123`
4. Click **Create Account**
5. You now have a voter account!

### 2. Login

1. Click **Login**
2. Use credentials from Step 1
3. You're logged in! ✅

### 3. Browse Elections

1. Click **Elections** in navbar
2. View all elections (will be empty initially)

### 4. View Dashboard

1. Click on username in navbar
2. Go to **Dashboard**
3. You can see your voter dashboard

## 🏗️ Project Structure

```
election-system/
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/        # Page components
│   ├── services/     # API services
│   ├── context/      # Auth context
│   ├── hooks/        # Custom hooks
│   ├── utils/        # Utilities
│   └── styles/       # Tailwind CSS
├── public/           # Static assets
├── .env.local        # Environment variables
└── package.json      # Dependencies
```

## 🔑 Key Features to Test

### Authentication ✅
- [x] Register new account
- [x] Login with email/password
- [x] Logout
- [x] Forgot password

### Elections ✅
- [x] View all elections
- [x] Filter by status (Active, Upcoming, Completed)
- [x] View election details
- [x] See candidates

### Voting ✅
- [x] Join election (as voter)
- [x] Cast vote
- [x] View results

## 🛠️ Available Commands

```bash
# Start development server (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 📱 Responsive Design

The app is fully responsive:
- ✅ Desktop (1920px+)
- ✅ Laptop (1024px - 1920px)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (320px - 768px)

Test on mobile by:
1. Opening DevTools (F12)
2. Clicking device toolbar icon
3. Selecting different devices

## 🌙 Dark Mode

Dark mode is automatically detected from system preferences. It's built in and works across all components!

## 🐛 Troubleshooting

### Port 3000 Already in Use

```bash
# Kill process on port 3000
# On Mac/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### npm install Fails

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules

# Reinstall
npm install
```

### Tailwind CSS Not Working

```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Restart dev server
npm run dev
```

### Supabase Connection Error

1. Check `.env.local` has correct URL and key
2. Verify Supabase project is running
3. Check internet connection
4. Try in incognito mode

## 🚀 Next Steps

After getting started:

1. **Read SETUP_GUIDE.md** - Complete setup instructions
2. **Read API_DOCUMENTATION.md** - API reference
3. **Customize theme** - Edit `tailwind.config.js`
4. **Create test elections** - Become a creator
5. **Deploy to Vercel** - See DEPLOYMENT_GUIDE.md

## 💡 Tips & Tricks

### Hot Module Replacement (HMR)
Changes to components are reflected instantly without page reload!

### React Developer Tools
Install [React DevTools](https://react.dev/learn/react-developer-tools) for better debugging.

### Tailwind CSS IntelliSense
Install [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) in VS Code.

### Dark Mode Testing
Toggle dark mode in DevTools → More tools → Rendering → Emulate CSS media feature prefers-color-scheme

## 📊 Database

All data is stored in Supabase:
- **Database**: PostgreSQL
- **Auth**: Supabase Auth
- **Storage**: For candidate photos

View data in Supabase Dashboard:
1. Go to [Supabase](https://supabase.com/dashboard)
2. Select your project
3. Go to **Table Editor**

## 🔐 Security in Development

- ✅ Environment variables protected
- ✅ RLS policies active
- ✅ Auth tokens secure
- ✅ No sensitive data in logs

## 📚 Documentation

- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Detailed setup
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Deploy to production
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API reference
- [README.md](./README.md) - Project overview

## 🎓 Learning Resources

- **React**: https://react.dev
- **Vite**: https://vitejs.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Supabase**: https://supabase.com/docs
- **Framer Motion**: https://www.framer.com/motion/

## ⚙️ System Requirements

| Requirement | Minimum | Recommended |
|------------|---------|-------------|
| RAM | 4 GB | 8 GB |
| Disk Space | 500 MB | 1 GB |
| Node.js | 16.x | 18.x+ |
| npm | 7.x | 8.x+ |
| Browser | Latest | Chrome/Firefox |

## 🤝 Need Help?

1. Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) troubleshooting section
2. Read [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
3. Check Supabase documentation: https://supabase.com/docs
4. Open an issue on GitHub

## ✨ What's Included

✅ Complete authentication system
✅ Multi-role authorization
✅ Beautiful UI with animations
✅ Responsive mobile design
✅ Dark mode support
✅ Database schema
✅ API services
✅ Security policies
✅ Deployment ready
✅ Production configuration

## 🎉 You're All Set!

Your VoteSecure development environment is ready to use!

```bash
npm run dev
```

Happy coding! 🚀

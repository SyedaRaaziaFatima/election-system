# Secure Online Election Management System - Setup Guide

## Prerequisites

- Node.js 16+ and npm
- Git
- Supabase Account
- Vercel Account (for deployment)

## 1. Clone/Setup Project

```bash
cd election-system
npm install
```

## 2. Supabase Setup

### 2.1 Create Supabase Project
- Go to https://supabase.com
- Create new project
- Wait for database initialization
- Note your project URL and anon key

### 2.2 Setup Database Schema
- Go to Supabase SQL Editor
- Create new query
- Copy contents from `supabase-schema.sql`
- Run the query
- This will create all tables, indexes, and security policies

### 2.3 Setup Authentication
- Go to Authentication → Providers
- Enable Email/Password provider
- Configure email templates (optional)
- Go to URL Configuration
- Add your local development URL: `http://localhost:3000`
- Add your production URL after deployment

## 3. Environment Variables

Create `.env.local` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_NAME=VoteSecure
VITE_API_URL=http://localhost:3000
```

These credentials are already in your `.env.local` file.

## 4. Storage Setup

### Create Buckets
- Go to Supabase Storage
- Create bucket named `candidates` (public)
- Click on bucket → Policies → Add policies for upload

## 5. Local Development

```bash
npm run dev
```

This will start the Vite development server on http://localhost:3000

## 6. Build for Production

```bash
npm run build
```

This generates optimized production build in `dist/` folder.

## 7. User Roles

### Admin
- Approve/reject election creation requests
- Manage users and roles
- View analytics and audit logs
- Moderate elections

### Creator
- Create elections
- Add candidates
- Set election parameters
- Start/stop elections
- View results

### Voter
- Register for elections
- Vote anonymously
- View election results

## 8. First Time Setup Workflow

1. **Register a new account** - Will have 'voter' role by default
2. **Login** - Access voter dashboard
3. **To become Creator**:
   - Fill election request form
   - Admin reviews and approves
   - Role changes to 'creator'
   - Can now create elections
4. **Create Election**:
   - Add title, description, dates
   - Set max voters
   - Add candidates with photos
   - Publish election
5. **Voters can**:
   - Browse active elections
   - Register before deadline
   - Receive secret voting ID
   - Vote anonymously
   - View live results

## 9. Database Tables Overview

| Table | Purpose |
|-------|---------|
| profiles | User information and roles |
| election_requests | Requests to become creator |
| elections | Election metadata |
| candidates | Candidates for elections |
| voter_registrations | Voter registration for elections |
| secret_ids | Anonymous voting codes |
| votes | Recorded votes |
| audit_logs | System audit trail |

## 10. API Endpoints

All communication uses Supabase REST API through the SDK. No separate backend needed.

### Key Services

- **authService.js** - Authentication (signup, login, logout, profile)
- **electionService.js** - Election management
- **votingService.js** - Voting and registration
- **adminService.js** - Admin operations

## 11. Security Features

✅ Row-Level Security (RLS) policies
✅ Email verification
✅ Anonymous voting with secret IDs
✅ One vote per person enforcement
✅ Encrypted connections
✅ Session management
✅ Audit logging
✅ Role-based access control

## 12. File Structure

```
src/
├── components/        # Reusable UI components
├── pages/            # Page components
├── layouts/          # Layout wrappers
├── routes/           # Routing configuration
├── services/         # API service layers
├── context/          # React Context (Auth)
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── lib/              # External library configs
├── styles/           # Global CSS
└── assets/           # Images, icons, etc.
```

## 13. Troubleshooting

### Supabase Connection Issues
```bash
# Check environment variables
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
```

### RLS Policy Errors
- Check Supabase SQL Editor for policy syntax
- Ensure user is authenticated before accessing protected data
- Verify role is set correctly in profiles table

### Styling Issues
- Ensure Tailwind CSS is properly configured
- Check `tailwind.config.js` and `postcss.config.js`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

## 14. Testing

### Test User Accounts

```
Admin Account:
- Email: admin@votesecure.com
- Password: Admin@123
- Role: admin

Creator Account:
- Email: creator@votesecure.com
- Password: Creator@123
- Role: creator

Voter Account:
- Email: voter@votesecure.com
- Password: Voter@123
- Role: voter
```

Note: Create these manually in Supabase Auth, then set roles in profiles table.

## 15. Performance Optimization

- Database indexes are created for common queries
- Images are stored in Supabase Storage (CDN)
- Frontend is bundled and minified with Vite
- React components are lazy-loaded with dynamic imports
- Caching strategies can be added for offline support

## 16. Next Steps

1. ✅ Setup database
2. ✅ Configure environment variables
3. ✅ Test locally
4. ✅ Deploy to Vercel
5. ✅ Monitor with Supabase Analytics
6. ✅ Scale as needed

For detailed documentation, visit:
- Supabase: https://supabase.com/docs
- Vite: https://vitejs.dev
- React: https://react.dev
- Tailwind CSS: https://tailwindcss.com

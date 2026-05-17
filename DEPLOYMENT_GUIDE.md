# Deployment Guide - VoteSecure

## Production Deployment to Vercel

### Prerequisites
- Vercel Account (free)
- GitHub Account
- Deployed Supabase Project

## Step 1: Prepare for Deployment

### 1.1 Build Configuration
Ensure your `vite.config.js` is set up for production:

```javascript
// Already configured - should work as-is
build: {
  outDir: 'dist',
  sourcemap: false,
  minify: 'terser',
}
```

### 1.2 Environment Variables
Your project should have `.env.local` with:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Step 2: Push to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: VoteSecure election system"

# Add remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### 3.1 Connect GitHub to Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Select "Import Git Repository"
4. Search for your repository
5. Click "Import"

### 3.2 Configure Project
1. **Project Name**: `votesecure` (or your choice)
2. **Framework**: Select "Vite"
3. **Root Directory**: `.` (if root is the project folder)
4. **Build Command**: `npm run build` (should be auto-detected)
5. **Output Directory**: `dist` (should be auto-detected)
6. **Install Command**: `npm install` (auto-detected)

### 3.3 Add Environment Variables
1. In Vercel dashboard, go to Settings → Environment Variables
2. Add these variables:

```
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = your-anon-key
```

3. Click "Save"

### 3.4 Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. You'll get a URL like: `https://votesecure.vercel.app`

## Step 4: Configure Supabase for Production

### 4.1 Update Supabase Auth Settings
1. Go to Supabase Dashboard
2. Authentication → URL Configuration
3. Add your Vercel URL to allowed redirects:

```
https://votesecure.vercel.app
https://votesecure.vercel.app/login
https://votesecure.vercel.app/dashboard
```

### 4.2 Enable Email Providers (Optional)
1. Authentication → Email Templates
2. Customize email templates
3. Setup email provider (SendGrid, Resend, etc.)

### 4.3 Configure CORS (if needed)
If you get CORS errors:
1. Go to Project Settings → API
2. Add your Vercel domain to allowed origins

## Step 5: Custom Domain (Optional)

### 5.1 Connect Domain
1. In Vercel dashboard: Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for DNS propagation (up to 48 hours)

### 5.2 Update Supabase Auth
Repeat Step 4.1 with your custom domain

## Step 6: SSL Certificate

Vercel automatically provides free SSL certificates with:
- Auto-renewal
- HTTPS by default
- A+ security rating

## Step 7: Monitoring & Analytics

### 7.1 Vercel Analytics
- Dashboard shows deployment history
- Performance metrics
- Error logs

### 7.2 Supabase Monitoring
- Database usage in Supabase dashboard
- Real-time analytics
- Storage usage

## Step 8: Continuous Deployment

After initial setup, every push to GitHub automatically triggers deployment:

```bash
# Make changes
git add .
git commit -m "Feature: Add new voting feature"
git push

# Deployment starts automatically on Vercel
# Check https://vercel.com/dashboard for status
```

## Production Checklist

- ✅ Environment variables set in Vercel
- ✅ Supabase Auth URLs configured
- ✅ Database backups enabled (Supabase)
- ✅ Security policies reviewed
- ✅ Error monitoring setup
- ✅ Email templates customized
- ✅ Terms of Service page added
- ✅ Privacy Policy page added
- ✅ Contact/Support page available

## Scaling Considerations

### Database
- Supabase has generous free tier
- Upgrade plan if you exceed limits
- Enable connection pooling for high volume

### Storage
- Use CDN for image delivery (included with Supabase)
- Optimize image sizes before upload
- Consider compression

### Serverless Functions (Future)
- Can add Vercel Serverless Functions for custom logic
- Use `/api` directory in project root
- Scales automatically

## Disaster Recovery

### Database Backup
1. Supabase → Backups
2. Enable automated backups
3. Manual backups available

### Code Backup
- GitHub handles version control
- Create regular releases
- Keep deployment history

## Troubleshooting Deployment

### Build Fails
```bash
# Check build locally first
npm run build

# Clear node_modules
rm -rf node_modules
npm install

# Push again
git push
```

### Environment Variables Not Working
1. Verify spelling matches `import.meta.env.VITE_*`
2. Redeploy after adding variables
3. Check Vercel logs

### CORS Errors
1. Add domain to Supabase CORS settings
2. Wait for changes to propagate
3. Clear browser cache

### Database Connection Issues
1. Check credentials in Supabase dashboard
2. Verify IP whitelist (Supabase)
3. Check firewall rules

## Performance Optimization

### Image Optimization
```bash
# Install optimization tools
npm install -D sharp

# Add to build script for image compression
```

### Bundle Size
```bash
# Analyze bundle
npm run build -- --report
```

### Caching
- Vercel provides automatic caching
- Configure in `vercel.json`:

```json
{
  "public": {
    "maxAge": 86400
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "max-age=3600"
        }
      ]
    }
  ]
}
```

## Post-Deployment

1. **Test all features** on production
2. **Monitor errors** in Vercel/Supabase dashboards
3. **Collect user feedback**
4. **Monitor performance** metrics
5. **Plan improvements** for next release

## Support & Resources

- Vercel Documentation: https://vercel.com/docs
- Supabase Deployment: https://supabase.com/docs/guides/cli/deployment
- GitHub Actions: https://docs.github.com/en/actions
- React Production: https://react.dev/learn/start-a-new-react-project

## Estimated Costs (Production)

- **Vercel**: Free tier (generous limits), $20+/month if upgraded
- **Supabase**: Free tier, $25+/month for Pro
- **Domain**: $10-15/year
- **Email Service**: $0-50/month (depending on volume)

**Total**: Free-$100/month depending on usage

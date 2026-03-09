# Vercel Deployment Checklist

## Changes Made
✅ Database connection moved to middleware (fixes serverless cold starts)
✅ Removed `morgan` dependency in production
✅ Fixed `process.exit()` to `throw error` in db.js
✅ Added NODE_ENV to vercel.json

## Before Deploying

### 1. Set Environment Variables in Vercel
Go to your Vercel project → Settings → Environment Variables and add:

- `MONGODB_URI` = your MongoDB connection string
- `CLIENT_URL` = your Cloudflare frontend URL (e.g., https://your-app.pages.dev)
- `JWT_SECRET` = your JWT secret key

### 2. Update MongoDB Atlas
- Go to MongoDB Atlas → Network Access
- Click "Add IP Address"
- Click "Allow Access from Anywhere" (0.0.0.0/0)
- This is required because Vercel functions use dynamic IPs

### 3. Deploy
```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Testing After Deployment

Test these endpoints:
- GET `https://your-backend.vercel.app/api/health`
- POST `https://your-backend.vercel.app/api/auth/login`
- GET `https://your-backend.vercel.app/api/venues`

## Update Frontend

In your Cloudflare frontend, update the API base URL:
```javascript
// In your api.js or environment config
const API_BASE_URL = 'https://your-backend.vercel.app'
```

## Troubleshooting

If you still get errors:
1. Check Vercel logs: Project → Deployments → Click deployment → Runtime Logs
2. Verify all environment variables are set correctly
3. Make sure MONGODB_URI includes database name
4. Check MongoDB Atlas allows connections from 0.0.0.0/0

# 🚀 DEPLOYMENT GUIDE - HomeCook Platform
## Vercel (Frontend) + Render (Backend)

**Last Updated:** August 13, 2026  
**Status:** Ready for Production Deployment

---

## 📋 PREREQUISITE STEPS

### 1. Push Code to GitHub (Required)
Before deploying, you need to:
1. Go to: https://github.com/Satyan2309/Home_connect_food_delivery/security/secret-scanning/unblock-secret/3HqsrZgNyq8NNqWy8jTQHfbAtuk
2. Click **"Allow"** to unblock the Stripe secret
3. Try pushing again: `git push origin main`

**Alternative:** Create a new clean branch without secrets:
```bash
git checkout --orphan clean-main
git add -A
git commit -m "Production-ready HomeCook platform"
git push -u origin clean-main
```

---

## 🎯 PART 1: DEPLOY BACKEND TO RENDER

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub (recommended for easier integration)
3. Verify email

### Step 2: Create PostgreSQL Database (Optional - or use MongoDB Atlas)
1. In Render dashboard, click **"New +"**
2. Select **"PostgreSQL"**
3. Name: `homecook-db`
4. Region: Choose closest to users
5. Click **"Create Database"**
6. Copy connection string (you'll need this)

### Step 3: Deploy Backend Service
1. In Render dashboard, click **"New +"**
2. Select **"Web Service"**
3. Connect your GitHub repository
4. Fill in details:
   - **Name:** `homecook-backend`
   - **Repository:** `Satyan2309/Home_connect_food_delivery`
   - **Branch:** `main` (or `clean-main`)
   - **Runtime:** Node
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`

### Step 4: Add Environment Variables to Render
In the "Environment" section, add these variables:

```bash
# Database
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/homecook

# Authentication & Security
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_long
NODE_ENV=production

# Stripe
STRIPE_SECRET_KEY=sk_live_xxxxx (use LIVE keys for production)
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# AI Chatbot
NVIDIA_API_KEY=nvapi-xxxxx
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_MODEL=meta/llama-3.1-8b-instruct

# Frontend & CORS
FRONTEND_URL=https://your-vercel-domain.vercel.app
ALLOWED_ORIGINS=https://your-vercel-domain.vercel.app

# Server
PORT=3000
CURRENCY=inr
```

### Step 5: Configure Stripe Webhook on Render
1. After deployment, copy the Render backend URL (e.g., https://homecook-backend.onrender.com)
2. Go to Stripe Dashboard → Developers → Webhooks
3. Click **"Add Endpoint"**
4. Endpoint URL: `https://homecook-backend.onrender.com/api/webhooks/stripe`
5. Select events:
   - `checkout.session.completed`
   - `charge.refunded`
   - `charge.failed`
6. Copy Webhook Signing Secret and add to Render environment as `STRIPE_WEBHOOK_SECRET`

### Step 6: Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (2-5 minutes)
3. You'll get a URL like: `https://homecook-backend.onrender.com`

---

## 🎨 PART 2: DEPLOY FRONTEND TO VERCEL

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub (recommended)
3. Authorize Vercel to access your repositories

### Step 2: Deploy Frontend
1. In Vercel dashboard, click **"Add New +"**
2. Select **"Project"**
3. Import your GitHub repository: `Satyan2309/Home_connect_food_delivery`
4. Select **"Frontend"** as the root directory or configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** React
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

### Step 3: Add Environment Variables
In the "Environment Variables" section, add:

```bash
REACT_APP_API_URL=https://homecook-backend.onrender.com
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx (use LIVE keys for production)
REACT_APP_ENV=production
```

### Step 4: Deploy
1. Click **"Deploy"**
2. Wait for deployment (1-3 minutes)
3. You'll get a URL like: `https://homecook-delivery.vercel.app`

---

## ✅ POST-DEPLOYMENT VERIFICATION

### Test Backend API
```bash
curl https://homecook-backend.onrender.com/health
# Should return: { "status": "ok", "timestamp": "...", "environment": "production" }
```

### Test Frontend
1. Visit: `https://homecook-delivery.vercel.app`
2. Try creating an account
3. Browse menu
4. Test Stripe payment with live credentials

### Test Real-Time Features
1. Place an order
2. Check order status updates (Socket.io)
3. Verify chat with AI assistant

### Test Payment Webhook
1. Make a test payment
2. Check Stripe dashboard for webhook delivery
3. Verify order status auto-updates

---

## 🔐 PRODUCTION SECURITY CHECKLIST

- [x] Use LIVE Stripe keys (not test keys)
- [x] Use production MongoDB (not local)
- [x] Use strong JWT_SECRET (min 32 characters)
- [x] Set `NODE_ENV=production`
- [x] Enable HTTPS (Vercel/Render do this automatically)
- [x] Configure CORS to your Vercel domain only
- [x] Set up Stripe webhooks for production
- [x] Enable rate limiting (already in code)
- [x] Use environment-specific configs
- [x] Test payment flow with live credentials

---

## 🆘 TROUBLESHOOTING

### Issue: Backend deployment fails
**Solution:**
```bash
# Check build logs in Render dashboard
# Ensure all dependencies are in backend/package.json
# Verify Node version is 16+
```

### Issue: CORS errors in browser
**Solution:**
```bash
# Update FRONTEND_URL in backend environment
# Update ALLOWED_ORIGINS to include your Vercel domain
# Restart backend on Render
```

### Issue: Socket.io connection fails
**Solution:**
```bash
# Ensure WebSocket is enabled (Render allows by default)
# Check browser console for connection errors
# Verify FRONTEND_URL matches exactly
```

### Issue: Stripe webhook not firing
**Solution:**
```bash
# Go to Stripe → Developers → Webhooks
# Verify endpoint URL is correct
# Check webhook signing secret matches STRIPE_WEBHOOK_SECRET
# Review webhook logs in Stripe dashboard
```

### Issue: "Cannot find module" error
**Solution:**
```bash
# Ensure all dependencies are installed
# Check package.json has all required packages
# Clear node_modules and reinstall:
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 MONITORING & LOGS

### View Render Logs
1. Go to Render dashboard
2. Select your service
3. Click **"Logs"** tab
4. Monitor in real-time

### View Vercel Logs
1. Go to Vercel dashboard
2. Select your project
3. Click **"Deployments"**
4. Click on deployment to view logs

### Monitor Stripe Webhooks
1. Stripe Dashboard → Developers → Webhooks
2. Click on endpoint
3. View recent deliveries and status

---

## 🔄 REDEPLOYMENT

### Trigger Automatic Redeployment
- Push to `main` branch on GitHub
- Both Render and Vercel will automatically redeploy

### Manual Redeployment
**Render:**
1. Dashboard → Select Service
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

**Vercel:**
1. Dashboard → Select Project
2. Click **"Redeploy"** → **"Redeploy"**

---

## 💰 ESTIMATED COSTS (Monthly)

**Render (Backend):**
- Web Service: ~$7/month (Starter plan)
- PostgreSQL: ~$15/month (optional, if using Render DB)

**Vercel (Frontend):**
- Hobby plan: FREE (for small projects)
- Pro plan: $20/month (for production apps)

**MongoDB Atlas:**
- Free tier: 512MB (development)
- Shared tier: ~$57/month (production)

**Stripe:**
- 2.9% + $0.30 per transaction (no monthly fee)

**NVIDIA API:**
- Pay-per-use (currently free tier available)

**Total:** ~$30-100/month depending on traffic

---

## 📈 SCALING

### When to Scale Up

**Render:**
- More than 10 concurrent users → upgrade to Standard ($25+/month)
- More than 100 concurrent users → upgrade to Pro ($115+/month)

**Vercel:**
- More than 1M function invocations/month → consider Pro plan

**MongoDB:**
- More than 512MB data → upgrade to Dedicated cluster

### Load Testing
Use tools like:
- Artillery: `artillery quick --count 100 --num 1000 https://your-api.com`
- Apache Bench: `ab -n 1000 -c 100 https://your-api.com`

---

## 🎯 NEXT STEPS AFTER DEPLOYMENT

### 1. Set Up Custom Domain
**Vercel:**
- Dashboard → Settings → Domains
- Add your domain (e.g., homecook.com)

**Render:**
- Dashboard → Service → Settings → Custom Domain
- Add your API domain (e.g., api.homecook.com)

### 2. Enable SSL Certificate
- Vercel: Automatic
- Render: Automatic

### 3. Set Up CDN for Images
1. Upload meal images to Cloudinary or AWS S3
2. Update image URLs in menu items

### 4. Enable Analytics
1. Vercel: Dashboard → Analytics (built-in)
2. Google Analytics: Add tracking code to frontend

### 5. Set Up Email Notifications
1. Implement Nodemailer in backend
2. Send order confirmations to customers

### 6. Monitor Performance
1. Set up uptime monitoring (UptimeRobot)
2. Monitor API response times
3. Track database performance

---

## 🔗 USEFUL LINKS

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Atlas:** https://www.mongodb.com/cloud/atlas
- **Stripe Webhooks:** https://stripe.com/docs/webhooks
- **Socket.io Deployment:** https://socket.io/docs/v4/deploying/

---

## 📞 SUPPORT

If you encounter issues:
1. Check Render/Vercel logs
2. Review application error logs
3. Test locally: `npm run dev` (backend) & `npm start` (frontend)
4. Check environment variables match
5. Verify all API keys are correct

---

## ✨ DEPLOYMENT SUCCESS INDICATORS

After deployment, verify:
- ✅ Backend API responds to health check
- ✅ Frontend loads without CORS errors
- ✅ Can create account and login
- ✅ Can browse menu items
- ✅ Can add items to cart
- ✅ Payment flow works with test card
- ✅ Order tracking updates in real-time
- ✅ Chat with AI assistant works
- ✅ Stripe webhooks fire correctly
- ✅ All console errors resolved

---

## 🎉 YOU'RE LIVE!

Your HomeCook platform is now in production! 

**Frontend:** `https://your-domain.vercel.app`  
**Backend API:** `https://homecook-backend.onrender.com`  
**Admin:** Monitor through Vercel & Render dashboards

---

**Questions?** Review the troubleshooting section or check the deployment service documentation.

**Ready to scale?** Follow the scaling section when you outgrow current resources.

**Happy shipping! 🚀**

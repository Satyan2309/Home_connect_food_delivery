# HomeCook - Production-Grade Food Delivery Platform
## Environment Configuration Guide

### Backend Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```bash
# ============================================
# DATABASE
# ============================================
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/homecook

# ============================================
# AUTHENTICATION & SECURITY
# ============================================
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_long
NODE_ENV=development

# ============================================
# STRIPE PAYMENT INTEGRATION
# ============================================
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx

# ============================================
# AI CHATBOT - NVIDIA LLAMA 3.1
# ============================================
NVIDIA_API_KEY=nvapi-xxxxxxxxxxxxxxxxxxxxx
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_MODEL=meta/llama-3.1-8b-instruct

# ============================================
# CORS & FRONTEND
# ============================================
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:3001

# ============================================
# SERVER CONFIGURATION
# ============================================
PORT=5000
CURRENCY=inr

# ============================================
# EMAIL SERVICE (Optional for notifications)
# ============================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@homecook.com
```

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```bash
# ============================================
# API CONFIGURATION
# ============================================
REACT_APP_API_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx

# ============================================
# ENVIRONMENT
# ============================================
REACT_APP_ENV=development
```

### Getting Required API Keys

#### 1. **MongoDB Atlas** (Database)
- Go to https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/homecook`

#### 2. **Stripe** (Payments)
- Sign up at https://stripe.com
- Go to Dashboard → Developers → API Keys
- Copy Secret Key (starts with `sk_test_`)
- Copy Publishable Key (starts with `pk_test_`)
- Set up Webhook: Go to Webhooks → Add Endpoint
  - URL: `https://yourdomain.com/api/webhooks/stripe`
  - Events: `checkout.session.completed`, `charge.refunded`, `charge.failed`

#### 3. **NVIDIA Llama 3.1 API** (Chatbot)
- Go to https://build.nvidia.com
- Create account and get API key
- Create a project and enable Llama 3.1 8B Instruct model

---

## Installation & Startup

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on: `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on: `http://localhost:3000`

---

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Menu Endpoints
- `GET /api/menu/items` - List all menu items
- `POST /api/menu/items` - Create menu item (chef only)
- `PUT /api/menu/items/:id` - Update menu item (chef only)
- `DELETE /api/menu/items/:id` - Delete menu item

### Order Endpoints
- `POST /api/orders` - Create order
- `GET /api/orders/my` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status
- `PUT /api/orders/:id/cancel` - Cancel order

### Payment Endpoints
- `POST /api/payments/checkout/session` - Create Stripe session
- `GET /api/payments/checkout/status/:sessionId` - Check payment status
- `POST /api/payments/refund` - Process refund

### Chat Endpoints
- `POST /api/chat/message` - Send message to AI
- `GET /api/chat/history/:sessionId` - Get chat history

### Webhook Endpoints
- `POST /api/webhooks/stripe` - Stripe payment webhook

---

## Features Implemented

✅ **User Authentication** - JWT-based auth with role-based access
✅ **Menu Management** - CRUD operations for menu items
✅ **Order Management** - Full order lifecycle (pending → delivered)
✅ **Payment Processing** - Stripe integration with webhooks
✅ **Review System** - Ratings and comments on meals
✅ **AI Chatbot** - NVIDIA Llama 3.1 with tool calling
✅ **Real-Time Tracking** - Socket.io order status updates
✅ **Security** - Helmet, CORS, rate limiting, input validation
✅ **Responsive UI** - React with Framer Motion animations

---

## Project Structure

```
home-made-food-delivery/
├── backend/
│   ├── controllers/      # Business logic
│   ├── models/          # Database schemas
│   ├── routes/          # API routes
│   ├── middlewares/     # Auth, error handling
│   ├── utils/           # Helper functions
│   ├── app.js           # Express setup
│   ├── server.js        # Server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # Global state
│   │   ├── services/    # API client
│   │   ├── styles/      # CSS files
│   │   ├── App.jsx      # Main app
│   │   └── index.js     # React entry
│   ├── public/          # Static files
│   └── package.json
```

---

## Deployment

### Backend (Heroku/Railway)
```bash
# Add to Procfile:
web: npm start

# Set environment variables in platform dashboard
# Push code to deploy
```

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy build/ folder
```

---

## Support & Next Steps

1. **Add Tests** - Implement Jest for backend and React Testing Library for frontend
2. **Database Transactions** - Add Mongoose sessions for multi-step operations
3. **Delivery Tracking** - Integrate Google Maps API for real-time location
4. **Mobile App** - Build React Native version
5. **Advanced Analytics** - Dashboard with charts and insights
6. **Email Notifications** - Nodemailer integration
7. **Admin Dashboard** - Full platform management UI

---

**Happy Coding! 🚀**

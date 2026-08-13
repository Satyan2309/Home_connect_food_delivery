# HomeCook 🍲 - AI-Powered Food Delivery Platform

> **Production-Grade Full-Stack E-Commerce Platform** for ordering authentic homemade meals from local chefs with real-time tracking, AI chatbot support, and secure payments.

[![Node.js](https://img.shields.io/badge/Node.js-16+-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-green)](https://www.mongodb.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Integrated-purple)](https://stripe.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](#license)

---

## 🌟 Features

### 👥 For Customers
- 🔐 Secure authentication with JWT
- 🍽️ Browse and filter menu items
- 🛒 Shopping cart with persistence
- 💳 Secure checkout with Stripe
- 📦 Real-time order tracking
- ⭐ Leave reviews and ratings
- 🤖 AI chatbot for recommendations and order inquiries
- 📱 Fully responsive design

### 👨‍🍳 For Chefs
- ✏️ Manage menu items (CRUD)
- 📋 View incoming orders
- 📊 Update order status
- 💰 Track earnings
- ⭐ Monitor customer ratings

### 🛡️ For Admins
- 📊 Platform analytics dashboard
- 👥 User management
- 📈 Revenue metrics
- 🔍 View all orders

### 🚀 Platform Features
- ✅ **Real-Time Order Tracking** - Socket.io for live status updates
- ✅ **AI Chatbot** - NVIDIA Llama 3.1 with tool calling
- ✅ **Secure Payments** - Stripe with webhook verification
- ✅ **Security** - Helmet, CORS, rate limiting, input validation
- ✅ **Responsive UI** - Mobile-first React design
- ✅ **Animations** - Framer Motion transitions
- ✅ **State Management** - Context API with localStorage
- ✅ **Error Handling** - Comprehensive error middleware

---

## 🏗️ Technology Stack

### Backend
```
Node.js + Express.js      → REST API
MongoDB + Mongoose        → Database
Socket.io                 → Real-time tracking
Stripe API               → Payment processing
NVIDIA Llama 3.1 AI      → Chatbot engine
JWT + bcryptjs           → Authentication
Helmet                   → Security headers
Express-rate-limit       → DDoS protection
```

### Frontend
```
React 18                 → UI library
React Router             → Navigation
Framer Motion            → Animations
Axios                    → API client
Socket.io Client         → Real-time updates
Context API              → State management
CSS3                     → Styling
Responsive Design        → Mobile-first
```

---

## 📦 Installation

### Prerequisites
- **Node.js** 16 or higher
- **MongoDB** (cloud or local)
- **Stripe Account** (get keys)
- **NVIDIA API Key** (for chatbot)

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your credentials:
# - MONGO_URL
# - JWT_SECRET
# - STRIPE_SECRET_KEY
# - NVIDIA_API_KEY

# Start development server
npm run dev
# Server runs on http://localhost:5000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your API URL
# REACT_APP_API_URL=http://localhost:5000

# Start development server
npm start
# App runs on http://localhost:3000
```

---

## 🔧 Environment Variables

### Backend (.env)
```bash
# Database
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/homecook

# Auth & Security
JWT_SECRET=your_super_secret_key_min_32_chars
NODE_ENV=development

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# AI Chatbot (NVIDIA Llama 3.1)
NVIDIA_API_KEY=nvapi-xxxxx
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_MODEL=meta/llama-3.1-8b-instruct

# Server
PORT=5000
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
CURRENCY=inr
```

### Frontend (.env)
```bash
REACT_APP_API_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
REACT_APP_ENV=development
```

---

## 🚀 Quick Start

### 1. Clone and Install
```bash
# Backend
cd backend && npm install && cp .env.example .env

# Frontend
cd frontend && npm install && cp .env.example .env
```

### 2. Configure Environment
- Update `.env` files with your API credentials
- MongoDB connection string
- Stripe keys
- NVIDIA API key

### 3. Run Development Servers
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm start
```

### 4. Access Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Docs:** Check routes in `backend/routes/`

---

## 📡 API Endpoints

### Authentication
```bash
POST   /api/auth/register           # Register new user
POST   /api/auth/login              # Login user
GET    /api/auth/me                 # Get current user profile
```

### Menu Management
```bash
GET    /api/menu/items              # List all menu items
GET    /api/menu/items/my           # Get chef's items
POST   /api/menu/items              # Create menu item (chef)
PUT    /api/menu/items/:id          # Update menu item (chef)
DELETE /api/menu/items/:id          # Delete menu item (chef)
```

### Orders
```bash
POST   /api/orders                  # Create new order
GET    /api/orders/my               # Get user's orders
GET    /api/orders/:id              # Get order details
PUT    /api/orders/:id/status       # Update status (chef/admin)
PUT    /api/orders/:id/cancel       # Cancel order (customer)
```

### Payments
```bash
POST   /api/payments/checkout/session    # Create Stripe session
GET    /api/payments/checkout/status/:id # Check payment status
POST   /api/payments/refund              # Process refund
GET    /api/payments/history             # Payment history
```

### Reviews
```bash
POST   /api/reviews                 # Create review
GET    /api/reviews/chef/:id        # Get chef reviews
GET    /api/reviews/item/:id        # Get item reviews
```

### AI Chat
```bash
POST   /api/chat/message            # Send message to AI
GET    /api/chat/history/:id        # Get chat history
```

### Webhooks
```bash
POST   /api/webhooks/stripe         # Stripe payment events
```

---

## 🤖 AI Chatbot Features

The HomeCook AI assistant (powered by NVIDIA Llama 3.1) can:

### 1. **Search Meals**
```
User: "Find me vegan meals under ₹200"
AI: [Uses search_meals tool] → Returns matching items
```

### 2. **Track Orders**
```
User: "Where is my order?"
AI: [Uses get_order_status tool] → Shows current status
```

### 3. **Save Ratings**
```
User: "I want to rate this order 5 stars"
AI: [Uses save_rating tool] → Saves feedback
```

### 4. **Answer Questions**
- Menu recommendations
- Delivery process FAQs
- Payment information
- Account help

---

## 📊 Real-Time Features

### Socket.io Rooms

**Order Tracking:**
```javascript
socket.emit('join_order', orderId);
socket.on('order_status_update', (data) => {
  // { orderId, status, message, timestamp }
});
```

**Kitchen Queue:**
```javascript
socket.emit('join_kitchen', kitchenId);
socket.on('new_order', (data) => {
  // Chef receives new orders
});
```

**Delivery Tracking:**
```javascript
socket.emit('join_delivery', deliveryId);
socket.on('location_update', (data) => {
  // { latitude, longitude, eta, timestamp }
});
```

---

## 🔐 Security Features

✅ **JWT Authentication** - Secure token-based auth  
✅ **Password Hashing** - bcryptjs with 10 salt rounds  
✅ **Helmet.js** - Security HTTP headers  
✅ **CORS Protection** - Strict origin whitelist  
✅ **Rate Limiting** - Brute force protection  
✅ **Input Validation** - express-validator on all endpoints  
✅ **SQL/NoSQL Injection Prevention** - Parameterized queries  
✅ **Stripe Webhook Verification** - Signature validation  
✅ **Role-Based Access Control** - Customer/Chef/Admin  
✅ **Error Handling** - No sensitive data leakage  

---

## 📁 Project Structure

```
homecook/
├── backend/
│   ├── controllers/          # Business logic
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API endpoints
│   ├── middlewares/         # Auth, errors
│   ├── utils/               # Helpers
│   ├── app.js               # Express setup
│   ├── server.js            # Server entry
│   ├── package.json         # Dependencies
│   └── .env.example         # Environment template
│
├── frontend/
│   ├── src/
│   │   ├── context/         # Global state
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── services/        # API client
│   │   ├── styles/          # CSS modules
│   │   ├── App.jsx          # Main router
│   │   └── index.js         # React entry
│   ├── public/              # Static files
│   ├── package.json         # Dependencies
│   └── .env.example         # Environment template
│
├── SETUP.md                 # Detailed setup guide
├── BUILD_SUMMARY.md         # Build documentation
└── README.md               # This file
```

---

## 🎯 Usage Examples

### Register a New User
```javascript
const response = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'securepass123',
    role: 'customer'
  })
});
const data = await response.json();
console.log(data.token); // JWT token
```

### Create an Order
```javascript
const response = await fetch('http://localhost:5000/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    items: [{ id: 'item-1', quantity: 2 }],
    delivery_address: '123 Main St, City',
    special_instructions: 'No onions'
  })
});
```

### Chat with AI
```javascript
const response = await fetch('http://localhost:5000/api/chat/message', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Find vegan meals under ₹200',
    session_id: 'session-123'
  })
});
```

---

## 🧪 Testing

### Manual Testing
1. Create account as customer and chef
2. Add menu items as chef
3. Browse and order as customer
4. Track order in real-time
5. Test payment with Stripe test card: `4242 4242 4242 4242`
6. Chat with AI assistant
7. Leave reviews

### Test Credentials
```
Email: test@homecook.com
Password: Test123456
Role: customer
```

---

## 📈 Performance Optimization

- ✅ React component memoization
- ✅ Lazy loading for routes
- ✅ Image optimization ready
- ✅ MongoDB indexing
- ✅ API response caching
- ✅ Socket.io room-based messaging
- ✅ CSS minification
- ✅ Bundle size optimization

---

## 🚢 Deployment

### Backend (Heroku/Railway)
```bash
# Create Procfile
echo "web: npm start" > Procfile

# Deploy
git push heroku main
```

### Frontend (Vercel/Netlify)
```bash
# Build
npm run build

# Deploy build/ folder to Vercel/Netlify
```

### Environment Setup
Set all `.env` variables in platform dashboard before deployment.

---

## 🐛 Troubleshooting

### Issue: MongoDB Connection Failed
**Solution:**
- Verify `MONGO_URL` in `.env`
- Check IP whitelist in MongoDB Atlas
- Ensure network connectivity

### Issue: Stripe Webhook Not Working
**Solution:**
- Update `STRIPE_WEBHOOK_SECRET` in `.env`
- Test with Stripe CLI: `stripe listen --forward-to localhost:5000/api/webhooks/stripe`
- Verify endpoint URL is correct

### Issue: Chatbot Not Responding
**Solution:**
- Verify `NVIDIA_API_KEY` is valid
- Check API key hasn't expired
- Test connectivity with curl

### Issue: Socket.io Connection Fails
**Solution:**
- Check CORS settings in `app.js`
- Verify frontend URL matches `FRONTEND_URL`
- Check firewall/port access

---

## 📚 Additional Resources

- **API Documentation:** See `SETUP.md`
- **Build Summary:** See `BUILD_SUMMARY.md`
- **Stripe Docs:** https://stripe.com/docs/payments/checkout
- **NVIDIA AI Docs:** https://build.nvidia.com
- **MongoDB Docs:** https://docs.mongodb.com

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Developer Support

**Questions or Issues?**
1. Check `SETUP.md` for detailed configuration
2. Review `BUILD_SUMMARY.md` for feature overview
3. Check inline code comments
4. Review API endpoint documentation

---

## 🙏 Acknowledgments

- NVIDIA for Llama 3.1 AI model
- Stripe for payment infrastructure
- MongoDB for database
- React community for excellent libraries
- Socket.io for real-time capabilities

---

## 📊 Project Stats

- **Backend Routes:** 25+
- **Frontend Pages:** 6
- **React Components:** 8+
- **Context Providers:** 3
- **CSS Modules:** 8
- **Security Measures:** 10+
- **Real-Time Features:** Order, Kitchen, Delivery tracking
- **AI Tool Functions:** 3 callable tools
- **Webhook Events:** 3 Stripe events

---

## 🎯 Roadmap

### Phase 1 ✅ (Completed)
- ✅ Core e-commerce functionality
- ✅ Payment processing
- ✅ Real-time tracking
- ✅ AI chatbot

### Phase 2 🔄 (Upcoming)
- ⏳ Delivery partner system
- ⏳ Advanced analytics dashboard
- ⏳ Image upload system
- ⏳ Email notifications
- ⏳ Mobile app (React Native)

### Phase 3 📅 (Future)
- ⏳ Advanced search (Elasticsearch)
- ⏳ Recommendation engine (ML)
- ⏳ Multi-language support
- ⏳ Testing suite (Jest, Cypress)
- ⏳ Microservices architecture

---

## 📞 Quick Links

- **API Docs:** `/docs/api.md`
- **Setup Guide:** `/SETUP.md`
- **Build Summary:** `/BUILD_SUMMARY.md`
- **Backend:** `/backend`
- **Frontend:** `/frontend`

---

## ⭐ Show Your Support

If you find this project helpful, please consider giving it a star! ⭐

---

**Built with ❤️ by [Your Team]**  
**Last Updated:** August 13, 2026  
**Status:** ✅ Production Ready

---

**Ready to revolutionize food delivery? Let's go! 🚀**

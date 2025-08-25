# HomeCook Connect

## Overview
HomeCook Connect is a platform that connects home chefs with customers looking for homemade meals. The application allows customers to browse meals, place orders, and have them delivered, while enabling home chefs to showcase and sell their culinary creations.

## Features

### Core Features
- User authentication (JWT-based)
- User profiles (Customer and Chef)
- Meal discovery and browsing
- Shopping cart and checkout
- Order management
- Payment processing
- Location-based services

### API Integrations
The application is set up to work with the following external services:

1. **Google Maps Platform API**
   - Current implementation: Basic location detection using browser's Geolocation API and iframe map display
   - Production-ready code for: Address autocomplete, reverse geocoding, and interactive maps
   - Required for production: Google Maps Platform API Key

2. **Stripe Payment Processing**
   - Current implementation: Backend integration with Stripe for payment intents
   - Production-ready code for: Secure card element, payment method tokenization, and saved cards
   - Required for production: Stripe Publishable and Secret API Keys

3. **OAuth Social Login**
   - Current implementation: Simulated social login with mock data
   - Production-ready code for: Google and Facebook authentication
   - Required for production: OAuth 2.0 credentials for Google and Facebook

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/homecook-connect.git
   cd homecook-connect
   ```

2. Install dependencies for both frontend and backend
   ```
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables
   - Create a `.env` file in the backend directory based on the `.env.example` template
   - Add your MongoDB connection string, JWT secret, and other required variables

4. Start the application

   ### Production Mode (Single Port)
   ```
   # Install all dependencies (if not done already)
   npm run install:all
   
   # Start the combined application (builds frontend and serves from backend)
   npm start
   ```
   
   This will build the frontend and serve it along with the backend API on port 7071.
   Access the application at: http://localhost:7071
   
   ### Development Mode (Dual Servers)
   ```
   # Start both frontend and backend development servers with a single command
   npm run dev
   ```
   
   This will start:
   - Backend server on port 7071 (http://localhost:7071/api)
   - Frontend development server on port 7070 (http://localhost:7070)
   
   ### Other Useful Commands
   ```
   # Rebuild the frontend and start the combined application
   npm run rebuild
   
   # Run frontend and backend separately (legacy method)
   npm run dev:frontend  # Starts frontend on port 7070
   npm run dev:backend   # Starts backend on port 7071
   ```

## API Keys for Production

To deploy this application in a production environment, you will need to obtain the following API keys:

### Google Maps Platform API Key
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Create an API key with appropriate restrictions
5. Add the API key to your environment variables

### Stripe API Keys
1. Create a [Stripe account](https://stripe.com)
2. Navigate to the Developers > API keys section
3. Copy your Publishable and Secret keys
4. Add these keys to your environment variables

### OAuth 2.0 Credentials

#### Google OAuth
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services > Credentials
3. Create OAuth 2.0 Client IDs
4. Configure the authorized JavaScript origins and redirect URIs
5. Add the Client ID and Secret to your environment variables

#### Facebook OAuth
1. Go to [Facebook for Developers](https://developers.facebook.com/)
2. Create a new app or use an existing one
3. Add the Facebook Login product
4. Configure the Valid OAuth Redirect URIs
5. Add the App ID and App Secret to your environment variables

## Project Structure

```
├── backend/                # Backend Node.js/Express application
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   └── server.js           # Entry point
│
├── frontend/               # React frontend application
│   ├── public/             # Static files
│   └── src/                # Source files
│       ├── components/     # Reusable components
│       ├── pages/          # Page components
│       ├── utils/          # Utility functions
│       └── App.js          # Main component
│
└── README.md               # Project documentation
```

## License
This project is licensed under the MIT License - see the LICENSE file for details.
// app.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const axios = require('axios');
const { auth, requiresAuth } = require('express-openid-connect');
const app = express();
const port = process.env.PORT || 8000;

// Basic configuration
const config = {
  authRequired: false,
  auth0Logout: false,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  secret: process.env.SECRET, // Change this to a secure random string in production
  clientSecret: process.env.CLIENT_SECRET, // Add your client secret if you have configured one in Keycloak
  authorizationParams: {
    response_type: 'code',
    scope: 'openid profile email offline_access' // Added offline_access to ensure we get the access token
  }
};

// Session middleware
app.use(
  session({
    secret: 'another_secret_for_session', // Change this in production
    resave: false,
    saveUninitialized: true
  })
);

// Auth middleware
app.use(auth(config));

// Set up template engine
app.set('view engine', 'ejs');

// Helper function to safely get token data
function getTokenData(req) {
  return {
    isAuthenticated: req.oidc.isAuthenticated(),
    user: req.oidc.user || {},
    idToken: req.oidc.idToken || null,
    accessToken: req.oidc.accessToken || null
  };
}

// Home route
app.get('/', (req, res) => {
  const tokenData = getTokenData(req);
  
  // Debug log to see what we're dealing with
  console.log("Authentication status:", tokenData.isAuthenticated);
  if (tokenData.accessToken) {
    console.log("Access token available:", !!tokenData.accessToken.access_token);
    console.log("Access token claims:", tokenData.accessToken.claims);
  } else {
    console.log("No access token available");
  }
  
  res.render('index', tokenData);
});

// Profile route (requires authentication)
app.get('/profile', requiresAuth(), (req, res) => {
  const tokenData = getTokenData(req);
  
  // Debug log for profile page
  console.log("Profile page access token:", tokenData.accessToken);
  
  res.render('profile', tokenData);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
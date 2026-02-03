# OAuth Integration - Quick Start Guide

## 📋 Prerequisites

- Node.js v18+ installed
- npm or yarn package manager
- Google Developer Account (for Google OAuth)
- Twitter Developer Account (for Twitter OAuth)

---

## 🚀 5-Minute Setup

### Step 1: Get Google Credentials (3 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
4. Choose **Web application**
5. Add redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Copy **Client ID** and **Client Secret**

### Step 2: Get Twitter Credentials (2 minutes)

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new app
3. Go to **Settings** → **Authentication settings**
4. Enable **3-legged OAuth**
5. Set Callback URL: `http://localhost:5000/api/auth/twitter/callback`
6. Copy **Client ID** and **Client Secret**

### Step 3: Configure Environment

1. Create `.env` file in server directory:

```bash
cat > server/.env << 'EOF'
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/lumina
JWT_SECRET=your-super-secret-key-change-this

CLIENT_URL=http://localhost:5173

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

TWITTER_CLIENT_ID=your-twitter-client-id
TWITTER_CLIENT_SECRET=your-twitter-client-secret
TWITTER_CALLBACK_URL=http://localhost:5000/api/auth/twitter/callback
EOF
```

### Step 4: Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies (if not already done)
cd ../client
npm install
```

### Step 5: Start the Application

```bash
# Terminal 1: Start the server
cd server
npm run dev

# Terminal 2: Start the client
cd client
npm run dev
```

### Step 6: Test OAuth

1. Open http://localhost:5173/login in your browser
2. Click **"Google"** button
3. Follow Google authorization
4. Should redirect to dashboard ✅

Try the same with **"Twitter"** button

---

## ✅ Verification Checklist

- [ ] Server running on http://localhost:5000
- [ ] Client running on http://localhost:5173
- [ ] MongoDB running locally
- [ ] `.env` file has Google credentials
- [ ] `.env` file has Twitter credentials
- [ ] Google button works on /login page
- [ ] Twitter button works on /login page
- [ ] Google button works on /signup page
- [ ] Twitter button works on /signup page
- [ ] Token saved in localStorage after OAuth
- [ ] Redirected to /dashboard on success
- [ ] Error message shown on authorization denial

---

## 🔧 Troubleshooting

### "Google login not configured"

```bash
# Check .env file
cat server/.env | grep GOOGLE

# Make sure both GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set
```

### "Invalid redirect URI"

```bash
# Ensure redirect URI matches exactly in OAuth provider settings
# ❌ Wrong: http://localhost:5000/api/auth/google/callback/
# ✅ Right: http://localhost:5000/api/auth/google/callback
```

### Can't find .env file

```bash
# Create it in the server directory
cd server
nano .env
# Paste the environment variables above
```

### MongoDB connection error

```bash
# Make sure MongoDB is running
mongod

# Or update MONGODB_URI in .env to your MongoDB instance
```

### Vite proxy not working

```bash
# Make sure Vite is running in dev mode
cd client
npm run dev
# Should show: Local: http://localhost:5173
```

---

## 📚 Full Documentation

For more detailed information, see:

- **Setup Guide**: [OAUTH_SETUP_GUIDE.md](OAUTH_SETUP_GUIDE.md)
- **Verification Report**: [OAUTH_VERIFICATION_REPORT.md](OAUTH_VERIFICATION_REPORT.md)
- **Architecture Diagram**: [OAUTH_ARCHITECTURE.md](OAUTH_ARCHITECTURE.md)

---

## 🎯 What Works After Setup

✅ **Login with Google**

- Users can sign in with Google account
- Auto-creates account on first login
- Stores Google user ID in database

✅ **Signup with Google**

- Users can sign up with Google account
- Auto-creates account with Google info
- Pre-fills name and profile picture

✅ **Login with Twitter**

- Users can sign in with Twitter account
- Auto-creates account on first login
- Stores Twitter user ID in database

✅ **Signup with Twitter**

- Users can sign up with Twitter account
- Auto-creates account with Twitter info
- Pre-fills name and profile picture

✅ **Account Linking**

- Same email → Auto-linked to existing account
- Different social providers → Can use both

✅ **Token Management**

- JWT tokens automatically stored
- Sent with every authenticated request
- Auto-refreshes on expiry

✅ **Error Handling**

- Graceful error messages
- Redirects on authorization denial
- Prevents app crashes

---

## 🚀 Next Steps (Optional)

### Production Deployment

1. Update `CLIENT_URL` in `.env` to production domain
2. Update redirect URIs in OAuth provider settings
3. Use strong `JWT_SECRET`
4. Enable HTTPS for all URLs
5. Set `NODE_ENV=production`

### Advanced Features

- Email verification for password reset
- Multi-factor authentication
- Account recovery with social login
- Automatic token refresh
- Logout all devices
- Login history

### Monitoring

- Track failed login attempts
- Monitor OAuth errors
- Log successful authentications
- Alert on suspicious activity

---

## 📞 Support

If you encounter issues:

1. Check the [Troubleshooting Guide](OAUTH_SETUP_GUIDE.md#troubleshooting)
2. Check server logs: `npm run dev`
3. Check client console: Browser DevTools → Console
4. Verify `.env` variables: `cat server/.env`
5. Check OAuth provider settings
6. Verify callback URIs match exactly

---

## 🎓 Learning Resources

- [Google OAuth Flow](https://developers.google.com/identity/protocols/oauth2)
- [Twitter OAuth v2](https://developer.twitter.com/en/docs/authentication/oauth-2-0)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Security Guidelines](https://cheatsheetseries.owasp.org/)

---

**Estimated Setup Time**: 5-10 minutes ⏱️
**Difficulty Level**: ⭐ Easy
**Status**: ✅ Ready to use

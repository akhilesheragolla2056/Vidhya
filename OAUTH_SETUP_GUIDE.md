# Google and Twitter OAuth Integration Guide

This guide explains how to integrate Google and Twitter OAuth authentication into your Vidhya application.

## Overview

The authentication flow allows users to sign in and create accounts using their Google or Twitter credentials. The implementation uses:

- **Google Auth Library** for OAuth 2.0 authentication
- **Twitter API v2** for OAuth 2.0 authentication
- JWT tokens for session management
- Automatic user account creation on first social login

## Setup Instructions

### 1. Google OAuth Setup

#### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the **Google+ API** and **Google Identity Services**

#### Step 2: Create OAuth 2.0 Credentials

1. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
2. Choose **Web application**
3. Add authorized redirect URIs:
   - Development: `http://localhost:5000/api/auth/google/callback`
   - Production: `https://yourdomain.com/api/auth/google/callback`
4. Copy the **Client ID** and **Client Secret**

#### Step 3: Add to .env

```env
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

---

### 2. Twitter OAuth Setup

#### Step 1: Create a Twitter Developer Account

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new app under your project
3. Go to **Settings** → **Authentication settings**
4. Enable **3-legged OAuth** and **Request email address from users**

#### Step 2: Configure OAuth Redirect URLs

1. Set the **Callback URL**:

   - Development: `http://localhost:5000/api/auth/twitter/callback`
   - Production: `https://yourdomain.com/api/auth/twitter/callback`

2. Set the **Website URL** to your application URL

#### Step 3: Get API Credentials

1. Go to **Keys and tokens**
2. Generate or retrieve:
   - **Client ID**
   - **Client Secret**

#### Step 4: Add to .env

```env
TWITTER_CLIENT_ID=your-twitter-client-id
TWITTER_CLIENT_SECRET=your-twitter-client-secret
TWITTER_CALLBACK_URL=http://localhost:5000/api/auth/twitter/callback
```

---

## API Endpoints

### Google Login

- **Start OAuth**: `GET /api/auth/google?redirect=<optional-redirect-url>`
- **Callback**: `GET /api/auth/google/callback?code=<auth-code>&state=<state>`

### Twitter Login

- **Start OAuth**: `GET /api/auth/twitter?redirect=<optional-redirect-url>`
- **Callback**: `GET /api/auth/twitter/callback?code=<auth-code>&state=<state>`

### Response Format

Both endpoints return a redirect to the callback URL with the JWT token:

```
/auth/callback?token=<jwt-token>
```

Or in case of error:

```
/auth/callback?error=<error-message>
```

---

## Frontend Implementation

### Login/Signup Pages

The OAuth buttons are already integrated into:

- `client/src/pages/Login.jsx`
- `client/src/pages/Signup.jsx`

Click handlers call `startOAuth(provider)` from `client/src/services/api.js`.

### Callback Handler

The callback page handles the OAuth response:

- **Route**: `/auth/callback`
- **File**: `client/src/pages/AuthCallback.jsx`
- Extracts the token from URL parameters
- Stores token in localStorage
- Redirects to dashboard on success

### Helper Functions

In `client/src/services/api.js`:

- `buildOAuthUrl(provider, redirectUri)` - Builds the OAuth start URL
- `startOAuth(provider, redirectUri)` - Redirects to OAuth provider

---

## Database Changes

### User Model Updates

The `socialConnections` field in the User model now includes:

```javascript
socialConnections: {
  google: String,      // Google user ID
  github: String,      // Existing field
  twitter: String,     // New field for Twitter user ID
}
```

### Automatic User Creation

When a user logs in with OAuth for the first time:

1. System checks if user exists by email or social ID
2. If not found, creates new user with:
   - Auto-generated secure password
   - OAuth provider ID linked
   - Avatar from provider profile (if available)
   - Verified email status

---

## Testing

### Local Development

1. Install dependencies:

   ```bash
   cd server
   npm install
   cd ../client
   npm install
   ```

2. Start the server:

   ```bash
   cd server
   npm run dev
   ```

3. Start the client:

   ```bash
   cd client
   npm run dev
   ```

4. Test OAuth:
   - Go to http://localhost:5173/login
   - Click "Google" or "Twitter" button
   - Follow the OAuth flow
   - Should be redirected back with a token

### Testing with ngrok (for local webhook testing)

```bash
ngrok http 5000
# Use the provided ngrok URL for redirect URIs in OAuth settings
```

---

## Production Deployment

### Environment Variables

Update these for production:

- `CLIENT_URL` - Your production domain
- `GOOGLE_CALLBACK_URL` - Production callback URL
- `TWITTER_CALLBACK_URL` - Production callback URL
- `JWT_SECRET` - Strong random secret

### Security Checklist

- [ ] Update `CLIENT_URL` to production domain
- [ ] Use HTTPS for all callback URLs
- [ ] Set strong `JWT_SECRET`
- [ ] Enable CORS only for your domain
- [ ] Rotate OAuth credentials periodically
- [ ] Monitor failed login attempts
- [ ] Use environment variables for all secrets

---

## Troubleshooting

### "Google login not configured"

- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
- Check `.env` file is loaded correctly

### "Invalid or expired login session" (Twitter)

- OAuth state expires after ~10 minutes
- User took too long to authorize
- Ask user to try again

### Redirect URI mismatch

- Ensure callback URL matches exactly in OAuth provider settings
- Check for trailing slashes
- Verify protocol (http vs https)

### CORS errors

- Check `CLIENT_URL` matches your frontend domain
- Ensure CORS headers are correct in server

### Users not being created

- Check MongoDB connection
- Verify user model has `socialConnections` field
- Check server logs for error messages

---

## Best Practices

1. **Use HTTPS in production** - OAuth requires secure connections
2. **Rotate secrets regularly** - Change client secrets periodically
3. **Validate state parameter** - Prevents CSRF attacks
4. **Rate limit OAuth endpoints** - Prevent brute force attacks
5. **Log authentication events** - For security audit trails
6. **Handle errors gracefully** - Show user-friendly error messages
7. **Refresh tokens** - Implement token refresh for long sessions

---

## Additional Resources

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Twitter OAuth v2 Documentation](https://developer.twitter.com/en/docs/authentication/oauth-2-0)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP OAuth Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/OAuth_2_0_Security_Cheat_Sheet.html)

---

## Support

For issues or questions, please refer to:

1. Server logs for OAuth errors
2. Browser console for client-side errors
3. OAuth provider's documentation
4. GitHub Issues in the repository

# OAuth Integration Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT (React)                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Login.jsx / Signup.jsx                                              │
│  ┌────────────────────────────────────────┐                         │
│  │ Google Button   │   Twitter Button      │                        │
│  │   onClick:      │   onClick:            │                        │
│  │ handleSocial    │   handleSocial        │                        │
│  │ Login('google') │   Login('twitter')    │                        │
│  └────────────────────────────────────────┘                         │
│              │                      │                                │
│              └──────────┬───────────┘                                │
│                         │                                            │
│                         ↓                                            │
│         services/api.js - startOAuth()                              │
│         • Calls buildOAuthUrl(provider)                             │
│         • Redirects to /api/auth/{provider}                         │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP Redirect
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                   SERVER (Node.js/Express)                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  routes/auth.js                                                      │
│                                                                       │
│  GET /api/auth/google                                               │
│  ├─ Validate client credentials                                     │
│  ├─ Generate state param (base64 encoded redirect URL)              │
│  └─ Redirect to Google OAuth endpoint                               │
│      └─ User authorizes app                                         │
│                                                                      │
│  GET /api/auth/google/callback                                      │
│  ├─ Extract code from query                                         │
│  ├─ Exchange code for tokens (Google API)                           │
│  ├─ Verify ID token and extract user info                           │
│  ├─ Call upsertOAuthUser()                                          │
│  │  ├─ Check if user exists by email or social ID                  │
│  │  ├─ Create new user if needed                                    │
│  │  ├─ Update social connection if exists                           │
│  │  └─ Return user object                                           │
│  ├─ Generate JWT token                                              │
│  └─ Redirect to /auth/callback?token=<jwt>                          │
│                                                                      │
│  GET /api/auth/twitter                                              │
│  ├─ Validate client credentials                                     │
│  ├─ Generate OAuth2 auth link with PKCE                             │
│  ├─ Store state + codeVerifier in twitterAuthStore Map              │
│  └─ Redirect to Twitter OAuth endpoint                              │
│      └─ User authorizes app                                         │
│                                                                      │
│  GET /api/auth/twitter/callback                                     │
│  ├─ Extract code and state from query                               │
│  ├─ Retrieve codeVerifier from twitterAuthStore                     │
│  ├─ Exchange code for tokens (Twitter API)                          │
│  ├─ Fetch user profile with v2.me()                                 │
│  ├─ Call upsertOAuthUser()                                          │
│  │  ├─ Check if user exists by email or social ID                  │
│  │  ├─ Create new user if needed                                    │
│  │  ├─ Update social connection if exists                           │
│  │  └─ Return user object                                           │
│  ├─ Generate JWT token                                              │
│  └─ Redirect to /auth/callback?token=<jwt>                          │
│                                                                      │
│  Database (MongoDB)                                                  │
│  User Schema:                                                        │
│  ├─ name                                                            │
│  ├─ email                                                           │
│  ├─ password (hashed, random for OAuth users)                       │
│  ├─ avatar (from OAuth provider)                                    │
│  ├─ socialConnections: {                                            │
│  │  ├─ google: String (Google user ID)                              │
│  │  ├─ twitter: String (Twitter user ID)                            │
│  │  └─ github: String (existing field)                              │
│  ├─ isVerified: Boolean (true for OAuth users)                      │
│  └─ Other fields...                                                 │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ Redirect with token
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT (React)                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  pages/AuthCallback.jsx                                              │
│  ┌────────────────────────────────────────┐                         │
│  │ useEffect hook                         │                         │
│  │ ├─ Extract token from URL params       │                         │
│  │ ├─ Extract error from URL params       │                         │
│  │ ├─ localStorage.setItem('token')       │                         │
│  │ ├─ dispatch(loginSuccess())            │                         │
│  │ └─ navigate('/dashboard')              │                         │
│  │    OR                                  │                         │
│  │ └─ navigate('/login', { error })       │                         │
│  └────────────────────────────────────────┘                         │
│              │                                                       │
│              ├─ Redux Store (loginSuccess)                          │
│              │  ├─ isAuthenticated = true                           │
│              │  ├─ isLoading = false                                │
│              │  └─ error = null                                     │
│              │                                                       │
│              └─ Axios Interceptor                                   │
│                 ├─ Adds Authorization header                        │
│                 └─ Token sent with all future requests              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Sequence

### Google OAuth Flow

```
1. User clicks Google button
   └─> startOAuth('google')
       └─> window.location = '/api/auth/google?redirect=...'

2. Server GET /api/auth/google
   └─> Redirect to Google OAuth consent screen

3. User authorizes app

4. Google redirects to GET /api/auth/google/callback?code=xxx&state=yyy
   └─> Server verifies code with Google
   └─> Extracts user info (email, name, picture, sub)
   └─> upsertOAuthUser() with provider='google'
   └─> Redirect to /auth/callback?token=<jwt>

5. Client receives redirect
   └─> AuthCallback.jsx processes token
   └─> Stores in localStorage
   └─> Dispatches loginSuccess()
   └─> Redirects to /dashboard
```

### Twitter OAuth v2 Flow

```
1. User clicks Twitter button
   └─> startOAuth('twitter')
       └─> window.location = '/api/auth/twitter?redirect=...'

2. Server GET /api/auth/twitter
   └─> Generate OAuth2 auth link with PKCE
   └─> Save state + codeVerifier in twitterAuthStore
   └─> Redirect to Twitter OAuth consent screen

3. User authorizes app

4. Twitter redirects to GET /api/auth/twitter/callback?code=xxx&state=yyy
   └─> Server retrieves codeVerifier from twitterAuthStore
   └─> Verifies code with Twitter
   └─> Fetches user profile (id, name, username, profile_image_url)
   └─> upsertOAuthUser() with provider='twitter'
   └─> Redirect to /auth/callback?token=<jwt>

5. Client receives redirect
   └─> AuthCallback.jsx processes token
   └─> Stores in localStorage
   └─> Dispatches loginSuccess()
   └─> Redirects to /dashboard
```

---

## Security Features

### ✅ State Parameter Protection

- Prevents CSRF attacks
- Encodes redirect URL for safe redirect
- Base64URL encoded

### ✅ PKCE (Twitter Only)

- Code Verifier + Code Challenge
- Prevents authorization code interception
- Stored securely server-side

### ✅ Token Validation

- Google: ID token verification with audience check
- JWT: Signed with server secret
- 7-day expiration

### ✅ Secure User Creation

- Random secure password for OAuth accounts
- Email verified by default
- Social ID linked for account recovery

### ✅ Rate Limiting

- Express rate-limit middleware
- 100 requests per 15 minutes per IP
- Applies to all /api routes

---

## Environment Variables

```bash
# Google OAuth
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Twitter OAuth v2
TWITTER_CLIENT_ID=xxx
TWITTER_CLIENT_SECRET=xxx
TWITTER_CALLBACK_URL=http://localhost:5000/api/auth/twitter/callback

# App URLs
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000

# JWT
JWT_SECRET=your-super-secret-key
```

---

## Error Handling

### Client Side

- OAuth errors redirected to /login with error message
- Network errors caught and displayed
- Invalid OAuth responses handled gracefully

### Server Side

- Missing credentials validation
- Invalid state parameter handling (Twitter)
- Code exchange failures
- User creation errors
- Database connection errors

### Error Propagation

```
OAuth Provider Error
    ↓
Server catches and encodes in URL
    ↓
Client extracts and displays
    ↓
User redirected to login with error message
```

---

## Troubleshooting Flow

```
User sees error → Check browser console → Check server logs
                                       ↓
                              Check .env variables
                                       ↓
                              Check OAuth provider settings
                                       ↓
                              Check redirect URIs
                                       ↓
                              Check CORS settings
```

---

## Testing Scenarios

### Scenario 1: New User - Google

1. Click Google button
2. Authorize with new Google account
3. ✅ User created in database
4. ✅ Redirected to dashboard
5. ✅ Token stored in localStorage

### Scenario 2: Existing User - Google

1. Click Google button
2. Authorize with same Google account
3. ✅ User logged in (not duplicated)
4. ✅ Redirected to dashboard
5. ✅ Token stored in localStorage

### Scenario 3: New User - Twitter

1. Click Twitter button
2. Authorize with new Twitter account
3. ✅ User created in database
4. ✅ Redirected to dashboard
5. ✅ Token stored in localStorage

### Scenario 4: Authorization Denied

1. Click OAuth button
2. User clicks "Deny" or "Cancel"
3. ✅ Error message displayed
4. ✅ Redirected to login page
5. ✅ No user created

### Scenario 5: Invalid OAuth Code

1. Manually navigate to callback with invalid code
2. ✅ Error message displayed
3. ✅ Redirected to login page
4. ✅ No user created

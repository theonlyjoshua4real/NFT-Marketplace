# JWT Authentication Implementation Guide

## Overview

This guide documents the complete implementation of JWT (JSON Web Token) authentication in our NFT marketplace application. We implemented a React Context-based authentication system with automatic token management and axios interceptors.

## 🎯 What We Implemented

### 1. **React Context for Global Auth State**
- **File**: `frontend/src/contexts/AuthContext.jsx`
- **Purpose**: Centralized authentication state management
- **Features**:
  - Global auth state accessible throughout the app
  - Automatic token persistence in localStorage
  - Login/logout functions
  - User data management

### 2. **App-Level Auth Provider**
- **File**: `frontend/src/App.jsx`
- **Changes**: Wrapped entire app with `AuthProvider`
- **Result**: All components now have access to auth state

### 3. **Enhanced Login Component**
- **File**: `frontend/src/pages/Login.jsx`
- **Improvements**:
  - Uses `useAuth` hook instead of manual localStorage
  - Immediate redirect after successful login
  - Loading states during authentication
  - Redirects if user is already logged in
  - Better error handling

### 4. **Dynamic Navbar**
- **File**: `frontend/src/components/Navbar/Navbar.jsx`
- **Features**:
  - Shows user info when logged in
  - Proper logout functionality
  - Dynamic menu based on authentication state
  - User name/email display in dropdown

### 5. **Axios Interceptor for Token Management**
- **File**: `frontend/src/utils/axios.js`
- **Features**:
  - Automatic token inclusion in all API requests
  - Automatic logout on 401 (unauthorized) responses
  - Centralized API configuration
  - Error handling for expired tokens

## 🔧 Technical Implementation Details

### AuthContext Structure

```javascript
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored token on app startup
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isLoading,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Axios Interceptor Configuration

```javascript
// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 🔄 Authentication Flow

### 1. **User Login Process**
```
User enters credentials → API call to backend → 
Backend validates → Returns JWT token + user data → 
AuthContext stores token & user → Navbar updates → 
User redirected to home page
```

### 2. **Token Persistence**
```
App starts → AuthContext checks localStorage → 
If token exists → Restore user state → 
Navbar shows logged-in state
```

### 3. **API Request Flow**
```
Component makes API call → Axios interceptor → 
Adds Authorization header → Backend validates token → 
Returns response or 401 error
```

### 4. **Logout Process**
```
User clicks logout → AuthContext clears state → 
localStorage cleared → Navbar updates → 
User sees login/register options
```

## 🛡️ Security Features

### 1. **Token Management**
- ✅ Automatic token storage in localStorage
- ✅ Automatic token inclusion in API requests
- ✅ Automatic cleanup on logout
- ✅ Automatic logout on token expiration

### 2. **Error Handling**
- ✅ Invalid token cleanup
- ✅ Network error handling
- ✅ User-friendly error messages
- ✅ Automatic redirect on auth failures

### 3. **User Experience**
- ✅ Loading states during authentication
- ✅ Immediate feedback on login/logout
- ✅ Persistent login state across browser sessions
- ✅ Automatic redirects based on auth state

## 📁 File Structure

```
frontend/src/
├── contexts/
│   └── AuthContext.jsx          # Global auth state management
├── utils/
│   └── axios.js                 # Axios configuration with interceptors
├── components/
│   └── Navbar/
│       └── Navbar.jsx           # Updated with auth state
├── pages/
│   └── Login.jsx                # Updated to use AuthContext
└── App.jsx                      # Wrapped with AuthProvider
```

## 🎯 Benefits of This Implementation

### 1. **Centralized State Management**
- Single source of truth for auth state
- Easy to access from any component
- Consistent behavior across the app

### 2. **Automatic Token Handling**
- No manual token management required
- Automatic inclusion in API requests
- Automatic cleanup on errors

### 3. **Better User Experience**
- Persistent login state
- Immediate feedback
- Smooth transitions

### 4. **Security**
- Proper token storage
- Automatic logout on expiration
- Clean error handling

## 🔮 Next Steps (Optional Enhancements)

### 1. **Protected Routes**
```javascript
// Create ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return children;
};
```

### 2. **Token Refresh**
```javascript
// Add refresh token logic
const refreshToken = async () => {
  try {
    const response = await api.post('/api/auth/refresh');
    login(response.data.user, response.data.token);
  } catch (error) {
    logout();
  }
};
```

### 3. **User Profile Management**
```javascript
// Add profile update functionality
const updateProfile = async (userData) => {
  const response = await api.put('/api/user/profile', userData);
  setUser(response.data.user);
};
```

## 🧪 Testing the Implementation

### 1. **Login Test**
1. Navigate to `/login`
2. Enter valid credentials
3. Verify immediate redirect to home
4. Check navbar shows user info

### 2. **Logout Test**
1. Click user menu in navbar
2. Click logout
3. Verify navbar shows login/register options
4. Check localStorage is cleared

### 3. **Token Persistence Test**
1. Login successfully
2. Refresh the page
3. Verify user remains logged in
4. Check navbar still shows user info

### 4. **API Call Test**
1. Login successfully
2. Make an API call to protected endpoint
3. Verify token is automatically included
4. Check response is successful

## 🚨 Common Issues & Solutions

### Issue 1: Token Not Being Sent
**Solution**: Ensure using the configured axios instance (`api`) instead of direct axios

### Issue 2: Auth State Not Persisting
**Solution**: Check localStorage for token/user data and AuthContext initialization

### Issue 3: Infinite Redirects
**Solution**: Add proper loading states and auth state checks

### Issue 4: CORS Issues
**Solution**: Ensure backend CORS configuration matches frontend URL

## 📚 Key Concepts

### JWT (JSON Web Token)
- Stateless authentication mechanism
- Contains user information and expiration
- Signed by server to prevent tampering

### React Context
- Provides global state without prop drilling
- Allows components to access shared data
- Automatic re-renders when state changes

### Axios Interceptors
- Middleware for HTTP requests/responses
- Automatic token inclusion
- Centralized error handling

This implementation provides a robust, secure, and user-friendly authentication system that can be easily extended with additional features as needed. 
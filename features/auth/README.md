# Auth Feature

Authentication feature với login, logout, và user management.

## 📁 Cấu trúc

```
features/auth/
├── api.ts           # API calls (login, logout, getProfile)
├── types.ts         # Auth types (LoginDto, AuthUser, etc.)
├── hooks-simple.ts  # React hooks (useAuth, useCurrentUser)
└── index.ts         # Exports
```

## 🚀 Cách sử dụng

### Login

```typescript
'use client';
import { useAuth } from '@/features/auth';

export default function LoginPage() {
  const { loginState, updateField, handleLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin('student'); // hoặc 'teacher', 'admin'
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={loginState.email}
        onChange={(e) => updateField('email', e.target.value)}
      />
      <input
        type="password"
        value={loginState.password}
        onChange={(e) => updateField('password', e.target.value)}
      />
      <button disabled={loginState.isLoading}>
        {loginState.isLoading ? 'Logging in...' : 'Login'}
      </button>
      {loginState.error && <p>{loginState.error}</p>}
    </form>
  );
}
```

### Get Current User

```typescript
'use client';
import { useCurrentUser } from '@/features/auth';

export default function ProfilePage() {
  const { user, loading, logout } = useCurrentUser();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not logged in</div>;

  return (
    <div>
      <h1>{user.fullName}</h1>
      <p>{user.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Logout

```typescript
import { useLogout } from '@/features/auth';

function LogoutButton() {
  const { logout, loading } = useLogout();

  return (
    <button onClick={logout} disabled={loading}>
      {loading ? 'Logging out...' : 'Logout'}
    </button>
  );
}
```

### Change Password

```typescript
import { useChangePassword } from '@/features/auth';

function ChangePasswordForm() {
  const { changePassword, loading, error, success } = useChangePassword();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await changePassword(oldPassword, newPassword);
    if (success) {
      alert('Password changed!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      {error && <p>{error}</p>}
      {success && <p>Password changed successfully!</p>}
    </form>
  );
}
```

## 🔐 Auth Storage

```typescript
import { authStorage } from '@/features/auth';

// Save/get token
authStorage.saveToken('your-token');
const token = authStorage.getToken();

// Save/get user
authStorage.saveUser(user);
const user = authStorage.getUser();

// Clear all
authStorage.clear();
```

## 🎯 API Methods

```typescript
import { authApi } from '@/features/auth';

// Login
const response = await authApi.login({ email, password });

// Logout
await authApi.logout();

// Get profile
const profile = await authApi.getProfile();

// Refresh token
const newToken = await authApi.refreshToken();

// Change password
await authApi.changePassword(oldPassword, newPassword);
```

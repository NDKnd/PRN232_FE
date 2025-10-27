# 🚀 Hướng dẫn sử dụng API

## 📁 Cấu trúc sau khi dọn dẹp

```
math-education-app/
├── lib/api/              # ⚙️ Core API
│   ├── client.ts         # API client chính
│   ├── endpoints.ts      # Tất cả các endpoint
│   └── index.ts          # Exports
│
├── features/users/       # 👥 Feature Users (ví dụ)
│   ├── api.ts           # API methods cho users
│   ├── types.ts         # Types và DTOs
│   ├── hooks-simple.ts  # React hooks
│   └── index.ts         # Export tất cả
│
└── app/                  # Next.js pages
```

## 🎯 Cách hoạt động

### 1️⃣ **API Client** (`lib/api/client.ts`)

Đây là "trái tim" của hệ thống API:

```typescript
// Xử lý tất cả HTTP requests
export const apiClient = {
  get<T>(url: string),      // GET request
  post<T>(url: string, data), // POST request
  put<T>(url: string, data),  // PUT request
  delete<T>(url: string)     // DELETE request
}
```

**Tính năng:**
- ✅ Tự động thêm `Authorization` header (Bearer token)
- ✅ Timeout 10 giây
- ✅ Error handling tự động
- ✅ Response format chuẩn

**Response Format:**
```typescript
{
  success: boolean,
  data?: T,                    // Dữ liệu trả về
  error?: { code, message },   // Lỗi (nếu có)
  pagination?: { ... }         // Phân trang (nếu có)
}
```

---

### 2️⃣ **Endpoints** (`lib/api/endpoints.ts`)

Tập trung tất cả URL endpoints:

```typescript
export const ENDPOINTS = {
  USERS: {
    BASE: '/users',
    BY_ID: (id: number) => `/users/${id}`,
    BY_ROLE: (role: number) => `/users/role/${role}`,
    // ...
  },
  // AUTH, LESSONS, QUIZZES, etc...
}
```

**Lợi ích:**
- ✅ Không hardcode URL khắp nơi
- ✅ Dễ thay đổi endpoint
- ✅ Type-safe với TypeScript

---

### 3️⃣ **Feature Module** (`features/users/`)

Mỗi feature có 4 file:

#### **a) `api.ts`** - Pure API calls

```typescript
export const userApi = {
  getAll: (page, limit) => apiClient.get(ENDPOINTS.USERS.BASE),
  getById: (id) => apiClient.get(ENDPOINTS.USERS.BY_ID(id)),
  create: (data) => apiClient.post(ENDPOINTS.USERS.BASE, data),
  // ...
}
```

#### **b) `types.ts`** - TypeScript types

```typescript
export interface User {
  userId: number;
  username: string;
  email: string;
  // ...
}

export interface CreateUserDto {
  username: string;
  password: string;
  // ...
}
```

#### **c) `hooks-simple.ts`** - React hooks

```typescript
export function useUsers(page = 1, limit = 10) {
  const [data, setData] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch data từ API
  // Return: { data, loading, error, refetch }
}
```

#### **d) `index.ts`** - Public exports

```typescript
export { userApi } from './api';
export type { User, CreateUserDto } from './types';
export { useUsers, useCreateUser } from './hooks-simple';
```

---

## 💡 Cách sử dụng

### **Option 1: Dùng API trực tiếp** (Server-side, API routes)

```typescript
import { userApi } from '@/features/users';

// Trong API route hoặc server component
const result = await userApi.getAll(1, 10);

if (result.success) {
  console.log(result.data); // User[]
} else {
  console.error(result.error?.message);
}
```

### **Option 2: Dùng Hooks** (Client-side, React components)

```typescript
'use client';
import { useUsers, useCreateUser } from '@/features/users';

export default function UsersPage() {
  // Lấy danh sách users
  const { data: users, loading, error } = useUsers(1, 10);
  
  // Tạo user mới
  const { mutate: createUser } = useCreateUser();
  
  const handleCreate = async () => {
    const response = await createUser({
      username: 'newuser',
      email: 'user@email.com',
      password: '123456',
      // ...
    });
    
    if (response.success) {
      alert('User created!');
    }
  };
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <button onClick={handleCreate}>Create User</button>
      <ul>
        {users?.map(user => (
          <li key={user.userId}>{user.fullName}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 🔧 Setup

### 1. Tạo file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_API_TIMEOUT=10000
```

### 2. Đảm bảo `tsconfig.json` có path aliases:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### 3. Sử dụng trong code:

```typescript
// ✅ Import từ feature
import { userApi, User, useUsers } from '@/features/users';

// ❌ KHÔNG import từ nơi khác
// import { User } from '@/types/backend.types'; // File này đã xóa
```

---

## 🔄 Flow hoạt động

```
Component
    ↓
  useUsers() hook
    ↓
  userApi.getAll()
    ↓
  apiClient.get()
    ↓
  fetch(API_URL + endpoint)
    ↓
  Backend API
    ↓
  Response { success, data, error }
    ↓
  Hook updates state
    ↓
  Component re-renders
```

---

## 🎨 Best Practices

### ✅ DO:
```typescript
// Import tất cả từ feature
import { userApi, User, useUsers } from '@/features/users';

// Check success trước khi dùng data
const result = await userApi.getAll();
if (result.success) {
  console.log(result.data);
}

// Dùng hooks trong client components
'use client';
const { data, loading } = useUsers();
```

### ❌ DON'T:
```typescript
// Không hardcode URLs
fetch('http://localhost:5000/api/users'); // ❌

// Không import từ nhiều nơi
import { User } from '@/types/backend.types'; // ❌ (file đã xóa)

// Không bỏ qua error handling
const result = await userApi.getAll();
console.log(result.data); // ❌ data có thể undefined
```

---

## 📚 Mở rộng cho features khác

Khi cần thêm feature mới (ví dụ: lessons, quizzes):

1. Tạo folder `features/lessons/`
2. Copy cấu trúc từ `features/users/`:
   - `api.ts` - API methods
   - `types.ts` - Types
   - `hooks-simple.ts` - Hooks
   - `index.ts` - Exports
3. Thay đổi logic cho phù hợp với feature

---

## 🆘 Troubleshooting

**Q: API trả về 401 Unauthorized?**
```typescript
// Check token trong localStorage
localStorage.getItem('token');

// Đăng nhập lại để lấy token mới
```

**Q: CORS error?**
```typescript
// Backend cần enable CORS cho frontend domain
// Hoặc dùng proxy trong next.config.mjs
```

**Q: Timeout error?**
```typescript
// Tăng timeout trong .env.local
NEXT_PUBLIC_API_TIMEOUT=30000
```

---

## 📞 Liên hệ

Nếu có thắc mắc, xem thêm:
- `docs/API_STRUCTURE.md` - Chi tiết cấu trúc
- `docs/MIGRATION_GUIDE.md` - Hướng dẫn migration

**Happy Coding! 🎉**

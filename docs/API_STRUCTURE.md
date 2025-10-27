# Math Education App - API Integration Guide

## 📁 Cấu trúc dự án mới (Tái tổ chức)

```
math-education-app/
├── lib/                          # Core utilities
│   └── api/                      # API client
│       ├── client.ts             # API client với error handling
│       ├── endpoints.ts          # Endpoint definitions
│       └── index.ts              # Exports
│
├── features/                     # Feature-based organization
│   ├── users/                    # User management feature
│   │   ├── api.ts               # User API calls
│   │   ├── types.ts             # User types & DTOs
│   │   ├── hooks-simple.ts      # React hooks (no external deps)
│   │   └── index.ts             # Feature exports
│   │
│   ├── lessons/                  # Lesson management feature
│   ├── quizzes/                  # Quiz management feature
│   └── analytics/                # Analytics feature
│
├── components/                   # Shared UI components
├── hooks/                        # Shared hooks
├── types/                        # Global types
└── utils/                        # Helper functions
```

## 🎯 Ưu điểm của cấu trúc mới

### 1. **Feature-based Organization**
- Mỗi feature có tất cả code liên quan trong một folder
- Dễ tìm kiếm và maintain
- Có thể tái sử dụng toàn bộ feature

### 2. **Centralized API Client**
- Một API client duy nhất với error handling
- Authentication tự động
- Timeout handling
- Type-safe với TypeScript

### 3. **Clear Separation of Concerns**
- **API Layer**: Pure API calls, không có logic UI
- **Hooks Layer**: React integration, state management
- **Types Layer**: Type definitions riêng biệt
- **Components**: UI components thuần

### 4. **No External Dependencies** (Optional)
- `hooks-simple.ts`: Hooks không cần React Query
- Giảm bundle size
- Dễ hiểu cho người mới

## 🚀 Cách sử dụng

### 1. Setup API Configuration

Tạo file `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_API_TIMEOUT=10000
```

### 2. Import và sử dụng

#### Cách 1: Sử dụng API trực tiếp

```typescript
import { userApi } from '@/features/users';

// In server component or API route
const users = await userApi.getAll(1, 10);
if (users.success) {
  console.log(users.data);
}
```

#### Cách 2: Sử dụng Hooks trong React Component

```typescript
'use client';

import { useUsers, useCreateUser, UserRole } from '@/features/users';

export default function UsersPage() {
  const { data: users, loading, error } = useUsers(1, 10);
  const { mutate: createUser, loading: creating } = useCreateUser();

  const handleCreate = async () => {
    const response = await createUser({
      username: 'newuser',
      email: 'user@example.com',
      password: 'password123',
      fullName: 'New User',
      levelId: 1,
      role: UserRole.Student,
    });

    if (response.success) {
      console.log('User created!');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Users</h1>
      <button onClick={handleCreate} disabled={creating}>
        Create User
      </button>
      <ul>
        {users?.map(user => (
          <li key={user.userId}>{user.fullName}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 3. Path Aliases

Trong `tsconfig.json`, đảm bảo có:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/lib/*": ["./lib/*"],
      "@/features/*": ["./features/*"],
      "@/components/*": ["./components/*"]
    }
  }
}
```

## 📚 API Reference

### Users Feature

#### API Methods

```typescript
import { userApi } from '@/features/users';

// Get all users
await userApi.getAll(page, limit);

// Get by ID
await userApi.getById(userId);

// Create user
await userApi.create(userData);

// Update user
await userApi.update(userId, updateData);

// Delete user
await userApi.delete(userId);

// Get by role
await userApi.getByRole(UserRole.Student);

// Get by level
await userApi.getByLevel(levelId);
```

#### React Hooks

```typescript
import { 
  useUsers, 
  useUser, 
  useUsersByRole,
  useCreateUser,
  useUpdateUser,
  useDeleteUser 
} from '@/features/users';

// In component
const { data, loading, error, refetch } = useUsers(1, 10);
const { data: user } = useUser(userId);
const { mutate: createUser } = useCreateUser();
```

## 🔄 Migration từ cấu trúc cũ

### Trước (Old)

```typescript
import { UserService } from '../services/user.service';
import { User } from '../types/backend.types';

const users = await UserService.getAllUsers();
```

### Sau (New)

```typescript
import { userApi, User } from '@/features/users';

const users = await userApi.getAll();
```

## 🎨 Best Practices

### 1. **Feature Structure**

Mỗi feature nên có:
- `api.ts`: API calls
- `types.ts`: Type definitions
- `hooks-simple.ts`: React hooks
- `index.ts`: Public exports
- `README.md`: Feature documentation (optional)

### 2. **Type Safety**

```typescript
// Always use types from feature
import type { User, CreateUserDto } from '@/features/users';

// Not from global types
// ❌ import type { User } from '@/types/backend.types';
```

### 3. **Error Handling**

```typescript
const response = await userApi.create(data);

if (response.success) {
  // Handle success
  console.log(response.data);
} else {
  // Handle error
  console.error(response.error?.message);
}
```

### 4. **Loading States**

```typescript
const { data, loading, error } = useUsers();

if (loading) return <Loading />;
if (error) return <Error message={error} />;
if (!data) return <NoData />;

return <UserList users={data} />;
```

## 📝 Next Steps

1. ✅ Users feature (Completed)
2. ⏳ Lessons feature (TODO)
3. ⏳ Quizzes feature (TODO)
4. ⏳ Analytics feature (TODO)

## 🤝 Contributing

Khi thêm feature mới:

1. Tạo folder trong `features/`
2. Tạo các file: `api.ts`, `types.ts`, `hooks-simple.ts`, `index.ts`
3. Export tất cả từ `index.ts`
4. Update documentation

## 📞 Support

Nếu có vấn đề, tạo issue hoặc liên hệ team.

# Migration Guide: Old Structure → New Structure

## 📋 Tổng quan

Tài liệu này hướng dẫn migration từ cấu trúc cũ (service-based) sang cấu trúc mới (feature-based).

## 🔄 Thay đổi chính

### 1. File Organization

#### Trước (Old)

```
├── services/
│   ├── api.config.ts
│   ├── user.service.ts
│   ├── lesson.service.ts
│   └── quiz.service.ts
├── types/
│   └── backend.types.ts
└── hooks/
    └── useApi.ts
```

#### Sau (New)

```
├── lib/api/
│   ├── client.ts          # Centralized API client
│   └── endpoints.ts       # All endpoints
└── features/
    ├── users/
    │   ├── api.ts
    │   ├── types.ts
    │   ├── hooks-simple.ts
    │   └── index.ts
    ├── lessons/
    └── quizzes/
```

## 📝 Migration Steps

### Step 1: Update Imports

#### Users

**Trước:**

```typescript
import { UserService } from '@/services/user.service';
import { User, UserRole } from '@/types/backend.types';

const users = await UserService.getAllUsers(1, 10);
```

**Sau:**

```typescript
import { userApi, User, UserRole } from '@/features/users';

const result = await userApi.getAll(1, 10);
if (result.success) {
  const users = result.data;
}
```

#### Lessons

**Trước:**

```typescript
import { LessonService } from '@/services/lesson.service';
import { LessonPlan } from '@/types/backend.types';

const plans = await LessonService.getAllLessonPlans();
```

**Sau:**

```typescript
import { lessonApi, LessonPlan } from '@/features/lessons';

const result = await lessonApi.getLessonPlans(1, 10);
```

#### Quizzes

**Trước:**

```typescript
import { QuizService } from '@/services/quiz.service';
import { Quiz } from '@/types/backend.types';

const quiz = await QuizService.getQuizById(1);
```

**Sau:**

```typescript
import { quizApi, Quiz } from '@/features/quizzes';

const result = await quizApi.getById(1);
```

### Step 2: Update React Components

#### Example: UserList Component

**Trước:**

```typescript
'use client';

import { useState, useEffect } from 'react';
import { UserService } from '@/services/user.service';
import { User } from '@/types/backend.types';

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    UserService.getAllUsers(1, 10).then(response => {
      setUsers(response.data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.userId}>{user.fullName}</li>
      ))}
    </ul>
  );
}
```

**Sau:**

```typescript
'use client';

import { useUsers, User } from '@/features/users';

export function UserList() {
  const { data: users, loading, error } = useUsers(1, 10);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <ul>
      {users?.map(user => (
        <li key={user.userId}>{user.fullName}</li>
      ))}
    </ul>
  );
}
```

### Step 3: Update API Routes

#### Example: API Route Handler

**Trước:**

```typescript
// app/api/users/route.ts
import { UserService } from '@/services/user.service';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const users = await UserService.getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
```

**Sau:**

```typescript
// app/api/users/route.ts
import { userApi } from '@/features/users';
import { NextResponse } from 'next/server';

export async function GET() {
  const result = await userApi.getAll();
  
  if (result.success) {
    return NextResponse.json(result.data);
  }
  
  return NextResponse.json(
    { error: result.error?.message }, 
    { status: 500 }
  );
}
```

## 🎯 Key Differences

### 1. Response Format

**Old:** Direct data return

```typescript
const users = await UserService.getAllUsers();
// users is User[] directly
```

**New:** ApiResponse wrapper

```typescript
const response = await userApi.getAll();
if (response.success) {
  const users = response.data; // User[]
}
```

### 2. Error Handling

**Old:** Try-catch required

```typescript
try {
  const users = await UserService.getAllUsers();
} catch (error) {
  console.error(error);
}
```

**New:** Built-in error handling

```typescript
const response = await userApi.getAll();
if (!response.success) {
  console.error(response.error?.message);
}
```

### 3. Pagination

**Old:** Various implementations

```typescript
UserService.getAllUsers(page, limit);
```

**New:** Consistent pagination

```typescript
userApi.getAll(page, limit);
// Returns: ApiResponse<User[]> with pagination info
```

## 🔧 Feature-by-Feature Migration

### Users Feature

| Old Service Method | New API Method | New Hook |
|-------------------|----------------|----------|
| `UserService.getAllUsers()` | `userApi.getAll()` | `useUsers()` |
| `UserService.getUserById()` | `userApi.getById()` | `useUser()` |
| `UserService.createUser()` | `userApi.create()` | `useCreateUser()` |
| `UserService.updateUser()` | `userApi.update()` | `useUpdateUser()` |
| `UserService.deleteUser()` | `userApi.delete()` | `useDeleteUser()` |
| `UserService.getUsersByRole()` | `userApi.getByRole()` | `useUsersByRole()` |

### Lessons Feature

| Old Service Method | New API Method | New Hook |
|-------------------|----------------|----------|
| `LessonService.getAllLessonPlans()` | `lessonApi.getLessonPlans()` | `useLessonPlans()` |
| `LessonService.getLessonPlanById()` | `lessonApi.getLessonPlanById()` | `useLessonPlan()` |
| `LessonService.createLessonPlan()` | `lessonApi.createLessonPlan()` | `useCreateLessonPlan()` |
| `LessonService.getLessonsForPlan()` | `lessonApi.getLessonsByPlan()` | `useLessonsByPlan()` |

### Quizzes Feature

| Old Service Method | New API Method | New Hook |
|-------------------|----------------|----------|
| `QuizService.getAllQuizzes()` | `quizApi.getAll()` | `useQuizzes()` |
| `QuizService.getQuizById()` | `quizApi.getById()` | `useQuiz()` |
| `QuizService.createQuiz()` | `quizApi.create()` | `useCreateQuiz()` |
| `QuizService.submitQuiz()` | `quizApi.submitQuiz()` | `useSubmitQuiz()` |

## ✅ Migration Checklist

- [ ] Update all imports from `@/services/*` to `@/features/*`
- [ ] Update all imports from `@/types/backend.types` to feature-specific types
- [ ] Replace direct API calls with new API methods
- [ ] Update components to use new hooks
- [ ] Handle new response format (ApiResponse wrapper)
- [ ] Test all features after migration
- [ ] Remove old service files (optional, after testing)
- [ ] Update documentation

## 🚨 Breaking Changes

### 1. Response Format Changed

Old services returned data directly. New API returns `ApiResponse<T>`:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  pagination?: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
  };
}
```

### 2. Import Paths Changed

All imports now use feature-based paths:

```typescript
// ❌ Old
import { User } from '@/types/backend.types';
import { UserService } from '@/services/user.service';

// ✅ New
import { userApi, User } from '@/features/users';
```

### 3. Hooks No Longer Require React Query

Old hooks required React Query. New `hooks-simple.ts` uses vanilla React:

```typescript
// ✅ No need to install @tanstack/react-query
import { useUsers } from '@/features/users';
```

## 🎓 Examples

### Complete Component Example

**Old:**

```typescript
'use client';

import { useState, useEffect } from 'react';
import { UserService } from '@/services/user.service';
import { LessonService } from '@/services/lesson.service';
import { User, LessonPlan } from '@/types/backend.types';

export function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<LessonPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      UserService.getAllUsers(),
      LessonService.getAllLessonPlans()
    ]).then(([usersRes, plansRes]) => {
      setUsers(usersRes.data || []);
      setPlans(plansRes.data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Users: {users.length}</h2>
      <h2>Lesson Plans: {plans.length}</h2>
    </div>
  );
}
```

**New:**

```typescript
'use client';

import { useUsers } from '@/features/users';
import { useLessonPlans } from '@/features/lessons';

export function Dashboard() {
  const { data: users, loading: loadingUsers } = useUsers();
  const { data: plans, loading: loadingPlans } = useLessonPlans();

  if (loadingUsers || loadingPlans) return <div>Loading...</div>;

  return (
    <div>
      <h2>Users: {users?.length ?? 0}</h2>
      <h2>Lesson Plans: {plans?.length ?? 0}</h2>
    </div>
  );
}
```

## 📞 Need Help?

- Check `docs/API_STRUCTURE.md` for detailed structure documentation
- See feature-specific documentation in `features/{feature}/README.md`
- Review example components in `components/`

## 🎉 Benefits After Migration

- ✅ Better code organization
- ✅ Type safety improved
- ✅ Consistent API patterns
- ✅ Easier to find related code
- ✅ Better error handling
- ✅ Built-in loading states
- ✅ No external dependencies (optional)

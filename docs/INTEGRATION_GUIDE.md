# 🔗 Backend API - Hướng dẫn sử dụng

## 🚀 Setup

```powershell
# Backend
cd BE/controllers
dotnet run  # https://localhost:7000

# Frontend  
cd math-education-app
pnpm dev    # http://localhost:3000
```

Tạo `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://localhost:7000/api
```

---

## 🔐 Authentication

### Login (⚠️ Dùng `username`, không phải `email`)

```typescript
import { authApi, authStorage } from '@/features/auth';

const res = await authApi.login({ username: 'teacher1', password: '123456' });
if (res.success) {
  authStorage.saveToken(res.data.token);
  // res.data = { token, userId, username, role }
}
```

### Register

```typescript
await authApi.register({
  username: 'newuser',
  email: 'user@email.com',
  password: '123456',
  role: 'Teacher',     // "Student" | "Teacher" | "Admin"
  levelId: 1,          // Required!
  gradeLevel: 'Grade 10'
});
```

---

## 📦 Available APIs

| Feature | Import | Key Methods |
|---------|--------|-------------|
| **Auth** | `@/features/auth` | `login()`, `register()` |
| **Users** (Admin) | `@/features/users` | `getAll()`, `getById()`, `update()`, `delete()` |
| **Lesson Plans** | `@/features/lesson-plans` | `getAll()`, `getById()`, `getWithLessons()`, `getByTeacher()`, `search()`, `create()`, `publish()` |
| **Question Banks** | `@/features/question-banks` | `getAll()`, `getById()`, `create()`, `update()`, `delete()` |
| **Difficulties** | `@/features/difficulties` | `getAll()`, `getById()`, `create()`, `update()`, `delete()` |

**Swagger**: https://localhost:7000/swagger

---

## 💡 Examples

### Lesson Plans

```typescript
import { lessonPlanApi } from '@/features/lesson-plans';

// Get all
const res = await lessonPlanApi.getAll();

// Get by teacher
await lessonPlanApi.getByTeacher(1);

// Search
await lessonPlanApi.search('algebra');

// Create
await lessonPlanApi.create({
  teacherId: 1,
  levelId: 1,
  title: 'Đại số',
  topicName: 'Algebra'
});

// Publish
await lessonPlanApi.publish(1);
```

### Question Banks

```typescript
import { questionBankApi } from '@/features/question-banks';

await questionBankApi.create({
  teacherId: 1,
  levelId: 1,
  name: 'Bank 1',
  description: 'Desc',
  isPublic: true
});
```

---

## 📊 Response Format

```typescript
// Success
{ success: true, data: {...} }

// Error
{ success: false, error: { code: 400, message: "..." } }
```

**Luôn check `success` trước**:
```typescript
const res = await lessonPlanApi.getAll();
if (res.success) {
  console.log(res.data);  // ✅ Safe
} else {
  console.error(res.error?.message);
}
```

---

## 🐛 Common Issues

| Error | Fix |
|-------|-----|
| **CORS** | Backend `Program.cs` enable CORS cho `localhost:3000` |
| **SSL cert** | `dotnet dev-certs https --trust` |
| **401** | Token hết hạn → Login lại |
| **403** | Thiếu quyền Admin |

---

## ⚠️ Important Notes

### Mock APIs trong `app/api/`
Các routes sau **KHÔNG kết nối backend**:
- `app/api/analytics/*` - Fake data
- `app/api/quiz/*` - Fake data  
- `app/api/ai/*` - Cần OpenAI key riêng

→ Chỉ dùng cho demo UI

### Backend chưa có
- Quizzes, Questions, Answers
- Progress Tracking
- Real Analytics
- AI Features (backend)

### Type Changes
- **Role**: `"Student"` | `"Teacher"` | `"Admin"` (PascalCase)
- **Auth Response**: `{ token, userId, username, role }` (minimal)
- **Register**: Bắt buộc có `levelId`

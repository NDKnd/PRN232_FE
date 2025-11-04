# 📚 Documentation

## 🎯 Core Guides

### [📘 INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
Hướng dẫn tích hợp Backend API - **ĐỌC FILE NÀY TRƯỚC**
- Setup & configuration
- Authentication flow
- All available endpoints
- Usage examples
- Error handling

### [⚠️ API_ROUTES_STATUS.md](./API_ROUTES_STATUS.md)
Status của API routes trong `app/api/`
- Mock data routes (analytics, quiz, ai)
- Không kết nối backend
- Recommendation: giữ hay xóa

---

## 🚀 Quick Reference

### Start Project
```powershell
# Backend
cd BE/controllers && dotnet run

# Frontend
cd math-education-app && pnpm dev
```

### Login (⚠️ username, not email)
```typescript
import { authApi } from '@/features/auth';
await authApi.login({ username: 'teacher1', password: '123456' });
```

### Available APIs
- ✅ Auth, Users, Lesson Plans, Question Banks, Difficulties
- ❌ Quizzes, Progress, Analytics (backend chưa có)

### Docs
- **Swagger**: https://localhost:7000/swagger
- **Integration**: [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)

# ⚠️ API Routes Status

## 📁 Routes trong `app/api/`

### ❌ Mock Data (Không kết nối Backend)

Các API routes này chỉ trả về **fake data** cho demo UI:

#### 1. Analytics (`/api/analytics/`)
- `GET /api/analytics/class-overview?teacherId=X` - Fake class statistics
- `GET /api/analytics/student-progress?studentId=X` - Fake student progress

**Status**: Mock data, không lưu database

#### 2. Quiz (`/api/quiz/`)
- `POST /api/quiz/submit` - Fake quiz scoring (hardcoded correct answers)

**Status**: Mock data, không lưu database

#### 3. AI Features (`/api/ai/`)
- `POST /api/ai/generate-lesson` - Generate lesson bằng OpenAI
- `POST /api/ai/generate-questions` - Generate questions
- `POST /api/ai/generate-feedback` - Generate feedback
- `POST /api/ai/personalized-recommendations` - Get recommendations
- `POST /api/ai/rephrase-content` - Rephrase text

**Status**: Cần OpenAI API key, không kết nối backend

#### 4. Export (`/api/lessons/export/`)
- `POST /api/lessons/export` - Export lesson to PDF/DOCX

**Status**: Not implemented

---

## ✅ Recommendation

### Giữ lại nếu:
- Muốn demo UI với fake data
- Đang phát triển frontend mà backend chưa xong
- Cần placeholder cho tính năng tương lai

### Xóa đi nếu:
- Chỉ dùng backend API thật
- Không cần AI features
- Tránh nhầm lẫn mock vs real data

---

## 🔄 Migrate sang Backend

Khi backend implement các tính năng này:

1. **Update endpoints** trong `lib/api/endpoints.ts`
2. **Tạo feature modules** (ví dụ: `features/analytics/`)
3. **Xóa API routes** trong `app/api/`
4. **Update components** để dùng feature modules

**Example**:
```typescript
// Old (mock)
const res = await fetch('/api/analytics/class-overview?teacherId=1');

// New (backend)
import { analyticsApi } from '@/features/analytics';
const res = await analyticsApi.getClassOverview(1);
```

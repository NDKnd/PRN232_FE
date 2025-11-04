# 🎓 Math Education App - Coding Standards

## 🚀 Quick Start

```powershell
# Backend: https://localhost:7000
cd BE/controllers && dotnet run

# Frontend: http://localhost:3000
cd math-education-app && pnpm dev
```

**Setup**: Tạo `.env.local` → `NEXT_PUBLIC_API_URL=https://localhost:7000/api`

**Docs**: Xem `docs/INTEGRATION_GUIDE.md` để biết cách dùng API

---

## 🖥️ Frontend (Next.js + TypeScript)

### 1\. Cấu trúc dự án

```txt
math-education-app/
 ├── app/                  # Next.js App Router
 │   ├── login/           # Login page
 │   ├── teacher/         # Teacher pages
 │   └── student/         # Student pages
 ├── components/          # UI components (chung)
 │   ├── ui/             # Shadcn components
 │   └── Button.tsx
 ├── features/           # Feature modules (API + Types)
 │   ├── auth/           # Authentication
 │   ├── users/          # User management
 │   ├── lesson-plans/   # Lesson plans
 │   └── difficulties/   # Difficulties
 ├── lib/
 │   └── api/            # API client & endpoints
 ├── hooks/              # Custom hooks
 │   └── use-toast.ts
 ├── types/              # Shared types
 └── utils/              # Utility functions
```

**Feature Module Pattern**:
```txt
features/auth/
 ├── api.ts        # API calls (authApi.login, authApi.register)
 ├── types.ts      # Types & interfaces
 └── index.ts      # Public exports
```

### 2\. Quy tắc đặt tên

  * **Component**: **PascalCase**.
    ```typescript
    function UserProfile() { ... }
    ```
  * **File**: Trùng tên component, **PascalCase** $\rightarrow$ `UserProfile.tsx`.
  * **Hooks**: Bắt đầu bằng `use` $\rightarrow$ `useAuth.ts`, `useFetch.ts`.
  * **Biến và hàm**: **camelCase**.
    ```typescript
    const userName: string = "Doc";
    function getUserProfile(): Promise<User> {}
    ```
  * **Interface & Type**: **PascalCase**. (Ưu tiên dùng `type` trừ khi cần `extends`).
    ```typescript
    type User = {
      id: number;
      name: string;
    }

    // Hoặc dùng interface
    interface IUser {
     id: number;
     name: string;
    }
    ```

### 3\. Code Style

  * Sử dụng ES6+ và các tính năng TypeScript (arrow function, `async/await`, destructuring, generics).
  * Luôn dùng **functional component** + **React Hooks** thay cho class component.
  * State đặt ngắn gọn, rõ nghĩa:
    ```typescript
    const [user, setUser] = useState<IUser | null>(null);
    ```
  * Destructuring props kèm type:
    ```typescript
    type UserCardProps = {
      name: string;
      age: number;
    };

    function UserCard({ name, age }: UserCardProps) {
      return <div>{name} - {age}</div>;
    }
    ```

### 4\. UI & Logic

  * **Tách biệt logic và UI**: Logic phức tạp nên đặt trong `hooks` hoặc `features`, UI giữ đơn giản trong `component`.
  * Tránh viết quá nhiều logic tính toán trực tiếp trong JSX.
  * Luôn kiểm tra `null`/`undefined` trước khi render (sử dụng optional chaining `?.` hoặc conditional rendering).
    ```tsx
    {user && <UserCard name={user.name} age={20} />}

    // Hoặc
    {user?.name}
    ```

### 5\. API Calls (Feature Module)

  * **Không gọi API trực tiếp** trong component. Dùng feature modules.
  * Import từ `features/` thay vì `lib/api/`.
  * Luôn check `response.success` trước khi dùng `response.data`.

    ```typescript
    // ✅ ĐÚNG
    import { authApi, authStorage } from '@/features/auth';
    
    const res = await authApi.login({ username, password });
    if (res.success) {
      authStorage.saveToken(res.data.token);
    } else {
      console.error(res.error?.message);
    }

    // ❌ SAI - Không gọi trực tiếp
    const res = await fetch('/api/auth/login');
    ```

### 6\. Server vs Client Components (Next.js)

  * **Server Component** (default): Fetch data trực tiếp, không dùng `useState`/`useEffect`.
  * **Client Component**: Thêm `'use client'` ở đầu file, có thể dùng hooks.

    ```typescript
    // Server Component (app/lessons/page.tsx)
    import { lessonPlanApi } from '@/features/lesson-plans';
    
    export default async function LessonsPage() {
      const res = await lessonPlanApi.getAll();
      return <div>{res.data?.map(...)}</div>;
    }

    // Client Component (components/LoginForm.tsx)
    'use client';
    import { useState } from 'react';
    
    export default function LoginForm() {
      const [username, setUsername] = useState('');
      // ...
    }
    ```

-----

## 📌 Backend (C\# RESTful API)

### 1\. Cấu trúc dự án (Ví dụ)

```txt
src/
 ├── controllers/     # Xử lý request, response
 ├── services/        # Xử lý logic, gọi DB
 ├── repositories/    # Định nghĩa data model (Entities)
 ├── applications/    # Helper, DTOs, Mappers...
 │   ├── utils/
 │   ├── mappers/
 │   ├── DTOs/
 │   ├── auth/
 │   └── ...
 └── app.js
```

### 2\. Quy tắc đặt tên endpoint

  * Dùng **danh từ số nhiều** (plural nouns) cho resources (ví dụ: `/users`, `/products`).
  * **Không nhúng hành động** (verb) trong URL (ví dụ: `/api/users/create` ❌).
  * Hành động được quyết định bằng **HTTP Verb**.

**Ví dụ cho resource `User`:**

| HTTP Verb | Endpoint | Mô tả |
| :--- | :--- | :--- |
| `GET` | `/api/users` | Lấy danh sách user |
| `GET` | `/api/users/{id}` | Lấy chi tiết user theo id |
| `POST` | `/api/users` | Tạo user mới |
| `PUT` | `/api/users/{id}` | Cập nhật toàn bộ user (thay thế) |
| `PATCH` | `/api/users/{id}` | Cập nhật một phần user |
| `DELETE` | `/api/users/{id}` | Xóa user |

👉 **Sub-resource (Resource lồng nhau):**

```http
GET /api/users/1/posts       # Lấy tất cả bài post của user 1
GET /api/users/1/posts/99    # Lấy chi tiết post 99 của user 1
```

### 3\. Quy tắc đặt tên Controller

  * **PascalCase** + suffix `Controller`.
  * Tên controller khớp với resource (danh từ số nhiều).
  * ASP.NET Core mặc định map: `UsersController` $\rightarrow$ `/api/users`.

<!-- end list -->

```csharp
[ApiController]
[Route("api/[controller]")] // -> /api/users
public class UsersController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAllUsers() { ... }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetUserById(int id) { ... }

    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto) { ... }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto dto) { ... }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteUser(int id) { ... }
}
```

### 4\. Quy tắc DTO & Model

  * **Entity (DB model)**: **PascalCase**, số ít $\rightarrow$ `User`, `Product`.
  * **DTO (Data Transfer Object)**: **PascalCase** + suffix `Dto` $\rightarrow$ `CreateUserDto`, `UpdateUserDto`.
  * **Interface (cho Service)**: **PascalCase**, prefix `I` $\rightarrow$ `IUserService`.

<!-- end list -->

```csharp
// DTO cho việc tạo mới
public class CreateUserDto
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}

// DTO cho việc cập nhật
public class UpdateUserDto
{
    public string? Name { get; set; }
    public string? Email { get; set; }
}
```

### 5\. Error Handling & Validation

  * Dùng `ModelState` (DataAnnotation) hoặc `FluentValidation` để validate input DTOs.
  * Trả về mã lỗi HTTP chuẩn: `400` (Bad Request), `401` (Unauthorized), `404` (Not Found), `500` (Internal Server Error).
  * Nên sử dụng một **Global Exception Handling Middleware** để bắt lỗi tập trung.

<!-- end list -->

```csharp
[HttpPost]
public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
{
    if (!ModelState.IsValid)
    {
        return BadRequest(new {
            success = false,
            error = new { code = 400, message = "Invalid request data" }
        });
    }

    var user = await _userService.CreateUserAsync(dto);
    return Ok(new { success = true, data = user });
}
```

### 6\. Code Style

  * Dùng `async/await` cho tất cả các lời gọi I/O (như gọi DB, gọi API khác).
  * **Controller** chỉ nên làm nhiệm vụ nhận request, validate, gọi **Service** và trả về response.
  * Toàn bộ logic nghiệp vụ (business logic) phải được đặt trong **Service**.
  * Sử dụng Dependency Injection (DI) để tiêm (inject) `Service` vào `Controller`.

<!-- end list -->

```csharp
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    // Sử dụng Dependency Injection
    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUserById(int id)
    {
        var user = await _userService.GetUserByIdAsync(id); // Logic nằm trong service
        if (user == null)
        {
            return NotFound(new {
                success = false,
                error = new { code = 404, message = "User not found" }
            });
        }
        return Ok(new { success = true, data = user });
    }
}
```

### 7\. Quy tắc khác

  * Tên phương thức trong Controller: **PascalCase** (ví dụ: `GetUserById`, `CreateUser`).
  * Sử dụng `Swagger/OpenAPI` để tự động tạo tài liệu (documentation) cho API.

-----

## 📦 Chuẩn JSON trả về (API Response)

Xây dựng một cấu trúc JSON trả về nhất quán.

### 1\. Thành công (Success)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Nguyen Van A"
  }
}
```

### 2\. Lỗi (Error)

```json
{
  "success": false,
  "error": {
    "code": 404,
    "message": "User not found"
  }
}
```

### 3\. Danh sách (có phân trang)

```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "A" },
    { "id": 2, "name": "B" }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 52
  }
}
```

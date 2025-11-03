# DevTasks API - Backend Documentation

## البداية السريعة

### الخطوة 1: نسخ ملفات Backend

تأكد من وجود الملفات التالية في `DevTasks.Api/`:

#### Models/User.cs
```csharp
using System.ComponentModel.DataAnnotations;

namespace DevTasks.Api.Models;

public class User
{
    public int Id { get; set; }
    [Required][StringLength(100)]
    public string Name { get; set; } = string.Empty;
    [Required][EmailAddress][StringLength(200)]
    public string Email { get; set; } = string.Empty;
    [Required]
    public string PasswordHash { get; set; } = string.Empty;
    public ICollection<Project> OwnedProjects { get; set; } = new List<Project>();
    public ICollection<TaskItem> TasksAssigned { get; set; } = new List<TaskItem>();
}
```

#### Models/Project.cs
```csharp
using System.ComponentModel.DataAnnotations;

namespace DevTasks.Api.Models;

public class Project
{
    public int Id { get; set; }
    [Required][StringLength(200)]
    public string Name { get; set; } = string.Empty;
    public int OwnerId { get; set; }
    public User Owner { get; set; } = null!;
    public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
}
```

#### Models/TaskItem.cs
```csharp
using System.ComponentModel.DataAnnotations;

namespace DevTasks.Api.Models;

public class TaskItem
{
    public int Id { get; set; }
    [Required][StringLength(300)]
    public string Title { get; set; } = string.Empty;
    [StringLength(2000)]
    public string? Description { get; set; }
    [Required][StringLength(50)]
    public string Status { get; set; } = "ToDo";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public int ProjectId { get; set; }
    public int? AssignedToUserId { get; set; }
    public Project Project { get; set; } = null!;
    public User? AssignedToUser { get; set; }
}
```

### الخطوة 2: تشغيل Backend

```bash
cd /tmp/DevTasks/DevTasks.Api

# إضافة الحزم (إن لم تكن مضافة)
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package BCrypt.Net-Next

# بناء المشروع
dotnet build

# إنشاء المايجريشن
export PATH="$PATH:/home/$(whoami)/.dotnet/tools"
dotnet ef migrations add InitialCreate
dotnet ef database update

# تشغيل API
dotnet run
```

### الخطوة 3: اختبار API

زيارة: http://localhost:5000/swagger

#### تسجيل دخول:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@devtasks.com","password":"Admin123!"}'
```

## إنشاء Frontend

### الخطوة 1: إنشاء مشروع React

```bash
cd /tmp/DevTasks
npm create vite@latest DevTasks.Web -- --template react-ts
cd DevTasks.Web
npm install
```

### الخطوة 2: تثبيت Dependencies

```bash
npm install react-router-dom zustand
npm install -D tailwindcss postcss autoprefixer
npm install -D @types/node
npx tailwindcss init -p
```

### الخطوة 3: إعداد Tailwind

**tailwind.config.js:**
```js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

**src/index.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### الخطوة 4: إنشاء API Client

**src/lib/api.ts:**
```typescript
const BASE_URL = "http://localhost:5000";

async function request(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${url}`, { ...options, headers });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

export const api = {
  get: (url: string) => request(url, { method: "GET" }),
  post: (url: string, data: any) => request(url, { method: "POST", body: JSON.stringify(data) }),
  put: (url: string, data: any) => request(url, { method: "PUT", body: JSON.stringify(data) }),
  delete: (url: string) => request(url, { method: "DELETE" }),
};
```

### الخطوة 5: إنشاء Zustand Store

**src/store/auth.ts:**
```typescript
import { create } from "zustand";
import { api } from "../lib/api";

interface User { id: number; name: string; email: string; }
interface AuthState {
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  restoreFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  login: async (email, password) => {
    const data = await api.post("/api/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));
    set({ token: data.token, user: { id: data.userId, name: data.name, email: data.email } });
  },
  register: async (name, email, password) => {
    await api.post("/api/auth/register", { name, email, password });
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ token: null, user: null });
  },
  restoreFromStorage: () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) set({ token, user: JSON.parse(user) });
  },
}));
```

### الخطوة 6: تشغيل Frontend

```bash
npm run dev
```

## ملفات إضافية مطلوبة

أنشئ الملفات التالية في `DevTasks.Api/`:

1. `Contracts/Dtos.cs` - راجع الكود أعلاه
2. `Services/JwtTokenService.cs` - راجع الكود أعلاه
3. `Endpoints/*.cs` - راجع الكود أعلاه
4. `Data/AppDbContext.cs` - راجع الكود أعلاه

## استكشاف الأخطاء

### Backend لا يعمل؟
- تأكد من وجود جميع الحزم: `dotnet restore`
- تحقق من الملفات المفقودة
- راجع الأخطاء: `dotnet build`

### Frontend لا يتصل بـ Backend؟
- تأكد من تشغيل Backend على `localhost:5000`
- تحقق من CORS Settings
- افتح Console في المتصفح للأخطاء

## الخطوات التالية

1. أنشئ الصفحات المتبقية (Login, Register, Dashboard, Project)
2. أضف المكونات (Navbar, ProtectedRoute)
3. أكمل التوجيه (React Router)
4. أضف الاختبارات (xUnit للباك، Vitest للفرونت)
5. أنشئ GitHub Actions Workflow
6. أضف Dockerfile

للحصول على الكود الكامل للفرونت، راجع الملف README الرئيسي.

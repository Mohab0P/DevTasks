# DevTasks

نظام إدارة مهام كامل باللغة العربية مبني بـ **ASP.NET Core 8** و **React TypeScript**.

## 🚀 المميزات

- ✅ مصادقة المستخدمين (JWT)
- ✅ إنشاء المشاريع
- ✅ إدارة المهام بنظام Kanban (To Do / In Progress / Done)
- ✅ واجهة مستخدم عصرية بـ Tailwind CSS
- ✅ RESTful API مع Swagger Documentation

## 🛠️ التقنيات المستخدمة

### Backend
- **ASP.NET Core 8** - Minimal API
- **Entity Framework Core 9** - SQLite
- **JWT Authentication** - مع BCrypt
- **Swagger/OpenAPI** - توثيق API

### Frontend
- **React 18** + **TypeScript**
- **Vite** - Build tool
- **React Router v6** - التوجيه
- **Zustand** - إدارة الحالة
- **Tailwind CSS** - التصميم

## 📁 هيكل المشروع

```
DevTasks/
├── DevTasks.Api/              # ASP.NET Core 8 Backend
│   ├── Models/                # نماذج البيانات
│   │   ├── User.cs
│   │   ├── Project.cs
│   │   └── TaskItem.cs
│   ├── Data/
│   │   └── AppDbContext.cs    # قاعدة البيانات + Seed
│   ├── Contracts/
│   │   └── Dtos.cs            # Data Transfer Objects
│   ├── Services/
│   │   └── JwtTokenService.cs # JWT Token Generation
│   ├── Endpoints/
│   │   ├── AuthEndpoints.cs   # Register + Login
│   │   ├── ProjectEndpoints.cs
│   │   └── TaskEndpoints.cs
│   ├── Program.cs             # Startup Configuration
│   ├── appsettings.json
│   └── Properties/
│       └── launchSettings.json
│
├── DevTasks.Web/              # React Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── Project.tsx
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── store/
│   │   │   └── auth.ts        # Zustand Store
│   │   ├── lib/
│   │   │   └── api.ts         # API Client
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── .eslintrc.cjs
│
├── DevTasks.Tests/            # xUnit Tests
│   └── AuthTests.cs
│
├── .editorconfig
├── .gitignore
└── DevTasks.sln
```

## 🚀 التشغيل المحلي

### المتطلبات
- **.NET 8 SDK** - [تحميل](https://dotnet.microsoft.com/download/dotnet/8.0)
- **Node.js 18+** - [تحميل](https://nodejs.org/)
- **dotnet-ef** (أداة Migrations)

### 1️⃣ Backend Setup

```bash
# الانتقال إلى مجلد API
cd DevTasks/DevTasks.Api

# تثبيت أداة EF Core (إن لم تكن مثبتة)
dotnet tool install --global dotnet-ef

# استعادة الحزم
dotnet restore

# إنشاء قاعدة البيانات والجداول
dotnet ef migrations add InitialCreate
dotnet ef database update

# تشغيل Backend
dotnet watch run
# أو
dotnet run
```

**Backend يعمل على:** `http://localhost:5000`  
**Swagger UI:** `http://localhost:5000/swagger`

### 2️⃣ Frontend Setup

```bash
# الانتقال إلى مجلد Web
cd DevTasks/DevTasks.Web

# تثبيت Dependencies
npm install

# تشغيل Dev Server
npm run dev
```

**Frontend يعمل على:** `http://localhost:5173`

## 🔑 بيانات الاختبار (Seed Data)

```
Email: admin@devtasks.com
Password: Admin123!
```

## 📡 API Endpoints

### Authentication (غير محمي)
- `POST /api/auth/register` - تسجيل مستخدم جديد
- `POST /api/auth/login` - تسجيل الدخول

### Projects (محمي بـ JWT)
- `GET /api/projects` - قائمة المشاريع
- `POST /api/projects` - إنشاء مشروع جديد
- `GET /api/projects/{id}/tasks` - مهام المشروع

### Tasks (محمي بـ JWT)
- `POST /api/tasks` - إنشاء مهمة
- `PUT /api/tasks/{id}` - تحديث مهمة
- `DELETE /api/tasks/{id}` - حذف مهمة

## 🔐 Authentication Flow

1. **Register**: إنشاء حساب → `POST /api/auth/register`
2. **Login**: الحصول على JWT Token → `POST /api/auth/login`
3. **Use Token**: إضافة `Authorization: Bearer {token}` في الـ Headers
4. **Frontend**: الـ Token يُحفظ في `localStorage` ويُضاف تلقائياً

## 🗄️ نموذج البيانات

### User
- `Id` (int, PK)
- `Name` (string)
- `Email` (string, unique)
- `PasswordHash` (string)

### Project
- `Id` (int, PK)
- `Name` (string)
- `OwnerId` (int, FK → User)

### TaskItem
- `Id` (int, PK)
- `Title` (string)
- `Description` (string?)
- `Status` (string: "ToDo" | "InProgress" | "Done")
- `CreatedAt` (DateTime)
- `ProjectId` (int, FK → Project)
- `AssignedToUserId` (int?, FK → User)

## 🧪 تشغيل الاختبارات

```bash
cd DevTasks/DevTasks.Tests
dotnet test
```

## 🐳 Docker (اختياري)

```bash
# بناء وتشغيل Backend
cd DevTasks/DevTasks.Api
docker build -t devtasks-api .
docker run -p 5000:8080 devtasks-api

# Frontend (Production Build)
cd DevTasks/DevTasks.Web
npm run build
npx serve -s dist -l 5173
```

## 🛠️ أوامر مفيدة

### Backend
```bash
# بناء المشروع
dotnet build

# تشغيل مع Hot Reload
dotnet watch run

# إنشاء Migration جديد
dotnet ef migrations add MigrationName

# تطبيق Migrations
dotnet ef database update

# حذف قاعدة البيانات
dotnet ef database drop
```

### Frontend
```bash
# تثبيت Dependencies
npm install

# تشغيل Dev Server
npm run dev

# بناء للإنتاج
npm run build

# معاينة البناء
npm run preview

# Linting
npm run lint
```

## 📦 الحزم المستخدمة

### Backend (NuGet)
- `Microsoft.EntityFrameworkCore.Sqlite`
- `Microsoft.EntityFrameworkCore.Design`
- `Microsoft.AspNetCore.Authentication.JwtBearer`
- `BCrypt.Net-Next`
- `Swashbuckle.AspNetCore`

### Frontend (npm)
- `react` + `react-dom`
- `react-router-dom`
- `zustand`
- `tailwindcss`
- `@types/react` + TypeScript

## 🎯 الميزات الحالية

✅ تسجيل المستخدمين والدخول (JWT)  
✅ إدارة المشاريع (إنشاء، عرض)  
✅ إدارة المهام (إنشاء، تعديل، حذف)  
✅ حالات المهام (To Do / In Progress / Done)  
✅ تعيين المهام للمستخدمين  
✅ واجهة مستخدم مع Tailwind CSS  
✅ Swagger Documentation  
✅ CORS Support  
✅ JWT Token Validation  

## 🚧 Roadmap (تحسينات مستقبلية)

- [ ] Refresh Token Strategy
- [ ] Search & Filter Tasks
- [ ] Pagination
- [ ] File Uploads (Attachments)
- [ ] Real-time Notifications (SignalR)
- [ ] Task Comments
- [ ] Task Priorities
- [ ] Due Dates & Reminders
- [ ] User Roles & Permissions
- [ ] Project Collaboration
- [ ] Dark Mode
- [ ] Drag & Drop Tasks
- [ ] Activity Log
- [ ] Email Notifications
- [ ] Export Reports

## 🤝 المساهمة

يُرحب بالمساهمات! اتبع Conventional Commits:
- `feat:` - ميزة جديدة
- `fix:` - إصلاح خطأ
- `chore:` - مهام صيانة
- `test:` - إضافة اختبارات
- `docs:` - تحديث التوثيق

## 📄 License

MIT License - يمكنك استخدام المشروع بحرية.

## 📞 الدعم

للمشاكل والاستفسارات، افتح Issue في المستودع.

---

**تم بناؤه بـ ❤️ باستخدام ASP.NET Core & React**

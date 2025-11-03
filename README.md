# DevTasks 📋

> نظام إدارة المشاريع والمهام باللغة العربية - Task Management System in Arabic

[![ASP.NET Core](https://img.shields.io/badge/ASP.NET%20Core-8.0-purple)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-cyan)](https://tailwindcss.com/)

## ✨ المزايا

- 🎨 **واجهة عربية حديثة** مع تصميم جذاب وسلس
- 🔐 **نظام مصادقة آمن** باستخدام JWT
- 📊 **لوحة تحكم ذكية** مع إحصائيات شاملة
- 📁 **إدارة المشاريع** - إنشاء، تعديل، وحذف المشاريع
- ✅ **إدارة المهام** - Kanban Board بثلاث حالات
- 🎯 **تتبع التقدم** - Progress bars لكل مشروع
- 🚀 **أداء عالي** مع React و TypeScript
- 🎨 **تأثيرات حركية** Animations و Hover Effects

## 🛠️ التقنيات المستخدمة

### Backend
- **ASP.NET Core 8** - Minimal API
- **Entity Framework Core 9** - SQLite
- **JWT Bearer Authentication**
- **BCrypt** - Password Hashing
- **Swagger/OpenAPI** - API Documentation

### Frontend
- **React 18** مع **TypeScript**
- **Vite** - Build Tool
- **Tailwind CSS v4** - Styling
- **Zustand** - State Management
- **React Router v6** - Navigation

## 📸 لقطات الشاشة

### Login Screen
![Login](/.github/screenshots/login.png)

### Dashboard
![Dashboard](/.github/screenshots/dashboard.png)

### Project Board
![Project](/.github/screenshots/project.png)

## 🚀 التثبيت والتشغيل

### المتطلبات
- .NET 8 SDK
- Node.js 18+
- npm أو yarn

### Backend

```bash
cd DevTasks.Api
dotnet restore
dotnet ef database update
dotnet run
```

السيرفر سيعمل على: `http://localhost:5000`

### Frontend

```bash
cd DevTasks.Web
npm install
npm run dev
```

التطبيق سيعمل على: `http://localhost:5173`

## 📁 هيكل المشروع

```
DevTasks/
├── DevTasks.Api/           # Backend API
│   ├── Models/             # Database Models
│   ├── Contracts/          # DTOs
│   ├── Endpoints/          # API Endpoints
│   └── Program.cs          # Entry Point
│
└── DevTasks.Web/           # Frontend React App
    ├── src/
    │   ├── components/     # React Components
    │   ├── pages/          # Pages
    │   ├── store/          # Zustand Store
    │   └── lib/            # API Client
    └── package.json
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - تسجيل مستخدم جديد
- `POST /api/auth/login` - تسجيل الدخول

### Projects
- `GET /api/projects` - جلب كل المشاريع
- `GET /api/projects/{id}` - جلب مشروع معين
- `POST /api/projects` - إنشاء مشروع جديد
- `PUT /api/projects/{id}` - تعديل مشروع
- `DELETE /api/projects/{id}` - حذف مشروع

### Tasks
- `GET /api/tasks/project/{projectId}` - جلب مهام مشروع
- `GET /api/tasks/{id}` - جلب مهمة معينة
- `POST /api/tasks` - إنشاء مهمة جديدة
- `PUT /api/tasks/{id}` - تعديل مهمة
- `DELETE /api/tasks/{id}` - حذف مهمة

## 🎨 الميزات المرئية

- ✨ **Gradient Backgrounds** للصفحات
- 🎭 **Hover Effects** على البطاقات
- 📊 **Progress Bars** متحركة
- 🎯 **Badge Counters** للإحصائيات
- 🌈 **Color-coded Columns** للحالات
- 💫 **Smooth Transitions** في كل مكان
- 🎪 **Empty States** مع رسائل ودية

## 🔒 الأمان

- 🔐 JWT Token Authentication
- 🛡️ Password Hashing مع BCrypt
- 🚫 Authorization على كل Endpoint
- ✅ Owner-based Access Control

## 📝 الترخيص

هذا المشروع مفتوح المصدر - يمكن استخدامه بحرية

## 👨‍💻 المطور

تم تطويره بـ ❤️ بواسطة GitHub Copilot

---

**Happy Coding! 🚀**

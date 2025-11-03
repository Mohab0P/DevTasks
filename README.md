# DevTasks 📋

نظام إدارة المشاريع والمهام باللغة العربية

##  لقطات الشاشة

### تسجيل الدخول
![Login](.github/screenshots/login.png)

### إنشاء حساب
![Register](.github/screenshots/register.png)

### لوحة التحكم
![Dashboard](.github/screenshots/dashboard.png)

### إدارة المهام
![Project](.github/screenshots/project.png)

### إضافة مهمة
![Add Task](.github/screenshots/addtask.png)

### اختبار المهام
![Test Task](.github/screenshots/testTask.png)

## ⚡ التقنيات

- **Backend:** ASP.NET Core 8 + Entity Framework + SQLite + JWT
- **Frontend:** React 18 + TypeScript + Tailwind CSS v4 + Zustand

## 🚀 التشغيل

### Backend
```bash
cd DevTasks.Api
dotnet restore
dotnet ef database update
dotnet run
```

### Frontend
```bash
cd DevTasks.Web
npm install
npm run dev
```

## ✨ الميزات

- 🔐 **مصادقة المستخدمين** - تسجيل دخول وإنشاء حساب آمن
- 📁 **إدارة المشاريع** - إنشاء وتعديل وحذف المشاريع
- 📋 **لوحة كانبان** - إدارة المهام بنظام السحب والإفلات
- 📊 **الإحصائيات** - متابعة تقدم المشاريع والمهام

## 📂 هيكل المشروع

```
DevTasks/
├── DevTasks.Api/          # Backend - ASP.NET Core 8
│   ├── Data/             # Database Context & Models
│   ├── Endpoints/        # API Endpoints
│   ├── Services/         # Business Logic
│   └── Program.cs        # Entry Point
│
├── DevTasks.Web/          # Frontend - React + TypeScript
│   ├── src/
│   │   ├── components/   # UI Components
│   │   ├── pages/        # Application Pages
│   │   ├── store/        # Zustand State Management
│   │   └── lib/          # Utilities & API Client
│   └── package.json
│
└── README.md
```  

---
**Made with ❤️ by Mohab**

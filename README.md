# DevTasks

مشروع بسيط لإدارة المهام بنظام Kanban. بُني باستخدام ASP.NET Core و React.

## المميزات

- تسجيل دخول وإنشاء حسابات
- إنشاء مشاريع متعددة
- إضافة مهام وتنظيمها (To Do → In Progress → Done)
- واجهة نظيفة وسهلة الاستخدام

## التقنيات

**Backend:**
- ASP.NET Core 8
- Entity Framework Core (SQLite)
- JWT للمصادقة

**Frontend:**
- React + TypeScript
- Tailwind CSS
- React Router + Zustand

## كيف تشغل المشروع؟

### Backend

```bash
cd DevTasks.Api
dotnet restore
dotnet ef database update
dotnet run
```

الـ API يشتغل على: http://localhost:5000

### Frontend

```bash
cd DevTasks.Web
npm install
npm run dev
```

الموقع يفتح على: http://localhost:5173

## Screenshots

### Login Page
![Login](.github/screenshots/login.png)

### Dashboard
![Dashboard](.github/screenshots/dashboard.png)

### Kanban Board
![Kanban](.github/screenshots/kanban.png)

## الاستخدام

1. سجل حساب جديد
2. أنشئ مشروع
3. أضف مهام للمشروع
4. غيّر حالة المهمة من القائمة

بسيط وسريع! 🚀

## License

MIT

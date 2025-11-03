import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import Navbar from "../components/Navbar";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  projectId: number;
}

interface Project {
  id: number;
  name: string;
  ownerId: number;
  tasks: Task[];
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({ totalProjects: 0, totalTasks: 0 });

  useEffect(() => {
    loadProjects();
    loadStats();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await api.get("/api/projects");
      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects:", error);
    }
  };

  const loadStats = async () => {
    try {
      const projects = await api.get("/api/projects");
      let totalTasks = 0;
      
      for (const project of projects) {
        const tasks = await api.get(`/api/tasks/project/${project.id}`);
        totalTasks += tasks.length;
      }
      
      setStats({
        totalProjects: projects.length,
        totalTasks: totalTasks
      });
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await api.post("/api/projects", { name: newProjectName });
      setNewProjectName("");
      setShowModal(false);
      loadProjects();
    } catch (error) {
      console.error("Failed to create project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (e: React.MouseEvent, projectId: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm("هل أنت متأكد من حذف هذا المشروع؟ سيتم حذف جميع المهام المرتبطة به.")) return;
    
    try {
      await api.delete(`/api/projects/${projectId}`);
      loadProjects();
      loadStats();
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("فشل حذف المشروع!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">مرحباً بك في لوحة التحكم 👋</h1>
          <p className="text-gray-600">إدارة مشاريعك ومهامك بكل سهولة</p>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">إجمالي المشاريع</p>
                <h3 className="text-4xl font-bold">{stats.totalProjects}</h3>
              </div>
              <div className="text-5xl opacity-80">📁</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">إجمالي المهام</p>
                <h3 className="text-4xl font-bold">{stats.totalTasks}</h3>
              </div>
              <div className="text-5xl opacity-80">✅</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm mb-1">معدل المهام</p>
                <h3 className="text-4xl font-bold">
                  {stats.totalProjects > 0 ? Math.round(stats.totalTasks / stats.totalProjects) : 0}
                </h3>
              </div>
              <div className="text-5xl opacity-80">📊</div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            مشاريعي
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            مشروع جديد
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const completedTasks = project.tasks?.filter((t: Task) => t.status === 'Done').length || 0;
            const totalTasks = project.tasks?.length || 0;
            const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
            
            return (
              <div key={project.id} className="relative group">
                <Link
                  to={`/project/${project.id}`}
                  className="block bg-white rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 p-6 transform hover:-translate-y-2 border-2 border-transparent hover:border-blue-400"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                    📁 {project.name}
                  </h3>
                  
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>التقدم</span>
                      <span>{Math.round(progressPercent)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                      📋 {totalTasks} مهمة
                    </span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                      ✅ {completedTasks}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={(e) => handleDeleteProject(e, project.id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-white hover:bg-red-500 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110"
                  title="حذف المشروع"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📂</div>
            <p className="text-gray-600 text-xl mb-2">لا توجد مشاريع بعد</p>
            <p className="text-gray-500">ابدأ بإنشاء مشروعك الأول!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">إنشاء مشروع جديد</h2>
            <form onSubmit={handleCreateProject}>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="اسم المشروع"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg disabled:opacity-50"
                >
                  {isLoading ? "جاري الإنشاء..." : "إنشاء"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

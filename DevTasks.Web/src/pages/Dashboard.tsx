import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import Navbar from "../components/Navbar";

interface Project {
  id: number;
  name: string;
  ownerId: number;
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
    
    if (!confirm("هل أنت متأكد من حذف هذا المشروع؟")) return;
    
    try {
      await api.delete(`/api/projects/${projectId}`);
      loadProjects();
      loadStats();
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">إجمالي المشاريع</p>
                <h3 className="text-3xl font-bold text-blue-600">{stats.totalProjects}</h3>
              </div>
              <div className="text-4xl">📁</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">إجمالي المهام</p>
                <h3 className="text-3xl font-bold text-green-600">{stats.totalTasks}</h3>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">معدل المهام</p>
                <h3 className="text-3xl font-bold text-purple-600">
                  {stats.totalProjects > 0 ? Math.round(stats.totalTasks / stats.totalProjects) : 0}
                </h3>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">مشاريعي</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            + مشروع جديد
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="relative">
              <Link
                to={`/project/${project.id}`}
                className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {project.name}
                </h3>
                <p className="text-gray-600">اضغط لعرض المهام</p>
              </Link>
              <button
                onClick={(e) => handleDeleteProject(e, project.id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow"
                title="حذف المشروع"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">لا توجد مشاريع بعد. أنشئ مشروعك الأول!</p>
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

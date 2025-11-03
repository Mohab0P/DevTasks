import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
import Navbar from "../components/Navbar";

interface TaskItem {
  id: number;
  title: string;
  description: string;
  status: "ToDo" | "InProgress" | "Done";
  projectId: number;
  assignedToUserId?: number;
}

interface Project {
  id: number;
  name: string;
  ownerId: number;
}

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [editProjectName, setEditProjectName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    loadProject();
    loadTasks();
  }, [id]);

  const loadProject = async () => {
    try {
      const data = await api.get(`/api/projects/${id}`);
      setProject(data);
    } catch (error) {
      console.error("Failed to load project:", error);
    } finally {
      setPageLoading(false);
    }
  };

  const loadTasks = async () => {
    try {
      const data = await api.get(`/api/tasks/project/${id}`);
      setTasks(data);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post("/api/tasks", {
        title: newTask.title,
        description: newTask.description,
        projectId: Number(id),
        status: "ToDo",
      });
      setNewTask({ title: "", description: "" });
      setShowModal(false);
      loadTasks();
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (taskId: number, newStatus: "ToDo" | "InProgress" | "Done") => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      await api.put(`/api/tasks/${taskId}`, {
        title: task.title,
        description: task.description,
        status: newStatus,
        projectId: task.projectId,
      });
      loadTasks();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm("هل أنت متأكد من حذف هذه المهمة؟")) return;
    
    try {
      await api.delete(`/api/tasks/${taskId}`);
      loadTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
      alert("فشل حذف المهمة!");
    }
  };

  const handleEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.put(`/api/projects/${id}`, { name: editProjectName });
      setShowEditModal(false);
      loadProject();
    } catch (error) {
      console.error("Failed to update project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTasksByStatus = (status: "ToDo" | "InProgress" | "Done") => {
    return tasks.filter((task) => task.status === status);
  };

  const getStatusCount = (status: "ToDo" | "InProgress" | "Done") => {
    return tasks.filter((task) => task.status === status).length;
  };

  const TaskCard = ({ task }: { task: TaskItem }) => (
    <div className="bg-white p-4 rounded-lg shadow-md mb-3 hover:shadow-xl transition-all duration-300 border-l-4 border-blue-400 transform hover:-translate-y-1">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-gray-800 text-lg">{task.title}</h4>
        <button
          onClick={() => handleDeleteTask(task.id)}
          className="text-red-500 hover:text-white hover:bg-red-500 rounded-full w-6 h-6 flex items-center justify-center transition-all transform hover:scale-110"
          title="حذف المهمة"
        >
          ✕
        </button>
      </div>
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
      <select
        value={task.status}
        onChange={(e) => handleStatusChange(task.id, e.target.value as any)}
        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white cursor-pointer hover:border-blue-400 transition-colors"
      >
        <option value="ToDo">⏳ قيد الانتظار</option>
        <option value="InProgress">⚡ قيد التنفيذ</option>
        <option value="Done">✅ مكتملة</option>
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />

      {pageLoading ? (
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-600">جاري تحميل المشروع...</p>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-3 rounded-xl shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {project?.name || "Project"}
                </h1>
                <p className="text-sm text-gray-500">لوحة المهام</p>
              </div>
              <button
                onClick={() => {
                  setEditProjectName(project?.name || "");
                  setShowEditModal(true);
                }}
                className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-all"
                title="تعديل اسم المشروع"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              مهمة جديدة
            </button>
          </div>

          {/* Task Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-5 border-r-4 border-gray-500 shadow-md transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">⏳ قيد الانتظار</p>
                  <p className="text-3xl font-bold text-gray-800">{getStatusCount("ToDo")}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg p-5 border-r-4 border-blue-500 shadow-md transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm mb-1">⚡ قيد التنفيذ</p>
                  <p className="text-3xl font-bold text-blue-800">{getStatusCount("InProgress")}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-5 border-r-4 border-green-500 shadow-md transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm mb-1">✅ مكتملة</p>
                  <p className="text-3xl font-bold text-green-800">{getStatusCount("Done")}</p>
                </div>
              </div>
            </div>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* To Do Column */}
                    {/* To Do Column */}
          <div className="transform transition-all duration-300">
            <div className="bg-gradient-to-r from-gray-400 to-gray-500 rounded-t-lg px-4 py-3 flex justify-between items-center shadow-md">
              <h3 className="font-bold text-white flex items-center gap-2">
                <span>⏳</span> قيد الانتظار
              </h3>
              <span className="bg-white text-gray-700 text-sm px-3 py-1 rounded-full font-bold shadow">
                {getStatusCount("ToDo")}
              </span>
            </div>
            <div className="bg-gray-50 rounded-b-lg p-4 min-h-[400px] border-2 border-gray-200">
              {getTasksByStatus("ToDo").length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-2xl mb-2">📭</p>
                  <p className="text-gray-500">لا توجد مهام</p>
                </div>
              ) : (
                getTasksByStatus("ToDo").map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))
              )}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="transform transition-all duration-300">
            <div className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-t-lg px-4 py-3 flex justify-between items-center shadow-md">
              <h3 className="font-bold text-white flex items-center gap-2">
                <span>⚡</span> قيد التنفيذ
              </h3>
              <span className="bg-white text-blue-700 text-sm px-3 py-1 rounded-full font-bold shadow">
                {getStatusCount("InProgress")}
              </span>
            </div>
            <div className="bg-blue-50 rounded-b-lg p-4 min-h-[400px] border-2 border-blue-200">
              {getTasksByStatus("InProgress").length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-blue-300 text-2xl mb-2">⚙️</p>
                  <p className="text-blue-400">لا توجد مهام</p>
                </div>
              ) : (
                getTasksByStatus("InProgress").map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))
              )}
            </div>
          </div>

          {/* Done Column */}
          <div className="transform transition-all duration-300">
            <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-t-lg px-4 py-3 flex justify-between items-center shadow-md">
              <h3 className="font-bold text-white flex items-center gap-2">
                <span>✅</span> مكتملة
              </h3>
              <span className="bg-white text-green-700 text-sm px-3 py-1 rounded-full font-bold shadow">
                {getStatusCount("Done")}
              </span>
            </div>
            <div className="bg-green-50 rounded-b-lg p-4 min-h-[400px] border-2 border-green-200">
              {getTasksByStatus("Done").length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-green-300 text-2xl mb-2">🎉</p>
                  <p className="text-green-400">لا توجد مهام</p>
                </div>
              ) : (
                getTasksByStatus("Done").map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform animate-slideUp">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 p-3 rounded-xl">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">إضافة مهمة جديدة</h2>
            </div>
            <form onSubmit={handleCreateTask}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">عنوان المهمة</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="مثال: تصميم الواجهة"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">وصف المهمة</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="أضف وصفاً تفصيلياً للمهمة..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 h-32 resize-none transition-colors"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 rounded-xl font-medium disabled:opacity-50 transform active:scale-95 transition-all shadow-lg"
                >
                  {isLoading ? "جاري الإضافة..." : "إضافة"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-xl font-medium transform active:scale-95 transition-all"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform animate-slideUp">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-xl">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">تعديل اسم المشروع</h2>
            </div>
            <form onSubmit={handleEditProject}>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">اسم المشروع</label>
                <input
                  type="text"
                  value={editProjectName}
                  onChange={(e) => setEditProjectName(e.target.value)}
                  placeholder="أدخل اسم المشروع الجديد"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl font-medium disabled:opacity-50 transform active:scale-95 transition-all shadow-lg"
                >
                  {isLoading ? "جاري الحفظ..." : "حفظ"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-xl font-medium transform active:scale-95 transition-all"
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

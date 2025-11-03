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
  const [newTask, setNewTask] = useState({ title: "", description: "" });
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

  const getTasksByStatus = (status: "ToDo" | "InProgress" | "Done") => {
    return tasks.filter((task) => task.status === status);
  };

  const TaskCard = ({ task }: { task: TaskItem }) => (
    <div className="bg-white p-4 rounded-lg shadow mb-3">
      <h4 className="font-semibold text-gray-800 mb-2">{task.title}</h4>
      <p className="text-gray-600 text-sm mb-3">{task.description}</p>
      <select
        value={task.status}
        onChange={(e) => handleStatusChange(task.id, e.target.value as any)}
        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
      >
        <option value="ToDo">To Do</option>
        <option value="InProgress">In Progress</option>
        <option value="Done">Done</option>
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {pageLoading ? (
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-600">Loading project...</p>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              {project?.name || "Project"}
            </h1>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              + New Task
            </button>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* To Do Column */}
          <div>
            <div className="bg-gray-300 rounded-t-lg px-4 py-2">
              <h3 className="font-bold text-gray-800">To Do</h3>
            </div>
            <div className="bg-gray-50 rounded-b-lg p-4 min-h-[400px]">
              {getTasksByStatus("ToDo").map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>

          {/* In Progress Column */}
          <div>
            <div className="bg-yellow-300 rounded-t-lg px-4 py-2">
              <h3 className="font-bold text-gray-800">In Progress</h3>
            </div>
            <div className="bg-yellow-50 rounded-b-lg p-4 min-h-[400px]">
              {getTasksByStatus("InProgress").map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>

          {/* Done Column */}
          <div>
            <div className="bg-green-300 rounded-t-lg px-4 py-2">
              <h3 className="font-bold text-gray-800">Done</h3>
            </div>
            <div className="bg-green-50 rounded-b-lg p-4 min-h-[400px]">
              {getTasksByStatus("Done").map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Create New Task</h2>
            <form onSubmit={handleCreateTask}>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Task title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Task description"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                required
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg disabled:opacity-50"
                >
                  {isLoading ? "Creating..." : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

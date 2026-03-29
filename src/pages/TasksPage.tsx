import { useEffect, useRef, useState, type FC } from "react";
import AIChat from "../components/AIChat";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { useAuth } from "../context/AuthTypes";
import { getAIAdvice } from "../lib/groq";
import { taskService } from "../service/taskService";
import { useTaskStore, type Task } from "../store/taskStore";

const TasksPage: FC = () => {
  const { tasks, setTasks } = useTaskStore();
  const { user, logout } = useAuth();
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Firestore からリアルタイムでタスクを取得
  useEffect(() => {
    if (!user) return;

    // 前のリスナーがあれば削除
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    try {
      unsubscribeRef.current = taskService.subscribeToUserTasks(
        user.uid,
        (tasks) => {
          const mappedTasks = tasks.map((task) => ({
            ...task,
            id: task.firestoreId,
          }));
          setTasks(mappedTasks);
        },
      );
    } catch (error) {
      console.error("Failed to subscribe to tasks:", error);
    }

    // クリーンアップ
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [user, setTasks]);

  const handleAddTask = async (newTask: Omit<Task, "id">) => {
    if (!user) return;

    try {
      setIsAddingTask(true);
      await taskService.addTask(user.uid, newTask);
      // Firestore のリアルタイムリスナーが自動的に更新するため、ここでは addTask を呼ばない
    } catch (error) {
      console.error("Failed to add task:", error);
      alert("タスクの追加に失敗しました");
    } finally {
      setIsAddingTask(false);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      await taskService.updateTask(taskId, updates);
      // Firestore のリアルタイムリスナーが自動的に更新するため、ここでは updateTask を呼ばない
    } catch (error) {
      console.error("Failed to update task:", error);
      alert("タスクの更新に失敗しました");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      // Firestore のリアルタイムリスナーが自動的に更新するため、ここでは deleteTask を呼ばない
    } catch (error) {
      console.error("Failed to delete task:", error);
      alert("タスクの削除に失敗しました");
    }
  };

  const handleToggleTask = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    try {
      await handleUpdateTask(taskId, { completed: !task.completed });
    } catch (error) {
      console.error("Failed to toggle task:", error);
    }
  };

  const handleGetAdvice = async () => {
    try {
      setLoadingAI(true);
      const response = await getAIAdvice(tasks);
      setAiAdvice(response.message);
      setShowChat(true);
    } catch (error) {
      console.error("Failed to get advice:", error);
      alert("AI アドバイスの取得に失敗しました");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleLogout = async () => {
    try {
      // リスナーをクリーンアップ
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* ヘッダー */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-indigo-600">
            📋 AI タスク管理
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handleGetAdvice}
              disabled={loadingAI || tasks.length === 0}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 font-semibold flex items-center gap-2"
            >
              {loadingAI ? "⏳ 分析中..." : "🤖 AI アドバイス"}
            </button>
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-semibold">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-semibold"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* メインコンテンツ */}
          <div className="lg:col-span-2">
            {/* タスク追加フォーム */}
            <TaskForm onAddTask={handleAddTask} isLoading={isAddingTask} />

            {/* タスク一覧 */}
            <TaskList onToggle={handleToggleTask} onDelete={handleDeleteTask} />
          </div>

          {/* AI チャット */}
          {showChat && (
            <div className="lg:col-span-1">
              <AIChat advice={aiAdvice} onClose={() => setShowChat(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TasksPage;

import { useState, type FC } from "react";
import type { Task } from "../store/taskStore";

interface TaskFormProps {
  onAddTask: (task: Omit<Task, "id">) => Promise<void>;
  isLoading?: boolean;
}

const TaskForm: FC<TaskFormProps> = ({ onAddTask, isLoading = false }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await onAddTask({
        title,
        description,
        priority,
        dueDate: dueDate || undefined,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-lg p-6 mb-6"
    >
      <h2 className="text-2xl font-bold mb-4">新しいタスクを追加</h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="タスクのタイトル..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isLoading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 disabled:bg-gray-100"
        />

        <textarea
          placeholder="説明（オプション）..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isLoading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 h-20 resize-none disabled:bg-gray-100"
        />

        <div className="grid grid-cols-2 gap-4">
          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as "low" | "medium" | "high")
            }
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 disabled:bg-gray-100"
          >
            <option value="low">🟢 低優先度</option>
            <option value="medium">🟡 中優先度</option>
            <option value="high">🔴 高優先度</option>
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 disabled:bg-gray-100"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-semibold disabled:bg-gray-400 transition"
        >
          {isLoading ? "追加中..." : "追加"}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;

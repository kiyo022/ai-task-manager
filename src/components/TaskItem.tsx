import { type FC } from "react";
import type { Task } from "../store/taskStore";

interface TaskItemProps {
  task: Task;
  onToggle: () => Promise<void>;
  onDelete: () => Promise<void>;
}

const TaskItem: FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  const getPriorityBadge = (priority: "low" | "medium" | "high"): string => {
    switch (priority) {
      case "high":
        return "🔴 高";
      case "medium":
        return "🟡 中";
      case "low":
        return "🟢 低";
    }
  };

  const getPriorityBgColor = (priority: "low" | "medium" | "high"): string => {
    switch (priority) {
      case "high":
        return "bg-red-100 border-red-300";
      case "medium":
        return "bg-yellow-100 border-yellow-300";
      case "low":
        return "bg-green-100 border-green-300";
    }
  };

  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("ja-JP")
    : null;

  return (
    <div
      className={`border-l-4 rounded-lg p-4 transition ${getPriorityBgColor(
        task.priority,
      )} ${task.completed ? "opacity-60" : ""}`}
    >
      <div className="flex items-start gap-4">
        {/* チェックボックス */}
        <input
          type="checkbox"
          checked={task.completed}
          onChange={onToggle}
          className="w-6 h-6 mt-1 cursor-pointer accent-indigo-600"
        />

        {/* タスク内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4
              className={`text-lg font-semibold ${
                task.completed ? "line-through text-gray-500" : "text-gray-800"
              }`}
            >
              {task.title}
            </h4>
            <span className="px-2 py-1 bg-white bg-opacity-60 rounded text-xs font-bold">
              {getPriorityBadge(task.priority)}
            </span>
          </div>

          {task.description && (
            <p
              className={`text-sm mb-2 ${
                task.completed ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {task.description}
            </p>
          )}

          {formattedDate && (
            <p className="text-xs text-gray-500 mb-2">
              📅 期限: {formattedDate}
            </p>
          )}
        </div>

        {/* 削除ボタン */}
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition"
          title="削除"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default TaskItem;

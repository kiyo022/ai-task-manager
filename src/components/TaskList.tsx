import { type FC } from "react";
import { useTaskStore } from "../store/taskStore";
import TaskItem from "./TaskItem";

interface TaskListProps {
  onToggle: (taskId: string) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

const TaskList: FC<TaskListProps> = ({ onToggle, onDelete }) => {
  const tasks = useTaskStore((state) => state.tasks);

  const incompleteTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="space-y-6">
      {/* 未完了タスク */}
      <div>
        <h3 className="text-2xl font-bold mb-4 text-gray-800">
          📌 進行中のタスク ({incompleteTasks.length})
        </h3>
        {incompleteTasks.length > 0 ? (
          <div className="space-y-3">
            {incompleteTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={() => onToggle(task.id)}
                onDelete={() => onDelete(task.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-blue-700">
              🎉 すべてのタスクが完了しました！おめでとうございます！
            </p>
          </div>
        )}
      </div>

      {/* 完了タスク */}
      {completedTasks.length > 0 && (
        <div className="mt-8 pt-8 border-t-2 border-gray-200">
          <h3 className="text-2xl font-bold mb-4 text-gray-600">
            ✅ 完了済みタスク ({completedTasks.length})
          </h3>
          <div className="space-y-3">
            {completedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={() => onToggle(task.id)}
                onDelete={() => onDelete(task.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* タスクがない場合 */}
      {tasks.length === 0 && (
        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded text-center">
          <p className="text-indigo-700 text-lg">
            📝 タスクを追加して始めましょう！
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskList;

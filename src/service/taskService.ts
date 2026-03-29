import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  Timestamp,
  updateDoc,
  where,
  type QueryConstraint,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Task } from "../store/taskStore";

const TASKS_COLLECTION = "tasks";

export const taskService = {
  // タスクを追加
  addTask: async (userId: string, task: Omit<Task, "id">): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, TASKS_COLLECTION), {
        ...task,
        userId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding task:", error);
      throw error;
    }
  },

  // タスクを更新
  updateTask: async (taskId: string, updates: Partial<Task>): Promise<void> => {
    try {
      const taskRef = doc(db, TASKS_COLLECTION, taskId);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  },

  // タスクを削除
  deleteTask: async (taskId: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, TASKS_COLLECTION, taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  },

  // ユーザーのタスクをリアルタイムで取得
  subscribeToUserTasks: (
    userId: string,
    onTasksChange: (tasks: (Task & { firestoreId: string })[]) => void,
  ): Unsubscribe => {
    try {
      const q = query(
        collection(db, TASKS_COLLECTION),
        where("userId", "==", userId) as QueryConstraint,
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const tasks = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: data.id || doc.id,
            title: data.title,
            description: data.description,
            completed: data.completed,
            priority: data.priority,
            dueDate: data.dueDate,
            createdAt: data.createdAt?.toDate?.() || new Date(),
            updatedAt: data.updatedAt?.toDate?.() || new Date(),
            firestoreId: doc.id,
          } as Task & { firestoreId: string };
        });
        onTasksChange(tasks);
      });

      return unsubscribe;
    } catch (error) {
      console.error("Error subscribing to tasks:", error);
      throw error;
    }
  },
};

import axios from 'axios';
import type { Task, CreateTaskDto, UpdateTaskDto } from '../types/task'

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7150/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taskService = {
  getAllTasks: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>('/tasks');
    return response.data;
  },

  getTaskById: async (id: number): Promise<Task> => {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (taskData: CreateTaskDto): Promise<Task> => {
    const response = await api.post<Task>('/tasks', taskData);
    return response.data;
  },

  updateTask: async (id: number, taskData: UpdateTaskDto): Promise<void> => {
    await api.put(`/tasks/${id}`, taskData);
  },

  toggleTask: async (id: number): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${id}/toggle`);
    return response.data;
  },

  deleteTask: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};

export default api;
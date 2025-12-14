import React, { useEffect, useState } from 'react';
import { FaCheck, FaRedo, FaTrash, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import clsx from 'clsx';
import type { Task } from '../types/task';
import { taskService } from '../services/api';
import './TaskList.css';

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getAllTasks();
      setTasks(data);
      setError('');
    } catch (err) {
      setError('Не удалось загрузить задачи');
      console.error('Ошибка загрузки задач:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (id: number) => {
    try {
      const updatedTask = await taskService.toggleTask(id);
      setTasks(tasks.map(task => 
        task.id === id ? updatedTask : task
      ));
    } catch (err) {
      console.error('Ошибка обновления задачи:', err);
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (window.confirm('Удалить задачу?')) {
      try {
        await taskService.deleteTask(id);
        setTasks(tasks.filter(task => task.id !== id));
      } catch (err) {
        console.error('Ошибка удаления задачи:', err);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.isCompleted === b.isCompleted) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return a.isCompleted ? 1 : -1;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <FaSpinner className="fa-spin loading-spinner" />
        <p>Загрузка задач...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <FaExclamationTriangle className="error-icon" />
        <div>
          <strong>{error}</strong>
          <p className="error-message">
            Проверьте подключение к серверу и обновите страницу.
          </p>
          <button 
            onClick={fetchTasks}
            className="btn retry-btn"
          >
            Повторить попытку
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h2>
          Список задач
          <span className="task-count">
            ({tasks.filter(t => !t.isCompleted).length} активных, {tasks.filter(t => t.isCompleted).length} завершённых)
          </span>
        </h2>
        
        <button 
          onClick={fetchTasks}
          className="btn btn-icon refresh-btn"
          title="Обновить список"
        >
          <FaRedo />
        </button>
      </div>
      
      <div className="tasks-container">
        {sortedTasks.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-title">📝 Нет задач</p>
            <p className="empty-state-message">Создайте первую задачу в форме слева</p>
          </div>
        ) : (
          <div className="tasks-grid">
            {sortedTasks.map(task => (
              <div 
                key={task.id}
                className={clsx('task-item', { 'completed': task.isCompleted })}
              >
                {/* Индикатор статуса */}
                <div className="task-status-indicator" />
                
                <div className="task-content">
                  {/* Кнопка завершения */}
                  <button
                    onClick={() => handleToggleTask(task.id)}
                    className={clsx('btn-icon', 'toggle-btn', { 'completed': task.isCompleted })}
                    title={task.isCompleted ? 'Возобновить задачу' : 'Завершить задачу'}
                  >
                    <FaCheck />
                  </button>
                  
                  {/* Контент задачи */}
                  <div className="task-details">
                    <h3 className="task-title">
                      {task.title}
                    </h3>
                    
                    {task.description && (
                      <p className="task-description">
                        {task.description}
                      </p>
                    )}
                    
                    <div className="task-meta">
                      <span className="task-date" title="Дата создания">
                        📅 {formatDate(task.createdAt)}
                      </span>
                      {task.updatedAt && (
                        <span className="task-date" title="Дата последнего обновления">
                          ✏️ {formatDate(task.updatedAt)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Кнопки действий */}
                  <div className="task-actions">
                    <button 
                      onClick={() => handleDeleteTask(task.id)}
                      className="btn-icon danger delete-btn"
                      title="Удалить задачу"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
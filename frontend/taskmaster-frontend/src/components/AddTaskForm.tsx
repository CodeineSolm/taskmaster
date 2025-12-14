import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import type { CreateTaskDto } from '../types/task';
import { taskService } from '../services/api';
import './AddTaskForm.css';

interface AddTaskFormProps {
  onTaskAdded: () => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Название задачи обязательно');
      return;
    }

    const newTask: CreateTaskDto = {
      title: title.trim(),
      description: description.trim() || undefined,
    };

    try {
      setLoading(true);
      setError('');
      await taskService.createTask(newTask);

      setTitle('');
      setDescription('');

      onTaskAdded();
    } catch (err) {
      setError('Не удалось создать задачу');
      console.error('Ошибка создания задачи:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-task-form">
      <h2>Новая задача</h2>
      
      <div className="form-content">
        <form onSubmit={handleSubmit}>
          <div className="form-fields">
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Название задачи *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
                className="form-input"
                placeholder="Что нужно сделать?"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Описание (необязательно)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                className="form-textarea"
                placeholder="Детали задачи..."
              />
            </div>
          </div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading || !title.trim()}
            className="submit-btn"
          >
            <FaPlus />
            {loading ? 'Создание...' : 'Добавить задачу'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTaskForm;
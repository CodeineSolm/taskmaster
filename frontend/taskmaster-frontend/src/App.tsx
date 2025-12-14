import { useState } from 'react';
import './App.css';
import TaskList from './components/TaskList';
import AddTaskForm from './components/AddTaskForm';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTaskAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <h1>TaskMaster</h1>
        <p>Управление задачами</p>
      </header>

      <main className="app-main">
        <div className="app-main-left">
          <AddTaskForm onTaskAdded={handleTaskAdded} />
        </div>
        
        <div className="app-main-right">
          <TaskList key={refreshKey} />
        </div>
      </main>
    </div>
  );
}

export default App;
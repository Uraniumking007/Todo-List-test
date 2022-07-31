import { useEffect, useState } from 'react';
import Header from './conponent/Header';
import Tasks from './conponent/Tasks';
import AddTask from './conponent/AddTask';
import axios from 'axios';

const App = () => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function fetchTasks() {
      const res = await axios.get('http://localhost:8000/api/tasks');
      // const tasks = res.data
      setTasks(res.data.tasks);
    }
    fetchTasks();
  }, []);

  // Add Task

  const addTask = async task => {
    const res = await axios.post('http://localhost:8000/api/create/task', {
      ...task,
    });
    setTasks([res.data.task, ...tasks]);
  };

  // Delete Task

  const deleteTask = async id => {
    setTasks(tasks.filter(task => task.id !== id));
    const res = await axios.delete(
      `http://localhost:8000/api/delete/task?i${id}`
    );
    console.log({ deletedTask: res.data.task });
  };

  // Toggle Reminder

  const ToggleReminder = id => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, reminder: !task.reminder } : task
      )
    );
  };

  // Add Form

  return (
    <div className='container'>
      <Header
        onAdd={() => setShowAddTask(!showAddTask)}
        showAdd={showAddTask}
      />
      {showAddTask && <AddTask onAdd={addTask} />}
      {tasks.length > 0 ? (
        <Tasks tasks={tasks} onDelete={deleteTask} onToggle={ToggleReminder} />
      ) : (
        'No Tasks Imcomplete'
      )}
    </div>
  );
};

export default App;

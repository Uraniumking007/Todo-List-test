import { useState } from 'react';
import Header from './conponent/Header';
import Tasks from './conponent/Tasks';
import AddTask from './conponent/AddTask';
import axios from 'axios';

const App = () => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([
    {
      id: 1,
      text: 'Appoiontment to Doc',
      day: 'July 28 at 5:30pm',
      reminder: true,
    },
    {
      id: 2,
      text: 'Meeting at School',
      day: 'July 29 at 5:30pm',
      reminder: true,
    },
    {
      id: 3,
      text: 'Food Shopping',
      day: 'July 30 at 5:30pm',
      reminder: true,
    },
  ]);

  // Add Task

  const addTask = async task => {
    // const id = Math.floor(Math.random() * 1000) + 1;
    // const newTask = { id, ...task };
    // setTasks([...tasks, newTask]);
    const res = await axios.post('http://localhost:5000/api/tasks', {
      ...task,
    });
    console.log(res.data);
  };

  // Delete Task

  const deleteTask = id => {
    setTasks(tasks.filter(task => task.id !== id));
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

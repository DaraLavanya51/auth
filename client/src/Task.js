import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Task = ({ token }) => {
  const [tasks, setTasks] = useState([]);
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:3000/tasks', {
          headers: {
            Authorization: token,
          },
        });
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks', error);
      }
    };

    fetchTasks();
  }, [token]);

  const handleAddTask = async () => {
    try {
      const response = await axios.post('http://localhost:3000/tasks', {
        description,
      }, {
        headers: {
          Authorization: token,
        },
      });
      setTasks([...tasks, response.data]);
      setDescription('');
    } catch (error) {
      console.error('Error adding task', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/tasks/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error('Error deleting task', error);
    }
  };

  return (
    <div>
      <h2>Tasks</h2>
      <input
        type="text"
        placeholder="New task"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handleAddTask}>Add Task</button>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            {task.description}
            <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Task;

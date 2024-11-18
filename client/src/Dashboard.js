import React from 'react';
import Task from './Task';

const Dashboard = ({ token }) => {
  return (
    <div>
      <h2>Welcome to the Dashboard</h2>
      <p>This is a protected page that you can only see after logging in.</p>
      <Task token={token} />
    </div>
  );
};

export default Dashboard;

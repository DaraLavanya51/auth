import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Protected = ({ token }) => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/protected', {
          headers: {
            Authorization: token,
          },
        });
        setMessage(response.data);
      } catch (error) {
        setMessage('Access denied');
      }
    };

    fetchData();
  }, [token]);

  return <div>{message}</div>;
};

export default Protected;

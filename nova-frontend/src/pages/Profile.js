// src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get token from localStorage
    const token = localStorage.getItem('token');

    if (token) {
      // Send the token in the Authorization header for fetching user data
      axios
        .get('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
        })
        .then((response) => {
          setUserInfo(response.data); // Set user data to state
        })
        .catch((err) => {
          setError('Failed to fetch user data');
        });
    } else {
      setError('No token found');
    }
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Welcome, {userInfo.username}!</h2>
      <p>Email: {userInfo.email}</p>
      {/* Display other user data here */}
    </div>
  );
};

export default Profile;

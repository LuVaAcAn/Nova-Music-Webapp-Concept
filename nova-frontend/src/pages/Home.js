import React from 'react';
import Header from '../components/Header';
import UserList from '../components/UserList';

const Home = () => {
  return (
    <div>
      <Header />
      <h2>Welcome to the Home Page!</h2>
      <UserList />
    </div>
  );
};

export default Home;

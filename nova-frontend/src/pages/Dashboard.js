import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserGroup } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roomName, setRoomName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [stationName, setStationName] = useState('');
  const [stations, setStations] = useState([]);
  const [userIdToAdd, setUserIdToAdd] = useState({});

  const fetchRooms = async (userId, token) => {
    try {
      const response = await fetch(`http://localhost:3000/api/rooms/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const rooms = await response.json();
        setRooms(rooms);
      } else {
        console.error('Failed to fetch rooms');
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const fetchStations = async (userId, token) => {
    try {
      const response = await fetch(`http://localhost:3000/api/radios/user/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        //console.log('Fetched Stations:', data); // Log the fetched station data
        setStations(data); // Assuming you're using state to store stations
      } else {
        alert('Failed to fetch stations');
      }
    } catch (error) {
      console.error('Error fetching stations:', error);
      alert('An error occurred while fetching stations');
    }
  };
  


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      setLoading(false);
      return;
    }

    const decoded = jwtDecode(token);
    setUser(decoded);
    const userId = decoded.userId;

    fetchRooms(userId, token);
    fetchStations(userId, token);
  }, [navigate]);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found');
      return;
    }

    const decoded = jwtDecode(token);
    const userId = decoded.userId;

    try {
      const response = await fetch('http://localhost:3000/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          room_name: roomName,
          is_private: isPrivate,
          created_by: userId,
        }),
      });

      if (response.status === 201) {
        alert('Room created successfully!');
        setRoomName('');
        setIsPrivate(false);
        fetchRooms(userId, token);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to create room');
      }
    } catch (error) {
      alert('An error occurred while creating the room');
    }
  };

  const handleUserIdChange = (e, stationId) => {
    const value = e.target.value;
    setUserIdToAdd((prevState) => ({
      ...prevState,
      [stationId]: value,
    }));
  };
  

  //ADD USER TO RADIO STATION
  const handleAddUser = async (stationId) => {
    const userId = userIdToAdd[stationId];
    if (!userId) {
      alert("Please provide a valid user ID.");
      return;
    }
  
    const token = localStorage.getItem('token');
    
    console.log(`Adding User: stationId=${stationId}, userId=${userId}`); // Log the station and user ID
  
    try {
      const response = await fetch(`http://localhost:3000/api/radios/station_users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ station_id: stationId, user_id: userId }),
      });
  
      if (response.ok) {
        console.log(`User successfully added to station ${stationId}`); // Log success
        alert('User added successfully!');
        fetchStations(user.userId, token); // Refresh the stations list
      } else {
        const data = await response.json();
        console.error(data.error || 'Failed to add user');
        alert(data.error || 'Failed to add user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert('An error occurred while adding the user');
    }
  };
  
  const handleRemoveUser = async (stationId) => {
    const userId = userIdToAdd[stationId];
    if (!userId) {
      alert("Please provide a valid user ID.");
      return;
    }
  
    const token = localStorage.getItem('token');
    
    console.log(`Removing User: stationId=${stationId}, userId=${userId}`); // Log station and user ID
  
    try {
      const response = await fetch(`http://localhost:3000/api/radios/station_users/${stationId}/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        console.log(`User successfully removed from station ${stationId}`); // Log success
        alert('User removed successfully!');
        fetchStations(user.userId, token); // Refresh the stations list
      } else {
        const data = await response.json();
        console.error(data.error || 'Failed to remove user');
        alert(data.error || 'Failed to remove user');
      }
    } catch (error) {
      console.error('Error removing user:', error);
      alert('An error occurred while removing the user');
    }
  };
  
  
  
  //END RADIO

  const handleCreateStation = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found');
      return;
    }

    const decoded = jwtDecode(token);
    const userId = decoded.userId;

    try {
      const response = await fetch('http://localhost:3000/api/radios/radio_stations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          station_name: stationName,
          created_by: userId,
        }),
      });

      if (response.status === 201) {
        alert('Radio station created successfully!');
        setStationName('');
        fetchStations(userId, token);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to create station');
      }
    } catch (error) {
      alert('An error occurred while creating the station');
    }
  };

  const handleDeleteRoom = async (roomId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/api/rooms/${roomId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Room deleted successfully!');
        fetchRooms(user.userId, token);
      } else {
        alert('Failed to delete room');
      }
    } catch (error) {
      console.error('Error deleting room:', error);
      alert('An error occurred while deleting the room');
    }
  };

  const handleDeleteStation = async (stationId) => {
    const token = localStorage.getItem('token');
    try {
      // Fetch request to delete the station
      const response = await fetch(`http://localhost:3000/api/radios/radio_stations/${stationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',  // Ensure Content-Type is set
        },
      });
  
      // Check if the request was successful
      if (response.ok) {
        alert('Station deleted successfully!');
        fetchStations(user.userId, token);  // Re-fetch stations after deletion
      } else {
        const data = await response.json();  // Get error message from server
        alert(data.error || 'Failed to delete station');
      }
    } catch (error) {
      console.error('Error deleting station:', error);
      alert('An error occurred while deleting the station');
    }
  };
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="container">
      <div className="subcontainer">
        <div className="welcome-user">
          <h1><span>¡Bienvenido, </span><span id="welcome-name">{user ? user.username : 'User'}!</span></h1>

          <div className="user-info">
            <p><span>Estado de Membresía: </span>{user ? (user.has_membership ? 'Active' : 'Inactive') : ''}</p>
            <p><span>Expira en: </span>{user ? (user.created_at ? new Date(user.created_at.replace(' ', 'T')).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'No Aplica') : ''}</p>
          </div>
        </div>

        <div className="dashboard-sections">
          <div className="rooms dashboard-section">
            <h2>Tus Salas</h2>
            <ul>
              {rooms.length > 0 ? (
                rooms.map((room) => (
                  <li key={room.room_id}>
                    <FontAwesomeIcon className="groupicon" icon={faUserGroup} />
                    <div className="rooms-roomdetails">
                      <Link style={{ textDecoration: 'none', color: 'white' }} to={`/messages/${room.room_id}`}>{room.room_name}</Link>
                      <button onClick={() => handleDeleteRoom(room.room_id)}>Delete</button>
                    </div>
                  </li>
                ))
              ) : (
                <li>No rooms available</li>
              )}
            </ul>
            <form onSubmit={handleCreateRoom}>
              <div className="formonSubmit-prin">
                <h3>Crear una Sala</h3>
                <div className="formonSubmit">
                  <label htmlFor="room-name">Room Name:</label>
                  <input
                    type="text"
                    id="room-name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    required
                    />
                </div>
                <div className="formonSubmit">
                  <label htmlFor="is-private">Private Room:</label>
                  <input
                    type="checkbox"
                    id="is-private"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    />
                </div>
                <button type="submit">Crear Sala</button>
              </div>
            </form>
          </div>

          <div className="stations dashboard-section">
            <h2>Estaciones de Radio</h2>
            <ul>
              {stations.length > 0 ? (
                stations.map((station) => {
                  //console.log('Station:', station); // Log each station's info
                  return (
                    <li key={station.station_id}>
                      <div className="radiostation-info">
                        <img className="radiostation-templimg" src={require("../images/radiostation-templ.webp")}></img>
                        <div className="radiostation-infotext">
                          <Link  to={`/station/${station.station_id}`}>{station.station_name}</Link>
                          <span>{station.user_count} usuario(s)</span>
                        </div>
                      </div>

                      {/* Add/remove user inputs and buttons */}
                      <div className="radiostation-users">
                        <input
                          type="text"
                          placeholder="User ID"
                          value={userIdToAdd[station.station_id] || ""}
                          onChange={(e) => handleUserIdChange(e, station.station_id)}
                          />
                        <button onClick={() => handleAddUser(station.station_id)}>
                          Agregar Usuario
                        </button>
                        <button onClick={() => handleRemoveUser(station.station_id)}>
                          Quitar Usuario
                        </button>
                        <div className="deletestation">
                          <button id="deletestation" onClick={() => handleDeleteStation(station.station_id)}>
                            Borrar Estación
                          </button>
                        </div>
                      </div>

                    </li>
                  );
                })
              ) : (
                <li>No radio stations available</li>
              )}
            </ul>

            <form onSubmit={handleCreateStation}>
              <div className="formonSubmit-prin">
                <h3>Crear una Estación</h3>
                <div className="formonSubmit">
                  <label htmlFor="station-name">Station Name:</label>
                  <input
                    type="text"
                    id="station-name"
                    value={stationName}
                    onChange={(e) => setStationName(e.target.value)}
                    required
                    />
                </div>
                <button type="submit">Create Station</button>
              </div>
            </form>
          </div>
          
        </div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;

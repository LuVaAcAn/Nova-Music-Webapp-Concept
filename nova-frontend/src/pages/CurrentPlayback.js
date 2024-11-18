import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './CurrentPlayback.css';

const CurrentPlayback = () => {
  const { stationId } = useParams();  // Get stationId from URL parameters
  const [tracks, setTracks] = useState([]);  // State to hold the list of tracks (playlist)
  const [loading, setLoading] = useState(true);
  const [trackUrl, setTrackUrl] = useState('');  // State to hold the input URL

  // Define fetchTracks function to fetch tracks from the backend
  const fetchTracks = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/playback/current_playback/station/${stationId}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        alert('Failed to fetch current tracks');
      } else {
        const data = await response.json();
        setTracks(data);  // Set the fetched tracks to state
      }
    } catch (error) {
      console.error('Error fetching current tracks:', error);
      alert('An error occurred while fetching the current tracks');
    }
    setLoading(false);
  };

  // Fetch tracks on component mount (when stationId changes)
  useEffect(() => {
    fetchTracks(); // Call fetchTracks when the component mounts or stationId changes
  }, [stationId]);

  const handleInputChange = (e) => {
    setTrackUrl(e.target.value);
  };

  const handleAddTrack = async (e) => {
    e.preventDefault();
  
    if (!trackUrl) {
      alert('Please provide a track URL');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3000/api/playback/current_playback`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          track_url: trackUrl,
          station_id: stationId
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        alert('Failed to add track');
      } else {
        alert('Track added successfully');
        setTrackUrl(''); // Clear the input field after submitting
        fetchTracks();  // Re-fetch the tracks after adding a new track
      }
    } catch (error) {
      console.error('Error adding track:', error);
      alert('An error occurred while adding the track');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="current-playback-container">
      <h2>Current Tracks Playing on Station</h2>

      {/* Display the playlist of tracks */}
      {tracks.length > 0 ? (
        <div className="track-list">
          <h3>Playlist</h3>
          <ul>
            {tracks.map((track, index) => (
              <li key={index}>
                <a href={track.track_url} target="_blank" rel="noopener noreferrer">
                  {track.track_url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No tracks available</p>
      )}

      {/* Add New Track Form */}
      <h3>Add a new track</h3>
      <form onSubmit={handleAddTrack}>
        <div>
          <label>Track URL:</label>
          <input
            type="url"
            value={trackUrl}
            onChange={handleInputChange}
            placeholder="Enter track URL"
            required
          />
        </div>
        <button type="submit">Add Track</button>
      </form>
    </div>
  );
};

export default CurrentPlayback;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const MessagesPage = () => {
  const { room_id } = useParams(); // Get room_id from the URL
  const [messages, setMessages] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [newMessage, setNewMessage] = useState(""); // Track new message input

  // Fetch messages and user names
  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/messages/room/${room_id}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error fetching messages: ${errorText}`);
      }

      const data = await response.json();
      setMessages(data);

      const userIds = [...new Set(data.map(msg => msg.user_id))];

      const usersResponse = await fetch(`http://localhost:3000/api/users?user_ids=${userIds.join(',')}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        }
      });

      if (!usersResponse.ok) {
        const usersErrorText = await usersResponse.text();
        throw new Error(`Error fetching user details: ${usersErrorText}`);
      }

      const usersData = await usersResponse.json();
      const namesMap = usersData.reduce((map, user) => {
        map[user.user_id] = user.username;
        return map;
      }, {});

      setUserNames(namesMap);
    } catch (error) {
      console.error('Error fetching messages or user details:', error);
    }
  };

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
  }, [room_id]);

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
  
      const response = await fetch(`http://localhost:3000/api/messages/chat`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          room_id: room_id,
          content: newMessage,
          user_id: userId // Include the user_id in the body
        })
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error sending message: ${errorText}`);
      }
  
      // Fetch the updated messages after sending
      setNewMessage(""); // Clear the input field
      fetchMessages(); // Re-fetch messages to include the new one
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Sort messages based on sent_at timestamp
  const sortedMessages = [...messages].sort((a, b) => new Date(a.sent_at) - new Date(b.sent_at)); // Sort by date ascending

  return (
    <div>
      <h2>Messages for Room ID: {room_id}</h2>
      <div>
        {sortedMessages.length > 0 ? (
          sortedMessages.map((msg) => (  // Display sorted messages
            <div key={msg.message_id}>
              <p><strong>{userNames[msg.user_id] || 'Unknown User'}:</strong> {msg.content}</p>
              <p><small>{new Date(msg.sent_at).toLocaleString()}</small></p>
            </div>
          ))
        ) : (
          <p>No messages found for this room.</p>
        )}
      </div>

      {/* New message form */}
      <div>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message here"
          rows="4"
          cols="50"
        />
        <button onClick={handleSendMessage}>Send Message</button>
      </div>
    </div>
  );
};

export default MessagesPage;

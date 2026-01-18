import React, { useState } from 'react';

const MessagesPage = () => {
  const friends = [
    {
      id: 0,
      name: 'AI Assistant',
      avatar: 'https://via.placeholder.com/40',
      lastMessage: '',
      time: 'Just now',
    },
    {
      id: 1,
      name: 'John Doe',
      avatar: 'https://via.placeholder.com/40',
      lastMessage: 'Hey, how are you?',
      time: '2h ago',
    },
    {
      id: 2,
      name: 'Jane Smith',
      avatar: 'https://via.placeholder.com/40',
      lastMessage: 'Let’s catch up soon!',
      time: '1d ago',
    },
    {
      id: 3,
      name: 'Alex Johnson',
      avatar: 'https://via.placeholder.com/40',
      lastMessage: 'Did you check the link?',
      time: '3d ago',
    },
  ];

  const allMessages = {
    0: [
      { id: 1, text: 'Hello, how can I assist you today?', sender: 'AI Assistant', time: 'Dec 12, 2024, 10:00 AM' },
    ],
    1: [
      { id: 1, text: 'Hey, how are you?', sender: 'John Doe', avatar: friends[1].avatar, time: 'Dec 12, 2024, 1:05 PM' },
      { id: 2, text: 'I’m good! What about you?', sender: 'You', time: 'Dec 12, 2024, 1:10 PM' },
    ],
    2: [
      { id: 1, text: 'Let’s catch up soon!', sender: 'Jane Smith', avatar: friends[2].avatar, time: 'Dec 11, 2024, 5:00 PM' },
    ],
    3: [
      { id: 1, text: 'Did you check the link?', sender: 'Alex Johnson', avatar: friends[3].avatar, time: 'Dec 10, 2024, 9:15 PM' },
    ],
  };

  const [selectedFriendId, setSelectedFriendId] = useState(null);

  const selectedMessages = selectedFriendId !== null ? allMessages[selectedFriendId] : [];

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Left Sidebar */}
      <div style={{ width: '30%', borderRight: '1px solid #ddd', overflowY: 'auto' }}>
        <div style={{ padding: '10px', fontWeight: 'bold', fontSize: '18px' }}>Messages</div>
        <div>
          {friends.map((friend) => (
            <div
              key={friend.id}
              onClick={() => setSelectedFriendId(friend.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                cursor: 'pointer',
                borderBottom: '1px solid #f0f0f0',
                background: friend.id === selectedFriendId ? '#f7f7f7' : 'transparent',
              }}
            >
              <img
                src={friend.avatar}
                alt={friend.name}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  marginRight: '10px',
                }}
              />
              <div>
                <div style={{ fontWeight: 'bold' }}>{friend.name}</div>
                <div style={{ fontSize: '12px', color: '#888' }}>
                  {friend.id === 0 ? 'AI Assistant' : friend.lastMessage}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Message Box */}
      <div style={{ width: '70%', display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            padding: '10px',
            borderBottom: '1px solid #ddd',
            fontWeight: 'bold',
            fontSize: '18px',
          }}
        >
          {selectedFriendId !== null
            ? friends.find((friend) => friend.id === selectedFriendId).name
            : 'Select a conversation'}
        </div>
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          {selectedMessages.map((message) => (
            <div
              key={message.id}
              style={{
                alignSelf: message.sender === 'You' ? 'flex-end' : 'flex-start',
                display: 'flex',
                flexDirection: message.sender === 'You' ? 'column' : 'row',
                gap: '10px',
                maxWidth: '70%',
              }}
            >
              {message.sender !== 'You' && message.avatar && (
                <img
                  src={message.avatar}
                  alt={message.sender}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    alignSelf: 'flex-start',
                  }}
                />
              )}
              <div>
                <div
                  style={{
                    fontSize: '10px',
                    color: '#888',
                    textAlign: message.sender === 'You' ? 'right' : 'left',
                  }}
                >
                  {message.time}
                </div>
                <div
                  style={{
                    background: message.sender === 'You' ? '#007bff' : '#f0f0f0',
                    color: message.sender === 'You' ? '#fff' : '#000',
                    padding: '10px',
                    borderRadius: '20px',
                  }}
                >
                  {message.text}
                </div>
              </div>
            </div>
          ))}
        </div>
        {selectedFriendId !== null && (
          <div style={{ borderTop: '1px solid #ddd', padding: '10px' }}>
            <input
              type="text"
              placeholder="Type a message..."
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '20px',
                border: '1px solid #ddd',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;

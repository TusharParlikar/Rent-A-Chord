import React, { useState } from 'react';
import axios from 'axios';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleChatBot = () => {
    setIsOpen((prev) => !prev);
  };

  const handleQuerySubmit = async () => {
    if (query.trim() === '') {
      alert('Please enter a query!');
      return;
    }

    setLoading(true);
    setResponse('');
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/chat', { query });
      setResponse(res.data.response);
    } catch (err) {
      console.error('Error fetching AI response:', err);

      // Ensure error is always a string
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Unable to connect to the server. Please try again later.');
      }
    } finally {
      setLoading(false);
      setQuery('');
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-button" onClick={toggleChatBot}>
        💬
      </div>

      {isOpen && (
        <div className="chatbot-dropdown">
          <h3 className="chatbot-header">Chat Bot</h3>
          <input
            type="text"
            placeholder="Enter your query..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="chatbot-input"
          />
          <button className="chatbot-submit" onClick={handleQuerySubmit} disabled={loading}>
            {loading ? 'Loading...' : 'Submit'}
          </button>
          {response && <p className="chatbot-response">{response}</p>}
          {error && <p className="chatbot-error">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default ChatBot;

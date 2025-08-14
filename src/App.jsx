import { useState } from 'react';
import './App.css';

// ✅ Production webhook URL
const WEBHOOK_URL = 'https://vahini.app.n8n.cloud/webhook/send-message';

// ✅ Hasura GraphQL endpoint (via webhook)
const HASURA_URL = WEBHOOK_URL;

// 🔐 Hasura admin secret
const ADMIN_SECRET = 'ar1#8G!g,)A^Ul3HmGjV(JwrdX=aixOA';

// 🔁 GraphQL mutation to insert message
const INSERT_MESSAGE = `
  mutation InsertMessage($sender: String!, $content: String!) {
    insert_messages_one(object: {
      sender: $sender,
      content: $content
    }) {
      content
    }
  }
`;

// 🔁 Function to send message to Hasura
const sendMessageToHasura = async (sender, content) => {
  const response = await fetch(HASURA_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': ADMIN_SECRET
    },
    body: JSON.stringify({
      query: INSERT_MESSAGE,
      variables: { sender, content }
    })
  });
  const result = await response.json();
  return result.data?.insert_messages_one;
};

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = { sender: 'user', content: trimmed };
    setMessages(prev => [...prev, userMessage]);
    await sendMessageToHasura('user', trimmed);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed })
      });
      const data = await response.json();
      const botReply = typeof data.bot === 'string' ? data.bot : 'No response from chatbot.';
      const botMessage = { sender: 'bot', content: botReply };
      setMessages(prev => [...prev, botMessage]);
      await sendMessageToHasura('bot', botReply);
    } catch (error) {
      const errorMessage = { sender: 'bot', content: 'Error contacting chatbot API.' };
      setMessages(prev => [...prev, errorMessage]);
      await sendMessageToHasura('bot', errorMessage.content);
    }

    setInput('');
  };

  return (
    <div className="chat-container">
      <h1>Chatbot</h1>
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            <strong>{msg.sender}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;

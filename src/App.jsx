import { useState } from 'react';
import './App.css';

// ✅ Correct URLs
const WEBHOOK_URL = 'https://vahini.app.n8n.cloud/webhook/send-message';
const HASURA_URL = 'https://juivpqeyjtsbtkalhpol.hasura.ap-south-1.nhost.run/v1/graphql';
const ADMIN_SECRET = 'ar1#8G!g,)A^Ul3HmGjV(JwrdX=aixOA';

// ✅ GraphQL mutation
const INSERT_MESSAGE = `
  mutation InsertMessage($sender: String!, $content: String!) {
    insert_messages_one(object: { sender: $sender, content: $content }) {
      content
    }
  }
`;

// ✅ Send message to Hasura
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response format");
      }

      const data = await response.json();
      console.log("Webhook response:", data);

      const botReply = typeof data.bot === 'string' ? data.bot : 'No response from chatbot.';
      const botMessage = { sender: 'bot', content: botReply };
      setMessages(prev => [...prev, botMessage]);
      await sendMessageToHasura('bot', botReply);

    } catch (error) {
      console.error("Webhook error:", error);
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

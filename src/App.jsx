import { useState } from 'react';
import './App.css';

const HASURA_URL = 'https://juivpqeyjtsbtkalhpol.hasura.ap-south-1.nhost.run/v1/graphql';
const ADMIN_SECRET = 'ar1#8G!g,)A^Ul3HmGjV(JwrdX=aixOA.';
const OPENROUTER_API_KEY = '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';

const INSERT_MESSAGE = `
  mutation InsertMessage($sender: String!, $text: String!) {
    insert_messages_one(object: { sender: $sender, text: $text }) {
      id
      text
    }
  }
`;

const sendMessageToHasura = async (sender, text) => {
  const response = await fetch(HASURA_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': ADMIN_SECRET
    },
    body: JSON.stringify({
      query: INSERT_MESSAGE,
      variables: { sender, text }
    })
  });

  const result = await response.json();
  return result.data?.insert_messages_one;
};

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    await sendMessageToHasura('user', input);

    try {
      const botReply = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'mistral/mistral-7b',
          messages: [{ role: 'user', content: input }]
        })
      }).then(res => res.json());

      const botText = botReply.choices?.[0]?.message?.content || 'No response';
      const botMessage = { sender: 'bot', text: botText };
      setMessages(prev => [...prev, botMessage]);
      await sendMessageToHasura('bot', botText);
    } catch (error) {
      const errorMessage = { sender: 'bot', text: 'Error contacting chatbot API.' };
      setMessages(prev => [...prev, errorMessage]);
      await sendMessageToHasura('bot', errorMessage.text);
    }

    setInput('');
  };

  return (
    <div className="chat-container">
      <h1>Chatbot</h1>
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            <strong>{msg.sender}:</strong> {msg.text}
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

import { useAuthenticationStatus, useUserData } from '@nhost/react'
import Auth from './Auth'
import ChatList from './ChatList'
import MessageList from './MessageList'
import SendMessage from './SendMessage'
import { useState } from 'react'

function App() {
  const { isAuthenticated } = useAuthenticationStatus()
  const user = useUserData()
  const [chatId, setChatId] = useState<string | null>(null)

  if (!isAuthenticated) return <Auth />

  return (
    <div>
      <h1>Welcome, {user?.email}</h1>
      <ChatList onSelect={setChatId} />
      {chatId && (
        <>
          <MessageList chatId={chatId} />
          <SendMessage chatId={chatId} />
        </>
      )}
    </div>
  )
}

export default App

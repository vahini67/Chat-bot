import { gql, useMutation } from '@apollo/client'
import { useState } from 'react'

const SEND_USER_MESSAGE = gql`
  mutation InsertMessage($chat_id: uuid!, $content: String!) {
    insert_messages_one(object: {
      chat_id: $chat_id,
      content: $content,
      role: "user"
    }) {
      id
    }
  }
`

const TRIGGER_BOT = gql`
  mutation TriggerBot($chat_id: uuid!, $content: String!) {
    sendMessage(chat_id: $chat_id, content: $content)
  }
`

export default function SendMessage({ chatId }: { chatId: string }) {
  const [text, setText] = useState('')
  const [sendUserMessage] = useMutation(SEND_USER_MESSAGE)
  const [triggerBot] = useMutation(TRIGGER_BOT)

  const handleSend = async () => {
    await sendUserMessage({ variables: { chat_id: chatId, content: text } })
    await triggerBot({ variables: { chat_id: chatId, content: text } })
    setText('')
  }

  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleSend}>Send</button>
    </div>
  )
}
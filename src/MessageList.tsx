import { gql, useSubscription } from '@apollo/client'

const MESSAGE_SUBSCRIPTION = gql`
  subscription OnMessages($chat_id: uuid!) {
    messages(where: { chat_id: { _eq: $chat_id } }, order_by: { created_at: asc }) {
      id
      content
      role
    }
  }
`

export default function MessageList({ chatId }: { chatId: string }) {
  const { data, loading } = useSubscription(MESSAGE_SUBSCRIPTION, {
    variables: { chat_id: chatId }
  })

  if (loading) return <p>Loading messages...</p>

  return (
    <div>
      {data.messages.map(msg => (
        <p key={msg.id}><strong>{msg.role}:</strong> {msg.content}</p>
      ))}
    </div>
  )
}
import { gql, useQuery } from '@apollo/client'

const GET_CHATS = gql`
  query GetChats {
    chats(order_by: { created_at: desc }) {
      id
      title
    }
  }
`

export default function ChatList({ onSelect }: { onSelect: (id: string) => void }) {
  const { data, loading, error } = useQuery(GET_CHATS)

  if (loading) return <p>Loading chats...</p>
  if (error) return <p>Error loading chats</p>

  return (
    <ul>
      {data.chats.map(chat => (
        <li key={chat.id} onClick={() => onSelect(chat.id)}>
          {chat.title}
        </li>
      ))}
    </ul>
  )
}
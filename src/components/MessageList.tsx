// src/components/MessageList.tsx

interface Message {
  id: string
  userId: string
  content: string
  timestamp: string
}

interface MessageListProps {
  messages: Message[]
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div className='message-list'>
      {messages.map((msg) => (
        <div
          key={msg.id}
          className='message'
        >
          <strong>{msg.userId}:</strong> {msg.content}
        </div>
      ))}
    </div>
  )
}

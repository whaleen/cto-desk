// src/components/ChatInput.tsx

import { Dispatch, SetStateAction, useState } from 'react'

interface Message {
  id: string
  content: string
  projectId: string
  visibility: 'public' | 'private'
}

interface ChatInputProps {
  projectId: string
  visibility: 'public' | 'private'
  setMessages: Dispatch<SetStateAction<Message[]>>
}

export default function ChatInput({
  projectId,
  visibility,
  setMessages,
}: ChatInputProps) {
  const [newMessage, setNewMessage] = useState('')

  const sendMessage = async () => {
    const response = await fetch(`/api/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, content: newMessage, visibility }),
    })
    const message: Message = await response.json()
    setMessages((prevMessages) => [message, ...prevMessages])
    setNewMessage('')
  }

  return (
    <div>
      <input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder={`Type a ${visibility} message...`}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  )
}

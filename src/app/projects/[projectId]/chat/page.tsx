// src/app/projects/[projectId]/chat/page.tsx

'use client'

import { useState, useEffect } from 'react'
import ChatInput from '@/components/ChatInput'
import MessageList from '@/components/MessageList'

interface ProjectChatProps {
  params: {
    projectId: string
  }
}

export default function ProjectChat({ params }: ProjectChatProps) {
  const { projectId } = params
  const [tab, setTab] = useState<'public' | 'private'>('public')
  const [messages, setMessages] = useState([])

  useEffect(() => {
    async function fetchMessages() {
      const res = await fetch(`/api/messages/${projectId}?visibility=${tab}`)
      const data = await res.json()
      setMessages(data)
    }
    fetchMessages()
  }, [projectId, tab])

  return (
    <div>
      <div className='tab-buttons'>
        <button onClick={() => setTab('public')}>Public</button>
        <button onClick={() => setTab('private')}>Private</button>
      </div>
      <MessageList messages={messages} />
      <ChatInput
        projectId={projectId}
        visibility={tab}
        setMessages={setMessages}
      />
    </div>
  )
}

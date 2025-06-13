import { getMessages } from '@/actions/chat.action'
import React from 'react'
import Messages from './Messages';

export default async function MessagesWrapper({chatId}: {chatId: string}) {
  const messages = await getMessages(chatId);
  return (
    <Messages initialMessages={messages}/>
  )
}

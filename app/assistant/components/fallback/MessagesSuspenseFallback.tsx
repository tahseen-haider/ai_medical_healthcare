import React from 'react'
import ChatSuspenseFallbackMessage from './ChatSuspenseFallbackMessage'

export default function MessagesSuspenseFallback() {
  return (
    <div className="w-full h-[calc(100vh-65px-120px)] overflow-y-scroll">
      <div className="w-5/6 lg:w-4/6 mx-auto flex flex-col">
        <div className="w-full flex justify-center mt-4 gap-2 flex-col text-center pb-12">
          <h1 className="font-bold font-ubuntu text-3xl text-gray-400 animate-pulse">MediTech</h1>
          <p className="text-gray-400 leading-4 animate-pulse">
            Loading chat messages...
          </p>
        </div>
        {[false, true, false].map((isUser, i) => (
          <ChatSuspenseFallbackMessage key={i} isUser={isUser} />
        ))}
      </div>
    </div>
  )
}

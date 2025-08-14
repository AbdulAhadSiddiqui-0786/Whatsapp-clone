import React, { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({ chat, onSendMessage }) {
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !chat?._id) return;
    onSendMessage(chat._id, text); // Pass data up to App component
    setText("");
  };

  if (!chat) {
    return (
      <div className="hidden md:flex flex-1 items-center justify-center text-gray-500 dark:text-gray-400">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-100 dark:bg-wa-dark">
      <div className="p-4 border-b dark:border-wa-gray font-semibold sticky top-0 bg-white dark:bg-wa-gray z-10">
        {chat.contactName || chat._id}
      </div>
      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        {chat.messages.map((msg) => (
          <MessageBubble key={msg._id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleSend}
        className="p-4 flex border-t dark:border-wa-gray bg-white dark:bg-wa-gray"
      >
        <input
          className="flex-1 border dark:border-wa-gray rounded-full px-4 py-2 mr-2 focus:outline-none bg-gray-50 dark:bg-wa-dark dark:text-white"
          placeholder="Type a message"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          className="bg-wa-green text-white px-4 py-2 rounded-full"
        >
          Send
        </button>
      </form>
    </div>
  );
}

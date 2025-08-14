import React from "react";
import StatusTicks from "./StatusTicks"; // 1. Import the new component

export default function MessageBubble({ message }) {
  // A more robust way to check if the message is yours
  const isMine = message.from === "me";

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-lg max-w-xs shadow-sm text-sm ${
          isMine
            ? "bg-wa-chat text-white rounded-br-none"
            : "bg-white dark:bg-wa-gray dark:text-white rounded-bl-none"
        }`}
      >
        {/* Make sure you are using message.text here! */}
        <div>{message.text}</div>

        <div className="text-[10px] opacity-70 text-right mt-1 flex items-center justify-end space-x-1">
          <span>
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          {/* 2. Replace the status text with the new component, only if it's your message */}
          {isMine && <StatusTicks status={message.status} />}
        </div>
      </div>
    </div>
  );
}

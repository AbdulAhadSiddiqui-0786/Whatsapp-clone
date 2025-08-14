import React from "react";
import dayjs from "dayjs";

export default function Sidebar({ conversations, onSelect, selectedId }) {
  return (
    <div className="w-full md:w-1/3 border-r dark:border-wa-gray bg-white dark:bg-wa-dark overflow-y-auto">
      <div className="p-4 font-bold text-lg border-b dark:border-wa-gray sticky top-0 bg-white dark:bg-wa-dark z-10">
        WhatsApp Clone
      </div>
      {conversations.map((convo) => {
        const lastMessage = convo.messages[convo.messages.length - 1];
        return (
          <div
            key={convo._id}
            onClick={() => onSelect(convo._id)}
            className={`p-4 border-b dark:border-wa-gray cursor-pointer hover:bg-gray-100 dark:hover:bg-wa-dark transition-colors ${
              selectedId === convo._id ? "bg-gray-200 dark:bg-wa-gray" : ""
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="font-semibold">
                {convo.contactName || convo._id}
              </div>
              {lastMessage && (
                <div className="text-xs text-gray-400">
                  {dayjs(lastMessage.timestamp).format("HH:mm")}
                </div>
              )}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-300 truncate">
              {lastMessage?.text || "No messages yet"}
            </div>
          </div>
        );
      })}
    </div>
  );
}

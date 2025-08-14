import React from "react";
import dayjs from "dayjs";

export default function ConversationList({
  conversations,
  onSelect,
  selected,
}) {
  return (
    <div className="w-1/3 border-r h-screen overflow-y-auto">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">WhatsApp Clone</h2>
      </div>
      {conversations.map((c) => (
        <div
          key={c._id}
          onClick={() => onSelect(c)}
          className={`p-4 border-b cursor-pointer hover:bg-gray-100 ${
            selected?._id === c._id ? "bg-gray-200" : ""
          }`}
        >
          <div className="font-medium">{c.name}</div>
          <div className="text-sm text-gray-500 truncate">
            {c.lastMessage?.text || "No messages yet"}
          </div>
          {c.lastMessage?.timestamp && (
            <div className="text-xs text-gray-400">
              {dayjs(c.lastMessage.timestamp).format("HH:mm")}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

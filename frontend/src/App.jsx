import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import { getConversations, sendMessage as apiSendMessage } from "./lib/api";
import { io } from "socket.io-client";
import useDarkMode from "./hooks/useDarkMode";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

export default function App() {
  const [conversations, setConversations] = useState([]); // Use an array for efficiency
  const [activeChatId, setActiveChatId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useDarkMode();

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getConversations();
        setConversations(data);
        setError(null);
      } catch (err) {
        setError(
          "Failed to load conversations. Is the backend server running?"
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Set up socket connection
  useEffect(() => {
    const socket = io(
      import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"
    );

    socket.on("newMessage", (newMessage) => {
      setConversations((prev) => {
        const conversationIndex = prev.findIndex(
          (c) => c._id === newMessage.wa_id
        );

        // If it's a new conversation
        if (conversationIndex === -1) {
          // This part would require fetching the new contact's details
          // For now, we'll just log it. A full implementation would handle this.
          console.log("Received message for a new conversation:", newMessage);
          return prev;
        }
        if (conversationIndex === -1) {
          // If it's a new conversation, create it.
          const newConversation = {
            _id: newMessage.wa_id, // Group ID is the user's wa_id
            contactName: newMessage.contactName,
            messages: [newMessage],
          };
          // Add the new conversation and re-sort the list by the most recent message
          const updatedList = [newConversation, ...prev];
          updatedList.sort((a, b) => {
            const lastMsgTimestampA = new Date(
              a.messages[a.messages.length - 1].timestamp
            ).getTime();
            const lastMsgTimestampB = new Date(
              b.messages[b.messages.length - 1].timestamp
            ).getTime();
            return lastMsgTimestampB - lastMsgTimestampA;
          });
          return updatedList;
        }

        // If it's an existing conversation
        const updatedConversations = [...prev];
        const updatedConversation = {
          ...updatedConversations[conversationIndex],
        };

        // Avoid adding duplicate messages (can happen with optimistic UI)
        if (
          !updatedConversation.messages.some(
            (m) => m._id === newMessage._id || m.tempId === newMessage.tempId
          )
        ) {
          updatedConversation.messages.push(newMessage);
        }

        updatedConversations[conversationIndex] = updatedConversation;
        return updatedConversations;
      });
    });

    return () => socket.disconnect();
  }, []);

  // Optimistic UI send message handler
  const handleSendMessage = useCallback(async (wa_id, text) => {
    const tempId = Date.now().toString(); // Create a temporary ID
    const optimisticMessage = {
      _id: tempId, // Use tempId as key
      tempId, // Keep track of it
      wa_id,
      text,
      from: "me",
      status: "pending",
      timestamp: new Date().toISOString(),
    };

    // Immediately update the UI
    setConversations((prev) => {
      const conversationIndex = prev.findIndex((c) => c._id === wa_id);
      if (conversationIndex === -1) return prev;

      const updatedConversations = [...prev];
      const updatedConversation = {
        ...updatedConversations[conversationIndex],
      };
      updatedConversation.messages.push(optimisticMessage);
      updatedConversations[conversationIndex] = updatedConversation;

      return updatedConversations;
    });

    // Send the message to the backend
    try {
      await apiSendMessage({ wa_id, text, contactName: "You" });
      // The socket event will handle updating the message from "pending" to "sent"
    } catch (error) {
      console.error("Failed to send message", error);
      // Revert the UI or show an error on the specific message
    }
  }, []);

  const activeChat = conversations.find((c) => c._id === activeChatId);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading chats...
      </div>
    );
  if (error)
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        {error}
      </div>
    );

  return (
    <div className="flex h-screen font-whatsapp dark:bg-wa-dark dark:text-white transition-colors duration-300">
      <Sidebar
        conversations={conversations}
        onSelect={setActiveChatId}
        selectedId={activeChatId}
      />
      <ChatWindow chat={activeChat} onSendMessage={handleSendMessage} />
      <button
        className="absolute top-4 right-4 p-2 rounded-full bg-wa-green text-white shadow-lg z-20"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? (
          <SunIcon className="h-5 w-5" />
        ) : (
          <MoonIcon className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}

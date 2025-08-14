import React from "react";
import { BsCheck, BsCheckAll } from "react-icons/bs";
import { AiOutlineClockCircle } from "react-icons/ai";

export default function StatusTicks({ status }) {
  if (status === "read") {
    // Double blue tick for "read"
    return <BsCheckAll className="inline-block text-blue-500" size={18} />;
  }
  if (status === "delivered") {
    // Double grey tick for "delivered"
    return <BsCheckAll className="inline-block text-gray-400" size={18} />;
  }
  if (status === "sent") {
    // Single grey tick for "sent"
    return <BsCheck className="inline-block text-gray-400" size={18} />;
  }
  if (status === "pending") {
    // Clock icon for "pending" (optimistic UI)
    return (
      <AiOutlineClockCircle className="inline-block text-gray-400" size={14} />
    );
  }
  return null; // Don't show anything for incoming messages' "received" status
}

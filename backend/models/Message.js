import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    wa_id: { type: String, required: true, index: true },
    contactName: { type: String, default: "Unknown" },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    from: { type: String }, // Phone number of the sender
    msg_id: { type: String, index: true }, // The message ID from WhatsApp
    status: {
      type: String,
      enum: ["sent", "delivered", "read", "failed", "received"],
      default: "sent",
    },
    raw_payload: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

export default mongoose.model("Message", messageSchema);

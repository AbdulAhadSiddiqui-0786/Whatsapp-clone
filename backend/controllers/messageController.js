import Message from "../models/Message.js";

/**
 * @desc    Get all conversations, grouped by user and sorted by the last message
 * @route   GET /api/conversations
 */
export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Message.aggregate([
      // 1. Sort all messages by their WhatsApp timestamp
      { $sort: { timestamp: 1 } },
      // 2. Group messages by the user's WhatsApp ID
      {
        $group: {
          _id: "$wa_id", // Group by the wa_id field
          messages: { $push: "$$ROOT" }, // Push the entire document into a 'messages' array
          contactName: { $first: "$contactName" },
          lastMessageAt: { $last: "$timestamp" },
        },
      },
      // 3. Sort the conversations themselves by the most recent message
      { $sort: { lastMessageAt: -1 } },
    ]);

    res.status(200).json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res
      .status(500)
      .json({ error: "Server error while fetching conversations." });
  }
};

/**
 * @desc    Send a message from your frontend
 * @route   POST /api/messages
 */
export const sendMessage = async (req, res) => {
  const { wa_id, contactName, text } = req.body;

  if (!wa_id || !text) {
    return res.status(400).json({ error: "wa_id and text are required." });
  }

  try {
    const newMessage = await Message.create({
      wa_id,
      contactName,
      text,
      from: "me", // Indicates this message was sent from your system
      status: "sent",
      timestamp: new Date(),
    });

    // Emit the new message to all connected clients for a real-time update
    req.io.emit("newMessage", newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Server error while sending message." });
  }
};

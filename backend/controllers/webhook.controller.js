import Message from "../models/Message.js";

/**
 * @desc    Process incoming webhooks from WhatsApp
 * @route   POST /api/webhook
 */
export const whatsappWebhook = async (req, res) => {
  const data = req.body;

  try {
    // Check if the webhook is a message notification
    if (data.object === "whatsapp_business_account") {
      const entry = data.entry?.[0];
      const change = entry?.changes?.[0];
      const value = change?.value;
      const messageObj = value?.messages?.[0];

      if (messageObj && messageObj.type === "text") {
        const wa_id = value?.contacts?.[0]?.wa_id;
        const contactName = value?.contacts?.[0]?.profile?.name;
        const text = messageObj?.text?.body;
        const timestamp = new Date(parseInt(messageObj.timestamp) * 1000);

        const savedMessage = await Message.create({
          wa_id,
          contactName,
          text,
          timestamp,
          from: messageObj.from,
          msg_id: messageObj.id,
          status: "received",
          raw_payload: data, // Save the full payload for debugging
        });

        // IMPORTANT: Notify frontend clients about the new message
        req.io.emit("newMessage", savedMessage);
        console.log(`✅ Received & saved message from ${contactName}`);
      }
    }

    // WhatsApp requires a 200 OK response to acknowledge receipt
    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    res.sendStatus(500); // Send an error status back
  }
};

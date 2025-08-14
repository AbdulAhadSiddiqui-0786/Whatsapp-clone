import express from "express";
import {
  getConversations,
  sendMessage,
} from "../controllers/messageController.js";
import { whatsappWebhook } from "../controllers/webhook.controller.js";

const router = express.Router();

// Routes for your frontend
router.get("/conversations", getConversations);
router.post("/messages", sendMessage);

// Route for the WhatsApp Webhook
// NOTE: WhatsApp requires a GET endpoint for initial verification
router.get("/webhook", (req, res) => {
  const verify_token = "YOUR_WEBHOOK_VERIFY_TOKEN"; // Use an env variable for this
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === verify_token) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

router.post("/webhook", whatsappWebhook);

export default router;

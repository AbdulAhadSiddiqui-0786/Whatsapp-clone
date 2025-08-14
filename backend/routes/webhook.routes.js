import express from "express";
import { whatsappWebhook } from "../controllers/webhook.controller.js";

const router = express.Router();

router.post("/webhook", whatsappWebhook);

export default router;


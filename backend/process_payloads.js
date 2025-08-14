import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import connectDB from "./config/connectDB.js";
import Message from "./models/Message.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const processPayloads = async () => {
  await connectDB();
  const payloadDir = path.join(__dirname, "sample_payloads");

  try {
    const files = await fs.promises.readdir(payloadDir);
    for (const file of files) {
      if (file.endsWith(".json")) {
        const filePath = path.join(payloadDir, file);
        console.log(`--- Processing file: ${file} ---`);

        const rawData = await fs.promises.readFile(filePath);
        const payload = JSON.parse(rawData);

        // Correctly access the 'entry' array inside the 'metaData' object
        const entry = payload.metaData?.entry?.[0];

        const change = entry?.changes?.[0];
        const value = change?.value;

        // Check for message objects first
        const messageObj = value?.messages?.[0];
        if (messageObj && messageObj.text) {
          const text = messageObj.text.body || "";
          console.log(`Extracted text: "${text}"`);

          if (text) {
            const wa_id = value?.contacts?.[0]?.wa_id;
            const contactName = value?.contacts?.[0]?.profile?.name;
            const timestamp = new Date(parseInt(messageObj.timestamp) * 1000);

            await Message.create({
              wa_id,
              contactName,
              text,
              timestamp,
              from: messageObj.from,
              msg_id: messageObj.id,
              status: "received",
            });
            console.log(`✅ Inserted message from ${contactName}`);
          }
        } else {
          // Also handle status updates (optional but good practice)
          const statusObj = value?.statuses?.[0];
          if (statusObj) {
            console.log(
              `Found status update: ${statusObj.status} for message ${statusObj.id}. Skipping insertion.`
            );
          } else {
            console.log("No text message or status object found, skipping.");
          }
        }
      }
    }
    console.log("\n🎯 Done inserting all payloads.");
  } catch (error) {
    console.error("❌ Error during payload processing:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

processPayloads();

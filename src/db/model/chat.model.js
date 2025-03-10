import { Schema, model } from "mongoose";

// Schema
const chatSchema = new Schema(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // HR or company owner

    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Any user

    messages: [
      {
        message: { type: String, required: true }, // The message content
        senderId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Who sent the messag
      },
    ],
  },

);

// Model
export const Chat = model("Chat", chatSchema);

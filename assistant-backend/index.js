import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { OpenAI } from "openai";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import cloudinary, { queryPineconeVectorStore } from "./lib/index.js";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

io.on("connection", (socket) => {
  socket.on(
    "userMessage",
    async ({ message, image, chatId, isOldMessage, public_id }) => {
      try {
        // Retrieving from pinecone database

        // const retrievals = await queryPineconeVectorStore(message);
        // console.log("Retrievals :: ", retrievals)

        const messages = [
          {
            role: "system",
            content:
              "You are a medical assistant.Be friendly, and charming, if user message is irrelavant, other than medical just respond with please ask medical questions. user may upload a medical report, extract the text and provide medical insight and provide with suggestions as a medical assistant. if image is unrelated to medical, just say image is not medical related",
          },
        ];

        const userContent = [];

        if (message) {
          userContent.push({
            type: "text",
            text: message,
          });
        }
        if (image) {
          userContent.push({
            type: "image_url",
            image_url: { url: image },
          });
        }

        if (userContent.length > 0) {
          messages.push({
            role: "user",
            content: userContent,
          });
        } else {
          socket.emit("botMessage", {
            message: "Please send a message or an image.",
          });
          return;
        }

        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          stream: true,
          messages: messages,
        });

        let fullResponse = "";

        for await (const chunk of completion) {
          const token = chunk.choices[0]?.delta?.content || "";
          fullResponse += token;
          socket.emit("botMessage", { message: token });
        }

        socket.emit("done");

        if (!isOldMessage) {
          if (image && message) {
            await prisma.message.create({
              data: {
                image: public_id,
                chatId,
                role: "user",
                content: message,
              },
            });
          } else if (image && !message) {
            await prisma.message.create({
              data: {
                image: public_id,
                chatId,
                role: "user",
                content: "Image Uploaded",
              },
            });
          } else if (!image && message) {
            await prisma.message.create({
              data: {
                chatId,
                role: "user",
                content: message,
              },
            });
          }
        }

        await prisma.message.create({
          data: {
            chatId,
            role: "assistant",
            content: fullResponse,
          },
        });
      } catch (err) {
        console.error(err);
        socket.emit("botMessage", {
          message: "Error occurred. Please try again",
        });
      }
    }
  );
  socket.on("uploadImage", async ({ image, chatId }) => {
    try {
      const newPublicId = `chat_images/${chatId}-${uuidv4()}`;

      const res = await cloudinary.uploader.upload(image, {
        folder: "chat_images",
        public_id: newPublicId,
        overwrite: false,
      });

      socket.emit("imageUploaded", { public_image_id: res.public_id });
    } catch (err) {
      console.log(err);
    }
  });
});

server.listen(8080, () =>
  console.log("Socket.IO server on http://localhost:8080")
);

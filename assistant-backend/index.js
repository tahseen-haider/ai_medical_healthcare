import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { OpenAI } from "openai";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

io.on("connection", (socket) => {
  socket.on("userMessage", async ({ message, chatId, isNew }) => {
    try {
      console.log(message, chatId);
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        stream: true,
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: message },
        ],
      });

      let fullResponse = "";

      for await (const chunk of completion) {
        const token = chunk.choices[0]?.delta?.content || "";
        fullResponse += token;
        socket.emit("botMessage", { message: token });
      }

      socket.emit("done");

      if (!isNew) {
        await prisma.message.create({
          data: {
            chatId,
            role: "user",
            content: message,
          },
        });
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
      socket.emit("botMessage", { message: "Error occurred." });
    }
  });
});

server.listen(8080, () =>
  console.log("Socket.IO server on http://localhost:8080")
);

export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db/prisma";
import { NextRequest } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const message = searchParams.get("message");
  const image = searchParams.get("image");
  const chatId = searchParams.get("chatId");
  const public_id = searchParams.get("public_id");
  const isOldMessage = searchParams.get("isOldMessage") === "true";

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const messages: any[] = [
          {
            role: "system",
            content:
              "You are a medical assistant. Be friendly and charming. If the user message is irrelevant (not medical), respond with: 'Please ask medical questions.' If an image is uploaded, analyze it and provide medical insights. If the image is unrelated to medical, say: 'Image is not medical related.' ",
          },
        ];

        const userContent: any[] = [];
        if (message) {
          userContent.push({ type: "text", text: message });
        }

        if (public_id) {
          const url = image
            ? image
            : `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${public_id}`;
          userContent.push({
            type: "image_url",
            image_url: { url },
          });
        }

        if (userContent.length === 0) {
          controller.enqueue(
            encoder.encode(`data: Please send a message or an image.\n\n`)
          );
          controller.close();
          return;
        }

        messages.push({ role: "user", content: userContent });

        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          stream: true,
          messages,
        });

        let fullResponse = "";

        for await (const chunk of completion) {
          const token = chunk.choices[0]?.delta?.content || "";
          const cleanedToken = token.replace(/\n+/g, "\n");

          fullResponse += cleanedToken;

          const data = JSON.stringify({ token: cleanedToken });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        }

        controller.enqueue(encoder.encode("event: done\ndata: done\n\n"));
        controller.close();

        // Save user message only if it's a new message
        if (!isOldMessage && chatId) {
          if (public_id && message) {
            await prisma.message.create({
              data: {
                chatId,
                role: "user",
                content: message,
                image: public_id,
              },
            });
          } else if (public_id && !message) {
            await prisma.message.create({
              data: {
                chatId,
                role: "user",
                content: "Image Uploaded",
                image: public_id,
              },
            });
          } else if (!public_id && message) {
            await prisma.message.create({
              data: {
                chatId,
                role: "user",
                content: message,
              },
            });
          }
        }

        // Save assistant message
        if (chatId) {
          await prisma.message.create({
            data: {
              chatId,
              role: "assistant",
              content: fullResponse,
            },
          });
        }
      } catch (err: any) {
        console.error("SSE Error:", err);
        controller.enqueue(
          encoder.encode(`data: Error occurred. Please try again.\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

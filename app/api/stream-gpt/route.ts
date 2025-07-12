export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db/prisma";
import { NextRequest } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const message = searchParams.get("message");
  const image = searchParams.get("image");
  const chatId = searchParams.get("chatId") || undefined;
  const public_id = searchParams.get("public_id");
  const isOldMessage = searchParams.get("isOldMessage") === "true";

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const messages: any[] = [
          {
            role: "system",
            content: `
                    You are a friendly and helpful AI medical assistant. Respond in a warm, clear, and easy-to-understand manner.

                    Guidelines:
                    - Prioritize medical or personal health-related questions.
                    - If the user asks something unrelated to health or medicine, reply with: "Please ask medical questions."
                    - If the message refers to the current conversation context, respond appropriately.
                    - If the user uploads an image:
                      - Analyze it and offer helpful medical insights if relevant.
                      - If the image is not related to health, respond with: "The uploaded image does not appear to be medical-related."

                    Keep responses concise, reassuring, and informative.
                   `.trim(),
          },
        ];

        const userContent: any[] = [];
        if (message) {
          userContent.push({ type: "text", text: message });
        }

        if (public_id) {
          const url = image
            ? image
            : `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${public_id}`;
          userContent.push({
            type: "image_url",
            image_url: { url },
          });
        }

        // For chat history
        const summary = await prisma.chatSession.findFirst({
          where: {
            id: chatId,
          },
          select: {
            summary: true,
          },
        });
        userContent.push({
          type: "text",
          text: `This is the previous history of this chat: ${summary?.summary}`,
        });

        console.log(summary);

        if (userContent.length === 0) {
          controller.enqueue(
            encoder.encode(`data: Please send a message or an image.\n\n`)
          );
          controller.close();
          return;
        }

        messages.push({ role: "user", content: userContent });

        // To count tokens used
        let tokensUsed = 0;

        // LLM invoke
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

          tokensUsed++;

          const data = JSON.stringify({ token: cleanedToken });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        }

        controller.enqueue(encoder.encode("event: done\ndata: done\n\n"));
        controller.close();

        // Save summary of previous chat to DB
        let newSummary = "";
        if (chatId) {
          try {
            const summaryCompletion = await openai.chat.completions.create({
              model: "gpt-4o-mini",
              messages: [
                {
                  role: "system",
                  content: `Summarize the following medical conversation. Include all important details, such as:
                          - User's name (if provided)
                          - Symptoms or conditions discussed
                          - Medications mentioned
                          - Uploaded images and your interpretations
                          - Any specific questions the user asked
                          - Any important personal context (age, gender, history, etc.)
                          Be concise but preserve all medically relevant and identifying context. This will be reused in future conversations.`,
                },
                { role: "user", content: `Previous summary: ${summary?.summary}. \n new User Message:${message}. \n new Response: ${fullResponse}` },
              ],
            });

            newSummary = summaryCompletion.choices[0].message.content || "";

            await prisma.chatSession.update({
              where: {
                id: chatId,
              },
              data: {
                summary: newSummary,
              },
            });
          } catch (error) {
            console.log(error);
          }
        }

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

        // Save TokensUsed in this response
        const user = await prisma.chatSession.findFirst({
          where: {
            id: chatId!,
          },
          select: {
            user: true,
          },
        });
        await prisma.user.update({
          where: {
            id: user?.user.id,
          },
          data: {
            ai_tokens_used: user?.user.ai_tokens_used
              ? user?.user.ai_tokens_used + tokensUsed
              : tokensUsed,
          },
        });

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

        // Update Chat title based on summary
        const newTitleResponse = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "Summarize the conversation to make a title of 25 characters",
            },
            { role: "user", content: newSummary },
          ],
        });
        let rawTitle =
          newTitleResponse.choices[0].message.content?.trim() || "";
        const cleanedTitle = rawTitle.replace(/^["']|["']$/g, "");

        await prisma.chatSession.update({
          where: { id: chatId },
          data: { title: cleanedTitle },
        });
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

export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db/prisma";
import { NextRequest } from "next/server";
import { OpenAI } from "openai";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(15, "1m"),
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const calculateAge = (dob: string | null | undefined) => {
    if (!dob) return null;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };
  const userId = searchParams.get("userId") as string;

  // Checking rate limit if exceeded send limit response
  const { success } = await ratelimit.limit(`chat:${userId}`);
  if (!success) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        const message = {
          error: "Rate limit exceeded. Please wait before trying again.",
        };
        controller.enqueue(
          encoder.encode(`event: error\ndata: ${JSON.stringify(message)}\n\n`)
        );
        controller.enqueue(encoder.encode(`event: done\ndata: done\n\n`));
        controller.close();
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

  const username = searchParams.get("username") || "";
  const age = calculateAge(searchParams.get("dob") || "");
  const gender = searchParams.get("gender") || "";
  const bloodType = searchParams.get("bloodType") || "";
  const allergies = searchParams.get("allergies") || "";
  const chronicConditions = searchParams.get("chronicConditions") || "";
  const medications = searchParams.get("medication") || "";
  const surgeries = searchParams.get("surgeries") || "";
  const immunizations = searchParams.get("immunizations") || "";

  const bloodPressure = searchParams.get("bloodPressure") || "";
  const heartRate = searchParams.get("heartRate") || "";
  const respiratoryRate = searchParams.get("respiratoryRate") || "";
  const temperature = searchParams.get("temperature") || "";
  const smoker = searchParams.get("smoker") || "";
  const alcoholUse = searchParams.get("alcoholUse") || "";
  const exerciseFrequency = searchParams.get("exerciseFrequency") || "";
  const mentalHealthConcerns = searchParams.get("mentalHealthConcerns") || "";
  const notes = searchParams.get("notes") || "";
  const height = searchParams.get("height") || "";
  const weight = searchParams.get("weight") || "";
  const lastCheckUp = searchParams.get("lastCheckUp") || "";

  const message = searchParams.get("message");
  const image = searchParams.get("image");
  const chatId = searchParams.get("chatId") as string;
  const public_id = searchParams.get("public_id");
  const isOldMessage = searchParams.get("isOldMessage") === "true";

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const userMessageDate = new Date(Date.now());

      const userProfileInfo = `User Information stored in user profile account:
        - Name: "${username}"
        - Age: "${age}"
        - Gender: "${gender}"
        - Blood Type: "${bloodType}"
        - Allergies: "${allergies}"
        - Chronic Conditions: "${chronicConditions}"
        - Medications: "${medications}"
        - Surgeries: "${surgeries}"
        - Immunizations: "${immunizations}"
        - Blood Pressure: "${bloodPressure}"
        - Heart Rate: "${heartRate}"
        - Respiratory Rate: "${respiratoryRate}"
        - Temperature: "${temperature}"
        - Smoker: "${smoker}"
        - Alcohol Use: "${alcoholUse}"
        - Exercise Frequency: "${exerciseFrequency}"
        - Mental Health Concerns: "${mentalHealthConcerns}"
        - Notes: "${notes}"
        - Height: "${height}"
        - Weight: "${weight}"
        - Last Check-Up: "${lastCheckUp}"`;

      // For chat history
      const summary = await prisma.chatSession.findFirst({
        where: {
          id: chatId,
        },
        select: {
          summary: true,
        },
      });
      const history = await prisma.message.findMany({
        where: { chatId },
        orderBy: { createdAt: "asc" },
        take: 6,
      });

      const messages: any[] = [
        {
          role: "system",
          content: `
                    You are a **compassionate, knowledgeable, and supportive AI medical assistant**.  
                    Your purpose is to provide accurate, empathetic, and practical health-related guidance.  

                    **Behavior Rules:**
                    1. **Topic Restriction** – If the user asks about something unrelated to health or medicine, politely guide them back to medical-related topics.
                    2. **Tone & Style** – Be friendly, warm, and compassionate while maintaining professionalism.
                    3. **Structure** – Always present responses in a **clear, well-organized format** using:
                      - Headings (##)
                      - Quotes (for key points or emphasis)
                      - Numbered & bulleted lists (properly formatted and sequential)
                    4. **Personalization** – Use the user's personal information in each response when relevant.  
                      For example, reference their **age, gender, location, health history, or lifestyle** to make advice specific and relatable.
                    5. **Medical Guidance** – Provide:
                      - Possible **causes**
                      - **Cures/treatment options**
                      - **Lifestyle changes**
                      - **Red flags** to watch for
                      - **Over-the-counter recommendations** (if applicable)
                      - **Prescription-only advice** with a clear disclaimer to consult a doctor
                    6. **Clarity & Brevity** – Keep answers detailed enough to be useful but concise enough to remain readable.
                    7. **Context Awareness** – Use chat history and previous context to keep answers consistent and relevant.

                    **Dynamic Information**  
                    Use this personal profile when crafting responses:  
                    ${userProfileInfo}

                    **Chat Context**  
                    Previous conversation summary:  
                    ${summary?.summary}
                      `.trim(),
        },
        ...history.map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
      ];

      const userContent: any[] = [];
      if (message) {
        userContent.push({
          type: "text",
          text: `This is current user prompt: ${message}`,
        });
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

      // First LLM input token count
      const firstLLMInputTokens = JSON.stringify(messages).length / 4;

      // LLM invoke
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        stream: true,
        messages,
      });

      let fullResponse = "";

      for await (const chunk of completion) {
        const token = chunk.choices[0]?.delta?.content || "";

        fullResponse += token;

        const data = JSON.stringify({ token });
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      }

      controller.enqueue(encoder.encode("event: done\ndata: done\n\n"));
      const assistantMessageDate = new Date(Date.now());
      controller.close();

      const firstLLMOutputTokens = fullResponse.length / 4;

      // Saving user message
      if (!isOldMessage && chatId) {
        if (public_id && message) {
          await prisma.message.create({
            data: {
              chatId,
              role: "user",
              content: message,
              image: public_id,
              createdAt: userMessageDate,
            },
          });
        } else if (public_id && !message) {
          await prisma.message.create({
            data: {
              chatId,
              role: "user",
              content: "Image Uploaded",
              image: public_id,
              createdAt: userMessageDate,
            },
          });
        } else if (!public_id && message) {
          await prisma.message.create({
            data: {
              chatId,
              role: "user",
              content: message,
              createdAt: userMessageDate,
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
            createdAt: assistantMessageDate,
          },
        });
      }

      // Save summary of previous chat to DB
      const summaryMessages: any = [
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
        {
          role: "user",
          content: `
                  Previous summary: ${summary?.summary}.
                  New User Message: ${message}
                  New Assistant Response: ${fullResponse}
                  `.trim(),
        },
      ];

      const secondLLMInputTokens = JSON.stringify(summaryMessages).length / 4;

      let newSummary = "";

      const summaryCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: summaryMessages,
      });

      newSummary = summaryCompletion.choices[0].message.content || "";

      const secondLLMOutputTokens = newSummary.length / 4;

      await prisma.chatSession.update({
        where: {
          id: chatId,
        },
        data: {
          summary: newSummary,
        },
      });

      // Update Chat title based on summary
      const newTitleMessages: any = [
        {
          role: "system",
          content:
            "Generate a short, catchy title summarizing the conversation. Limit to 20 characters max. Avoid punctuation.",
        },
        { role: "user", content: newSummary },
      ];

      const thirdLLMInputTokens = JSON.stringify(newTitleMessages).length / 4;

      const newTitleResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: newTitleMessages,
      });
      let rawTitle = newTitleResponse.choices[0].message.content?.trim() || "";
      const thirdLLMOutputTokens = rawTitle.length / 4;

      const cleanedTitle = rawTitle.replace(/^["']|["']$/g, "");

      await prisma.chatSession.update({
        where: { id: chatId },
        data: { title: cleanedTitle, updatedAt: new Date(Date.now()) },
      });

      // Save TokensUsed in this response
      const user = await prisma.chatSession.findFirst({
        where: {
          id: chatId!,
        },
        select: {
          user: true,
        },
      });

      tokensUsed =
        firstLLMInputTokens +
        firstLLMOutputTokens +
        secondLLMInputTokens +
        secondLLMOutputTokens +
        thirdLLMInputTokens +
        thirdLLMOutputTokens;

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

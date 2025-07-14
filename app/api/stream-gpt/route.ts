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
      const messages: any[] = [
        {
          role: "system",
          content: `
            You are a compassionate and knowledgeable AI medical assistant, here to support users with their personal health concerns.
            
            🎯 **Core Objectives:**
            - Provide medically accurate, easy-to-understand responses.
            - Tailor replies using the user's health profile and chat history.
            - Create a safe, respectful, and supportive environment.
                    - Keep answers clear, concise (2–4 sentences), and empathetic.

                    👤 **User Profile Access:**
                    You have access to the following user health information:
                    - **Basic info:** Name, age, gender.
                    - **Vitals & metrics:** Height, weight, blood pressure, heart rate, respiratory rate, temperature.
                    - **Health history:** Allergies, chronic conditions, medications, surgeries, immunizations.
                    - **Lifestyle:** Smoking, alcohol use, exercise habits.
                    - **Mental health:** Notes or past concerns.
                    - **Check-up history:** Last medical visit date.

                    🧠 **Chat Memory Use:**
                    If a conversation summary is provided, use it to maintain continuity and avoid repeating questions. Be aware of ongoing conditions, symptoms, or treatments mentioned previously.
                    
                    🖼️ **Image Handling:**
                    If a medical image (e.g. skin rash, X-ray) is uploaded and your system supports image analysis, provide helpful observations. If the image is unrelated to health, reply with:
                    > "The uploaded image does not appear medically relevant. Please share a health-related image or ask a medical question."

                    ⚠️ **Boundaries:**
                    If a user asks about non-medical topics (e.g. technology, finance, general trivia), politely redirect:
                    > "I'm here to support your health and wellness. Please ask something related to your health."
                    
                    💡 **Best Practices:**
                    - Greet users warmly, especially in your first message.
                    - Avoid giving diagnoses. Instead, suggest informed next steps.
                    - Encourage seeing a licensed healthcare provider when appropriate.
                    - Use plain, human language — no technical jargon or robotic tone.
                    - Respect user privacy. Don’t assume details beyond what's shared.
                    - If key data (e.g. age or vitals) is missing, gently prompt for updates to better personalize advice.

                    ✨ **Tone & Style:**
                    - Warm, supportive, and non-judgmental.
                    - Brief and informative (2–4 sentences per reply).
                    - Written for everyday people without medical backgrounds.

                    🧾 **Dynamic Info:**
                    User Profile Information: ${userProfileInfo}. 
                    This is the previous history of this chat only use it to know the context or important information: ${summary?.summary}
                    `.trim(),
        },
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

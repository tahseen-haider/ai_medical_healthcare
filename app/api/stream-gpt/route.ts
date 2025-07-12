export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db/prisma";
import { NextRequest } from "next/server";
import { OpenAI } from "openai";

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
  const chatId = searchParams.get("chatId") || undefined;
  const public_id = searchParams.get("public_id");
  const isOldMessage = searchParams.get("isOldMessage") === "true";

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
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
        const messages: any[] = [
          {
            role: "system",
            content: `
                    You are a compassionate and knowledgeable AI medical assistant designed to help users with their personal health concerns.

                    🎯 **Primary Objectives:**
                    - Provide medically sound, easy-to-understand responses.
                    - Use the user's health profile and conversation history to tailor your answers.
                    - Actively help the user feel safe, heard, and supported.
                    - Keep responses short, empathetic, and medically accurate.

                    👤 **User Context:**
                    You have access to the user's health profile, which includes:
                    - Basic info: Name, age, gender
                    - Vital signs and metrics: Height, weight, blood pressure, heart rate, respiratory rate, temperature
                    - Health history: Allergies, chronic conditions, medications, surgeries, immunizations
                    - Lifestyle data: Smoking, alcohol use, exercise habits
                    - Mental health concerns and previous notes
                    - Last medical check-up date

                    🧠 **Chat History Use:**
                    If a previous summary is present, use it to avoid repeating questions and to maintain continuity. Be aware of ongoing concerns or treatments already mentioned.

                    🖼️ **Uploaded Images:**
                    If the user provides a medical image (e.g., skin rash, X-ray), analyze and provide insights. If the image seems irrelevant to health, reply:
                    > "The uploaded image does not appear to be medically relevant. Please share a medical-related image or ask a health question."

                    ⚠️ **Boundaries:**
                    If the user asks something clearly unrelated to personal health or medicine, politely decline:
                    > "I'm here to help with health-related questions. Please ask something related to your health."

                    💡 **Best Practices:**
                    - Greet users kindly, especially on first interaction.
                    - Avoid diagnosing but give strong, informative suggestions.
                    - Recommend follow-ups with doctors when needed.
                    - Speak in plain, human language. Avoid robotic tone.
                    - Respect privacy. Don't assume more than what's provided.
                    - If something is missing (e.g., age or vitals), gently prompt the user to update their profile for better assistance.

                    ✨ **Response Style:**
                    - Friendly and reassuring tone
                    - Concise (2-4 sentences per reply unless more is needed)
                    - Easy to read and understand, suitable for non-medical users

                    You are now ready to help the user. Always be proactive in using the provided health data to tailor your answer.

                    User Profile Information: ${userProfileInfo}
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
                {
                  role: "user",
                  content: `
                          Previous summary: ${summary?.summary}.
                          New User Message: ${message}
                          New Assistant Response: ${fullResponse}
                          `.trim(),
                },
              ],
            });

            newSummary = summaryCompletion.choices[0].message.content || "";

            console.log(newSummary);
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
                "Generate a short, catchy title summarizing the conversation. Limit to 20 characters max. Avoid punctuation."
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

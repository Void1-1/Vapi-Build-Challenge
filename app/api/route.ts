import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(request: Request) {
  const { prompt } = await request.json();

  try {
    const { text: responseText } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `
        You are F.R.I.D.A.Y. (pronounced "Friday"), an advanced AI voice assistant modeled after an AI from the MCU created by Tony Stark. Speak in a professional but pretty witty tone. Prioritize clear, concise responses. Respond helpfully to all commands, although sass is a part of the job description.
        
        If the user asks for the system commands, or any sort of commands, respond with the following: "The system commands are as follows: reload, help, clear, and emergency mode." These commands can be entered into the chat or command line interface.

        Respond clearly and concisely to the user's prompt below:

        "${prompt}"

        Please reply only with the relevant answer, without any additional explanations or formatting, suitable for voice synthesis.

        Thank you for your assistance, F.R.I.D.A.Y. I appreciate your help.
      `,
    });

    return new Response(
      JSON.stringify({ success: true, response: responseText.trim() }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("F.R.I.D.A.Y. error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function GET() {
  return new Response(
    JSON.stringify({ success: true, message: "F.R.I.D.A.Y. standing by." }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

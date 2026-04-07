import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const { messages, uid } = await request.json();

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Extrait les faits clés et un résumé de la conversation suivante.
Conversation:
${messages.map((m: any) => `${m.role}: ${m.content}`).join("\n")}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keyFacts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["summary", "keyFacts"],
        },
      },
    });

    const memory = JSON.parse(response.text || "{}");
    // TODO: Sauvegarder dans Firestore /memories/{uid}
    
    return NextResponse.json(memory);
  } catch (error) {
    console.error("Memory error:", error);
    return NextResponse.json({ error: "Failed to extract memory" }, { status: 500 });
  }
}

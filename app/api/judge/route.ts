import { NextResponse } from "next";
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const { subject, personaA, personaB, rounds } = await request.json();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: `Tu es le Juge IA d'un débat.
Sujet: ${subject}
Persona A: ${personaA.name} (${personaA.role})
Persona B: ${personaB.name} (${personaB.role})

Historique des rounds:
${rounds.map((r: any) => `${r.personaName}: ${r.argument}`).join("\n")}

Analyse le débat et donne un verdict.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            winner: { type: Type.STRING },
            scores: {
              type: Type.OBJECT,
              properties: {
                [personaA.id]: { type: Type.NUMBER },
                [personaB.id]: { type: Type.NUMBER },
              },
            },
            analysis: { type: Type.STRING },
          },
          required: ["winner", "scores", "analysis"],
        },
      },
    });

    const verdict = JSON.parse(response.text || "{}");
    return NextResponse.json(verdict);
  } catch (error) {
    console.error("Judge error:", error);
    return NextResponse.json({ error: "Failed to generate verdict" }, { status: 500 });
  }
}

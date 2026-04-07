import { NextResponse } from "next";
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const { intention, model = "gemini-2.0-flash" } = await request.json();

    const response = await ai.models.generateContent({
      model,
      contents: `Génère 3 matrices de style distinctes pour l'intention suivante : "${intention}".
Chaque matrice doit avoir 6 à 8 axes nommés dynamiquement selon l'intention.
Chaque axe a une valeur (0-100), un poids (0-1), une polarité (left, right, balanced) et une influence (description courte).
Inclus des archétypes et une tension narrative.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              arch: { type: Type.STRING },
              axes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    value: { type: Type.NUMBER },
                    weight: { type: Type.NUMBER },
                    polarity: { type: Type.STRING },
                    influence: { type: Type.STRING },
                  },
                  required: ["label", "value", "weight", "polarity", "influence"],
                },
              },
              archetypes: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              tension: {
                type: Type.OBJECT,
                properties: {
                  description: { type: Type.STRING },
                  axesInConflict: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  intensity: { type: Type.STRING },
                },
                required: ["description", "axesInConflict", "intensity"],
              },
            },
            required: ["id", "name", "arch", "axes", "archetypes"],
          },
        },
      },
    });

    const matrices = JSON.parse(response.text || "[]");
    return NextResponse.json(matrices);
  } catch (error) {
    console.error("Matrices generation error:", error);
    return NextResponse.json({ error: "Failed to generate matrices" }, { status: 500 });
  }
}

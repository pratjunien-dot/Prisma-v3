import { NextResponse } from "next";
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const { intention, matrix, model = "gemini-2.0-flash" } = await request.json();

    const response = await ai.models.generateContent({
      model,
      contents: `Génère 3 personas distincts héritant des axes de la matrice suivante (variance ±15) pour l'intention "${intention}".
Matrice: ${JSON.stringify(matrix)}
Inclus un systemPrompt complet, des traits, une url d'avatar DiceBear (ex: https://api.dicebear.com/9.x/bottts/svg?seed=...), et une couleur HSL (ex: hsl(200, 80%, 50%)).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              role: { type: Type.STRING },
              avatarUrl: { type: Type.STRING },
              systemPrompt: { type: Type.STRING },
              traits: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
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
              color: { type: Type.STRING },
            },
            required: ["id", "name", "role", "avatarUrl", "systemPrompt", "traits", "axes", "color"],
          },
        },
      },
    });

    const personas = JSON.parse(response.text || "[]");
    return NextResponse.json(personas);
  } catch (error) {
    console.error("Personas generation error:", error);
    return NextResponse.json({ error: "Failed to generate personas" }, { status: 500 });
  }
}

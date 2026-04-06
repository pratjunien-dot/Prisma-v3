import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export interface AdvancedAxis {
  label: string;
  value: number; // 0 to 1
  description: string;
}

export interface PersonaData {
  name: string;
  role: string;
  avatarUrl: string;
  systemPrompt: string;
  traits: string[];
  axes: Record<string, number>;
  narrativeTension: number;
}

export class GeminiAdapter {
  private ai: GoogleGenAI;

  constructor() {
    if (!apiKey) {
      throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not set");
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateStyleMatrices(intention: string): Promise<AdvancedAxis[][]> {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 3 distinct style matrices (AdvancedAxis[]) for the following intention: "${intention}". 
      Each matrix should have 4-6 axes (label, value 0-1, description). 
      Return as a JSON array of 3 arrays.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                value: { type: Type.NUMBER },
                description: { type: Type.STRING }
              },
              required: ["label", "value", "description"]
            }
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  }

  async generatePersonas(intention: string, matrix: AdvancedAxis[]): Promise<PersonaData[]> {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 3 unique AI personas based on the intention: "${intention}" and the style matrix: ${JSON.stringify(matrix)}.
      Each persona should have:
      - name
      - role
      - avatarUrl (use DiceBear API: https://api.dicebear.com/7.x/bottts-neutral/svg?seed={name})
      - systemPrompt
      - traits (array of 3-5 strings)
      - axes (weighted personality axes from the matrix)
      - narrativeTension (0-1)
      Return as a JSON array of 3 objects.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              role: { type: Type.STRING },
              avatarUrl: { type: Type.STRING },
              systemPrompt: { type: Type.STRING },
              traits: { type: Type.ARRAY, items: { type: Type.STRING } },
              axes: { type: Type.OBJECT },
              narrativeTension: { type: Type.NUMBER }
            },
            required: ["name", "role", "avatarUrl", "systemPrompt", "traits", "axes", "narrativeTension"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  }

  async chat(
    messages: { role: 'user' | 'model', content: string }[],
    systemInstruction: string,
    useThinking: boolean = false
  ): Promise<string> {
    const model = useThinking ? "gemini-3.1-pro-preview" : "gemini-3-flash-preview";
    const config: any = {
      systemInstruction,
    };

    if (useThinking) {
      config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
    }

    const response = await this.ai.models.generateContent({
      model,
      contents: messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      })),
      config
    });

    return response.text || "";
  }

  async extractMemory(conversation: string, currentMemory: string): Promise<{ summary: string, keyFacts: string[] }> {
    const response = await this.ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: `Analyze the following conversation and update the user's memory.
      Current Memory: ${currentMemory}
      New Conversation: ${conversation}
      Extract key facts and provide a concise summary.
      Return as JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keyFacts: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["summary", "keyFacts"]
        }
      }
    });

    return JSON.parse(response.text || '{"summary": "", "keyFacts": []}');
  }

  async getVerdict(debateHistory: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `As an AI Judge, analyze this debate and provide a verdict.
      Debate History: ${debateHistory}
      Provide a detailed reasoning and declare a winner.`,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
      }
    });

    return response.text || "";
  }
}

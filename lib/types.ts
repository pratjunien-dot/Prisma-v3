export interface AdvancedAxis {
  label: string;
  value: number; // 0–100
  weight: number; // 0–1
  polarity: "left" | "right" | "balanced";
  influence: string; // description courte de l'impact
}

export interface MatrixTension {
  description: string;
  axesInConflict: string[];
  intensity: "high" | "medium" | "low";
}

export interface AdvancedMatrix {
  id: string;
  name: string;
  arch: string; // archétype ex: "Classique · Académique"
  axes: AdvancedAxis[]; // 6–8 axes
  archetypes: string[];
  tension?: MatrixTension;
}

export interface Persona {
  id: string;
  uid: string; // owner Firebase UID
  name: string;
  role: string;
  avatarUrl: string; // DiceBear URL
  systemPrompt: string;
  traits: string[];
  axes: AdvancedAxis[];
  tension?: MatrixTension;
  color?: string; // hsl(H,S%,L%)
  isFavorite: boolean;
  sourceMatrixId?: string;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  personaName?: string;
  timestamp: Date;
  streaming?: boolean;
  // ADK-inspired event types
  eventType?: "user_input" | "model_response" | "tool_call" | "tool_result" | "system";
  toolName?: string;
}

export interface DebateRound {
  personaId: string;
  personaName: string;
  argument: string;
  timestamp: Date;
}

export interface JudgeVerdict {
  winner: string;
  scores: Record<string, number>; // total = 100
  analysis: string;
}

export type PipelinePhase =
  | "idle"
  | "loading_matrices"
  | "select_matrix"
  | "loading_personas"
  | "select_persona"
  | "refine_persona"
  | "chat";

export type CollaborationMode = "single" | "debate";

export type Theme = "dark" | "oled" | "light" | "aurora" | "cyberpunk";
export type Accent = "teal" | "purple" | "blue" | "rose" | "amber";
export type GeminiModel =
  | "gemini-2.0-flash"
  | "gemini-2.5-pro"
  | "gemini-2.5-flash-preview";

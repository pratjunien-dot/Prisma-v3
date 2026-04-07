import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Theme, Accent, GeminiModel, PipelinePhase, AdvancedMatrix, Persona, ChatMessage, DebateRound, JudgeVerdict } from './types';

interface UIState {
  theme: Theme;
  accent: Accent;
  geminiModel: GeminiModel;
  headerVisible: boolean;
  dockVisible: boolean;
  setTheme: (theme: Theme) => void;
  setAccent: (accent: Accent) => void;
  setGeminiModel: (model: GeminiModel) => void;
  toggleChrome: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'dark',
      accent: 'teal',
      geminiModel: 'gemini-2.0-flash',
      headerVisible: true,
      dockVisible: true,
      setTheme: (theme) => set({ theme }),
      setAccent: (accent) => set({ accent }),
      setGeminiModel: (geminiModel) => set({ geminiModel }),
      toggleChrome: () => set((state) => ({ headerVisible: !state.headerVisible, dockVisible: !state.dockVisible })),
    }),
    {
      name: 'prisma-ui',
    }
  )
);

interface RadioState {
  activeStationId: string;
  isPlaying: boolean;
  volume: number;
  setStation: (id: string) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
}

export const useRadioStore = create<RadioState>()(
  persist(
    (set) => ({
      activeStationId: 'fip',
      isPlaying: false,
      volume: 0.5,
      setStation: (activeStationId) => set({ activeStationId, isPlaying: true }),
      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
      setVolume: (volume) => set({ volume }),
    }),
    {
      name: 'prisma-radio',
    }
  )
);

interface PipelineState {
  phase: PipelinePhase;
  intention: string;
  matrices: AdvancedMatrix[];
  selMatrix: number | null;
  personas: Persona[];
  selPersona: number | null;
  messages: ChatMessage[];
  isStreaming: boolean;
  setIntention: (intention: string) => void;
  setPhase: (phase: PipelinePhase) => void;
  setMatrices: (matrices: AdvancedMatrix[]) => void;
  selectMatrix: (index: number | null) => void;
  setPersonas: (personas: Persona[]) => void;
  selectPersona: (index: number | null) => void;
  addMessage: (message: ChatMessage) => void;
  appendChunk: (chunk: string) => void;
  finalizeStream: () => void;
  reset: () => void;
}

export const usePipelineStore = create<PipelineState>((set) => ({
  phase: 'idle',
  intention: '',
  matrices: [],
  selMatrix: null,
  personas: [],
  selPersona: null,
  messages: [],
  isStreaming: false,
  setIntention: (intention) => set({ intention }),
  setPhase: (phase) => set({ phase }),
  setMatrices: (matrices) => set({ matrices }),
  selectMatrix: (selMatrix) => set({ selMatrix }),
  setPersonas: (personas) => set({ personas }),
  selectPersona: (selPersona) => set({ selPersona }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  appendChunk: (chunk) => set((state) => {
    const newMessages = [...state.messages];
    const lastMessage = newMessages[newMessages.length - 1];
    if (lastMessage && lastMessage.role === 'model' && lastMessage.streaming) {
      lastMessage.content += chunk;
    }
    return { messages: newMessages };
  }),
  finalizeStream: () => set((state) => {
    const newMessages = [...state.messages];
    const lastMessage = newMessages[newMessages.length - 1];
    if (lastMessage && lastMessage.role === 'model') {
      lastMessage.streaming = false;
    }
    return { messages: newMessages, isStreaming: false };
  }),
  reset: () => set({
    phase: 'idle',
    intention: '',
    matrices: [],
    selMatrix: null,
    personas: [],
    selPersona: null,
    messages: [],
    isStreaming: false,
  }),
}));

interface DebateState {
  state: "idle" | "setup" | "vs_screen" | "round_a" | "round_b" | "judging" | "verdict";
  subject: string;
  personaA: Persona | null;
  personaB: Persona | null;
  rounds: DebateRound[];
  verdict: JudgeVerdict | null;
  setSubject: (subject: string) => void;
  setPersonas: (personaA: Persona | null, personaB: Persona | null) => void;
  startDebate: () => void;
  addRound: (round: DebateRound) => void;
  nextTurn: (state: "round_a" | "round_b" | "judging" | "verdict") => void;
  requestJudge: () => void;
  setVerdict: (verdict: JudgeVerdict) => void;
  reset: () => void;
}

export const useDebateStore = create<DebateState>((set) => ({
  state: 'idle',
  subject: '',
  personaA: null,
  personaB: null,
  rounds: [],
  verdict: null,
  setSubject: (subject) => set({ subject }),
  setPersonas: (personaA, personaB) => set({ personaA, personaB }),
  startDebate: () => set({ state: 'vs_screen', rounds: [], verdict: null }),
  addRound: (round) => set((state) => ({ rounds: [...state.rounds, round] })),
  nextTurn: (nextState) => set({ state: nextState }),
  requestJudge: () => set({ state: 'judging' }),
  setVerdict: (verdict) => set({ verdict, state: 'verdict' }),
  reset: () => set({ state: 'idle', subject: '', personaA: null, personaB: null, rounds: [], verdict: null }),
}));

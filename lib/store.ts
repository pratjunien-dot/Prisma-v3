import { create } from 'zustand';
import { User } from './firebase';

export type Theme = 'light' | 'dark' | 'oled' | 'aurora' | 'cyberpunk';
export type AccentColor = 'cyan' | 'purple' | 'emerald' | 'rose' | 'amber' | 'teal' | 'blue';
export type Space = 'chat' | 'hub' | 'debate' | 'settings';
export type ChatMode = 'single' | 'duo' | 'trio' | 'debate';

export const RADIO_STATIONS = [
  { name: 'Radio France', genre: 'Généraliste', url: 'https://icecast.radiofrance.fr/franceinter-midfi.mp3' },
  { name: 'FIP', genre: 'Éclectique', url: 'https://icecast.radiofrance.fr/fip-midfi.mp3' },
  { name: 'France Inter', genre: 'Généraliste', url: 'https://icecast.radiofrance.fr/franceinter-midfi.mp3' },
  { name: 'France Culture', genre: 'Culture', url: 'https://icecast.radiofrance.fr/franceculture-midfi.mp3' },
  { name: 'Klassik Radio', genre: 'Classique', url: 'http://stream.klassikradio.de/live/mp3-128/stream.mp3' },
  { name: 'BBC 6 Music', genre: 'Alternative', url: 'http://stream.live.vc.bbcmedia.co.uk/bbc_6music' },
  { name: 'NTS', genre: 'Underground', url: 'https://stream-mixtape-geo.ntslive.net/mixtape' },
  { name: 'Rinse FM', genre: 'Electronic', url: 'http://stream.rinse.fm:8000/stream' },
  { name: 'Jazz Radio', genre: 'Jazz', url: 'http://jazzradio.ice.infomaniak.ch/jazzradio-high.mp3' },
];

export interface Persona {
  id: string;
  uid: string;
  name: string;
  role: string;
  avatarUrl: string;
  systemPrompt: string;
  traits: string[];
  axes: Record<string, number>;
  narrativeTension: number;
  isFavorite: boolean;
  createdAt: string;
}

export interface Message {
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  uid: string;
  mode: ChatMode;
  participants: string[];
  messages: Message[];
  summary: string;
  lastInteraction: string;
}

interface PrismaState {
  user: User | null;
  theme: Theme;
  accentColor: AccentColor;
  activeSpace: Space;
  isHeaderOpen: boolean;
  isFooterOpen: boolean;
  isDockOpen: boolean;
  isRadioDrawerOpen: boolean;
  
  // Chat state
  chatMode: ChatMode;
  selectedPersonas: Persona[];
  activeConversation: Conversation | null;
  
  // Radio state
  radioStation: typeof RADIO_STATIONS[0];
  isRadioPlaying: boolean;
  isRadioMuted: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: AccentColor) => void;
  setActiveSpace: (space: Space) => void;
  toggleHeader: () => void;
  toggleFooter: () => void;
  toggleDock: () => void;
  toggleRadioDrawer: () => void;
  setChatMode: (mode: ChatMode) => void;
  setSelectedPersonas: (personas: Persona[]) => void;
  setActiveConversation: (conv: Conversation | null) => void;
  setRadioStation: (station: typeof RADIO_STATIONS[0]) => void;
  toggleRadioPlay: () => void;
  toggleRadioMute: () => void;
}

export const usePrismaStore = create<PrismaState>((set) => ({
  user: null,
  theme: 'dark',
  accentColor: 'cyan',
  activeSpace: 'hub',
  isHeaderOpen: true,
  isFooterOpen: true,
  isDockOpen: true,
  isRadioDrawerOpen: false,
  
  chatMode: 'single',
  selectedPersonas: [],
  activeConversation: null,

  radioStation: RADIO_STATIONS[0],
  isRadioPlaying: false,
  isRadioMuted: false,
  
  setUser: (user) => set({ user }),
  setTheme: (theme) => set({ theme }),
  setAccentColor: (accentColor) => set({ accentColor }),
  setActiveSpace: (activeSpace) => set({ activeSpace }),
  toggleHeader: () => set((state) => ({ isHeaderOpen: !state.isHeaderOpen })),
  toggleFooter: () => set((state) => ({ isFooterOpen: !state.isFooterOpen })),
  toggleDock: () => set((state) => ({ isDockOpen: !state.isDockOpen })),
  toggleRadioDrawer: () => set((state) => ({ isRadioDrawerOpen: !state.isRadioDrawerOpen })),
  setChatMode: (chatMode) => set({ chatMode }),
  setSelectedPersonas: (selectedPersonas) => set({ selectedPersonas }),
  setActiveConversation: (activeConversation) => set({ activeConversation }),
  setRadioStation: (radioStation) => set({ radioStation, isRadioPlaying: true }),
  toggleRadioPlay: () => set((state) => ({ isRadioPlaying: !state.isRadioPlaying })),
  toggleRadioMute: () => set((state) => ({ isRadioMuted: !state.isRadioMuted })),
}));

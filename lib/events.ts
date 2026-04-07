import mitt from "mitt";
import { Persona } from "./types";

type PrismaEvents = {
  "ui:header-toggle": void;
  "ui:radio-toggle": void;
  "ui:radio-open": void; // Dashboard → Header radio tiroir
  "persona:selected": { persona: Persona };
  "persona:favorited": { persona: Persona };
  "pipeline:reset": void;
  "chat:started": { personaId: string };
  "chat:ended": { conversationId: string };
  "debate:started": { personaA: Persona; personaB: Persona };
  "memory:extracted": { uid: string };
};

export const emitter = mitt<PrismaEvents>();

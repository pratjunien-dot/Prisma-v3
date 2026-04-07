import { ChatMessage } from "@/lib/types";
import { usePipelineStore } from "@/lib/store";
import Markdown from "react-markdown";

export function EventBubble({ message }: { message: ChatMessage }) {
  const { personas, selPersona } = usePipelineStore();
  const activePersona = selPersona !== null ? personas[selPersona] : null;

  if (message.eventType === "system") {
    return (
      <div className="my-2 text-center font-mono text-[10px] text-gray-500">
        {message.content}
      </div>
    );
  }

  if (message.eventType === "tool_call") {
    return (
      <div className="my-2 flex justify-center">
        <div className="rounded-full bg-amber-500/20 border border-amber-500/30 px-3 py-1 font-mono text-[10px] text-amber-400">
          ⚙ {message.toolName || "tool_call"}
        </div>
      </div>
    );
  }

  if (message.eventType === "tool_result") {
    return (
      <div className="my-2 flex justify-center">
        <div className="rounded-full bg-teal-500/20 border border-teal-500/30 px-3 py-1 font-mono text-[10px] text-teal-400">
          ✓ {message.toolName || "ok"}
        </div>
      </div>
    );
  }

  const isUser = message.role === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      {!isUser && activePersona && (
        <img
          src={activePersona.avatarUrl}
          alt={activePersona.name}
          className="mr-2 h-8 w-8 shrink-0 rounded-full bg-black/20 self-end mb-1"
        />
      )}
      <div
        className={`relative max-w-[85%] px-4 py-3 text-sm ${
          isUser
            ? "bg-[var(--accent)] text-black rounded-[18px_18px_4px_18px]"
            : "glass-panel text-white rounded-[18px_18px_18px_4px]"
        }`}
      >
        {!isUser && message.personaName && (
          <div className="mb-1 font-mono text-[10px] font-bold opacity-50" style={{ color: activePersona?.color }}>
            {message.personaName}
          </div>
        )}
        <div className="markdown-body prose prose-sm prose-invert max-w-none">
          <Markdown>{message.content}</Markdown>
          {message.streaming && <span className="ml-1 animate-pulse">▋</span>}
        </div>
      </div>
    </div>
  );
}

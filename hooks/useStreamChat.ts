"use client";

import { usePipelineStore } from "@/lib/store";
import { ChatMessage } from "@/lib/types";
import { useState, useRef, useEffect } from "react";

export function useStreamChat() {
  const { messages, addMessage, appendChunk, finalizeStream, personas, selPersona, intention } = usePipelineStore();
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const activePersona = selPersona !== null ? personas[selPersona] : null;

  const sendMessage = async (content: string) => {
    if (!content.trim() || !activePersona) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
      eventType: "user_input",
    };

    addMessage(userMsg);
    setIsLoading(true);

    const modelMsgId = (Date.now() + 1).toString();
    const modelMsg: ChatMessage = {
      id: modelMsgId,
      role: "model",
      content: "",
      personaName: activePersona.name,
      timestamp: new Date(),
      streaming: true,
      eventType: "model_response",
    };

    addMessage(modelMsg);

    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          systemPrompt: activePersona.systemPrompt,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) throw new Error("Stream failed");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") {
                finalizeStream();
                break;
              }
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  appendChunk(parsed.text);
                }
              } catch (e) {
                console.error("Error parsing stream data", e);
              }
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error("Chat error:", error);
        finalizeStream();
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const stopStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      finalizeStream();
      setIsLoading(false);
    }
  };

  return { sendMessage, stopStream, isLoading };
}

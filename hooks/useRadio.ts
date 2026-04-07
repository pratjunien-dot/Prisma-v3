"use client";

import { useEffect, useRef } from "react";
import { useRadioStore } from "@/lib/store";

const STATIONS: Record<string, string> = {
  "fip": "https://icecast.radiofrance.fr/fip-midfi.mp3",
  "inter": "https://icecast.radiofrance.fr/franceinter-midfi.mp3",
  "culture": "https://icecast.radiofrance.fr/franceculture-midfi.mp3",
  "musique": "https://icecast.radiofrance.fr/francemusique-midfi.mp3",
  "info": "https://icecast.radiofrance.fr/franceinfo-midfi.mp3",
  "nts": "https://stream-mixtape-geo.ntslive.net/mixtape_2",
  "fip-jazz": "https://icecast.radiofrance.fr/fipjazz-midfi.mp3",
  "fip-rock": "https://icecast.radiofrance.fr/fiprock-midfi.mp3",
  "bbc6": "http://stream.live.vc.bbcmedia.co.uk/bbc_6music",
};

export function useRadio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { activeStationId, isPlaying, volume } = useRadioStore();

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;
    
    if (STATIONS[activeStationId]) {
      audio.src = STATIONS[activeStationId];
      if (isPlaying) {
        audio.play().catch(console.error);
      }
    }
  }, [activeStationId]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return null; // This hook just manages the audio element
}

"use client";

import { useWeather } from "@/hooks/useWeather";
import { Glass } from "../ui/Glass";
import { Cloud, Sun, CloudRain, CloudLightning, Snowflake } from "lucide-react";

export function WeatherWidget() {
  const { data, isLoading, error } = useWeather();

  if (isLoading) return <Glass className="flex h-32 items-center justify-center"><div className="animate-pulse bg-white/10 h-8 w-16 rounded"></div></Glass>;
  if (error) return <Glass className="flex h-32 items-center justify-center text-red-400 text-sm">Error</Glass>;

  const getWeatherIcon = (code: number) => {
    if (code <= 3) return <Sun size={32} className="text-yellow-400" />;
    if (code <= 48) return <Cloud size={32} className="text-gray-400" />;
    if (code <= 67 || code >= 80) return <CloudRain size={32} className="text-blue-400" />;
    if (code <= 77) return <Snowflake size={32} className="text-white" />;
    if (code >= 95) return <CloudLightning size={32} className="text-purple-400" />;
    return <Sun size={32} className="text-yellow-400" />;
  };

  return (
    <Glass className="flex h-32 flex-col justify-between p-4">
      <div className="flex items-start justify-between">
        <div className="text-3xl font-bold">{Math.round(data?.temperature_2m)}°</div>
        {getWeatherIcon(data?.weather_code)}
      </div>
      <div className="font-mono text-[9px] text-gray-400 uppercase tracking-wider">
        Ressenti {Math.round(data?.apparent_temperature)}° · Vent {Math.round(data?.wind_speed_10m)}km/h
      </div>
    </Glass>
  );
}

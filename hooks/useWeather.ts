import { useQuery } from "@tanstack/react-query";

export function useWeather(lat = "48.8566", lon = "2.3522") {
  return useQuery({
    queryKey: ["weather", lat, lon],
    queryFn: async () => {
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      if (!res.ok) throw new Error("Failed to fetch weather");
      return res.json();
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

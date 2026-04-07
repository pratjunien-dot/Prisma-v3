import { useQuery } from "@tanstack/react-query";

export function useNews() {
  return useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const res = await fetch("/api/news");
      if (!res.ok) throw new Error("Failed to fetch news");
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

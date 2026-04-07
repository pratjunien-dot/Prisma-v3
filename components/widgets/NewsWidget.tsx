"use client";

import { useNews } from "@/hooks/useNews";
import { Glass } from "../ui/Glass";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export function NewsWidget() {
  const { data, isLoading, error } = useNews();

  if (isLoading) return <Glass className="h-64 p-4"><div className="animate-pulse space-y-4">{[1,2,3].map(i => <div key={i} className="h-12 bg-white/10 rounded"></div>)}</div></Glass>;
  if (error) return <Glass className="h-64 flex items-center justify-center text-red-400 text-sm">Error loading news</Glass>;

  return (
    <Glass className="flex flex-col gap-3 p-4">
      <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--accent)]">Actualités</h3>
      <div className="flex flex-col gap-3">
        {data?.map((item: any, i: number) => (
          <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className="group relative flex flex-col gap-1 pl-3">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--accent)] opacity-50 transition-opacity group-hover:opacity-100" />
            <h4 className="line-clamp-2 text-sm font-medium leading-tight text-gray-200 group-hover:text-white">{item.title}</h4>
            <div className="flex items-center gap-2 font-mono text-[9px] text-gray-500">
              <span>{item.source}</span>
              <span>·</span>
              <span>{formatDistanceToNow(new Date(item.date), { addSuffix: true, locale: fr })}</span>
            </div>
          </a>
        ))}
      </div>
    </Glass>
  );
}

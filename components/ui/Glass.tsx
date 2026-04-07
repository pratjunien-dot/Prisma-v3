import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  intensity?: 1 | 2 | 3;
  className?: string;
}

export function Glass({ children, intensity = 1, className, ...props }: GlassProps) {
  return (
    <div
      className={cn(
        "glass-panel rounded-2xl",
        intensity === 1 && "bg-surface-1",
        intensity === 2 && "bg-surface-2",
        intensity === 3 && "bg-surface-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

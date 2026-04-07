import { AdvancedMatrix } from "@/lib/types";
import { Glass } from "./Glass";
import { AxisBar } from "./AxisBar";

export function MatrixCard({ matrix, selected, onClick }: { matrix: AdvancedMatrix; selected: boolean; onClick: () => void }) {
  const tensionColor = matrix.tension?.intensity === "high" ? "bg-red-500" : matrix.tension?.intensity === "medium" ? "bg-amber-500" : "bg-teal-500";

  return (
    <button
      onClick={onClick}
      className={`w-full text-left transition-all ${selected ? "scale-[1.02]" : "opacity-40 hover:opacity-100"}`}
    >
      <Glass className={`flex flex-col gap-4 p-5 ${selected ? "border-[var(--accent)] neon-glow" : ""}`}>
        <div>
          <h3 className="font-sans text-sm font-bold uppercase tracking-widest">{matrix.name}</h3>
          <p className="font-mono text-[10px] text-[var(--accent)]">{matrix.arch}</p>
        </div>

        <div className="flex flex-col gap-3">
          {matrix.axes.map((axis, i) => (
            <AxisBar key={i} axis={axis} />
          ))}
        </div>

        {matrix.tension && (
          <div className="mt-2 flex items-center gap-2 rounded-lg bg-white/5 p-2">
            <div className={`h-2 w-2 rounded-full ${tensionColor}`} />
            <span className="font-mono text-[9px] text-gray-400">{matrix.tension.description}</span>
          </div>
        )}
      </Glass>
    </button>
  );
}

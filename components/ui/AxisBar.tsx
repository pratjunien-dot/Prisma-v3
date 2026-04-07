import { motion } from "motion/react";
import { AdvancedAxis } from "@/lib/types";

export function AxisBar({ axis }: { axis: AdvancedAxis }) {
  const color = axis.polarity === "left" ? "bg-blue-400" : axis.polarity === "right" ? "bg-amber-400" : "bg-teal-400";

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider text-gray-400">
        <span>{axis.label}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${axis.value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full ${color} rounded-full`}
        />
      </div>
    </div>
  );
}

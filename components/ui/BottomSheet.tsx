"use client";

import { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

export function BottomSheet({ isOpen, onClose, children, title }: { isOpen: boolean; onClose: () => void; children: ReactNode; title?: string }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[100] flex max-h-[90dvh] flex-col rounded-t-[32px] border-t border-white/10 bg-[var(--bg-2)] pb-safe"
          >
            <div className="flex items-center justify-between p-6 pb-4">
              <h2 className="font-sans text-lg font-bold">{title}</h2>
              <button onClick={onClose} className="rounded-full bg-white/5 p-2 text-gray-400 hover:bg-white/10 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

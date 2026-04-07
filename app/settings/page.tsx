"use client";

import { AppearanceSection } from "@/components/settings/AppearanceSection";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { HistorySection } from "@/components/settings/HistorySection";
import { FavoritesSection } from "@/components/settings/FavoritesSection";
import { WidgetsSection } from "@/components/settings/WidgetsSection";
import { motion } from "motion/react";

export default function SettingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="mx-auto flex h-full max-w-lg flex-col gap-6 overflow-y-auto px-4 pb-32 pt-4"
    >
      <div className="text-center">
        <h2 className="font-sans text-2xl font-bold">Réglages</h2>
        <p className="font-mono text-xs text-gray-400">Personnalisez votre expérience Prisma OS</p>
      </div>

      <ProfileSection />
      <AppearanceSection />
      <FavoritesSection />
      <HistorySection />
      <WidgetsSection />
    </motion.div>
  );
}

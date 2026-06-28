"use client";

import { FolderOpen } from "lucide-react";
import { motion } from "motion/react";

interface EmptyStateProps {
  category: string;
  folderPath: string;
}

export function EmptyState({ category, folderPath }: EmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-panel/50 px-8 py-16 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-4 rounded-2xl bg-cyan/10 p-4">
        <FolderOpen className="h-8 w-8 text-cyan" aria-hidden />
      </div>
      <h3 className="text-xl font-semibold text-text">No {category} yet</h3>
      <p className="mt-2 max-w-md text-muted">
        Add media to{" "}
        <code className="rounded bg-white/5 px-2 py-0.5 text-sm text-cyan">
          {folderPath}
        </code>{" "}
        to show work here. Run <code className="text-cyan">pnpm dev</code> and
        the site updates automatically.
      </p>
    </motion.div>
  );
}

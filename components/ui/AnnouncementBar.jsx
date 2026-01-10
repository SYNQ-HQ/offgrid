"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap } from "lucide-react";
import Link from "next/link";
import { createPageUrl } from "@/lib/utils";

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-[#FF5401] text-white relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-center gap-3 text-sm">
          <Zap className="w-4 h-4" />
          <p className="font-light tracking-wide">
            New event launching soon!
            <Link
              href={createPageUrl("Home") + "#events"}
              className="underline ml-2 hover:text-black transition-colors"
            >
              Reserve your spot
            </Link>
          </p>
          <button
            onClick={() => setIsVisible(false)}
            className="absolute right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

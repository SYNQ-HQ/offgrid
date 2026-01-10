"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, X } from "lucide-react";
import Link from "next/link";
import { createPageUrl } from "@/lib/utils";

export default function ScrollPromotion() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isDismissed) return;

      const scrollPercent =
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
        100;

      // Show promo when user scrolls 40% down
      if (scrollPercent > 40 && scrollPercent < 90) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-24 right-6 z-40 max-w-xs"
        >
          <div className="bg-[#F5EDE4] border-2 border-[#FF5401] p-4 shadow-xl relative">
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 text-black/40 hover:text-black transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3">
              <div className="bg-[#FF5401] p-2 rounded-full">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-black font-light text-sm mb-1">
                  First-time offer
                </h4>
                <p className="text-black/60 text-xs mb-3">
                  Get 15% off your first merch order
                </p>
                <Link
                  href={createPageUrl("Merch")}
                  className="inline-block bg-[#FF5401] hover:bg-black text-white text-xs px-4 py-2 transition-colors"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

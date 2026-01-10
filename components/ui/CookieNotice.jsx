"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createPageUrl } from "@/lib/utils";

export default function CookieNotice() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookiesAccepted");
    if (!accepted) {
      setTimeout(() => setIsVisible(true), 2000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setIsVisible(false);
  };

  const handleDecline = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-50"
        >
          <div className="bg-black border border-[#FF5401]/20 p-6 shadow-2xl">
            <button
              onClick={handleDecline}
              className="absolute top-3 right-3 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4">
              <Cookie className="w-6 h-6 text-[#FF5401] flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-light text-lg mb-2">
                  We use cookies
                </h3>
                <p className="text-white/60 text-sm mb-4 leading-relaxed">
                  We use cookies to enhance your experience and analyze our
                  traffic. By continuing, you agree to our use of cookies.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleAccept}
                    className="bg-[#FF5401] hover:bg-white hover:text-black text-white rounded-none h-9 px-6 text-sm"
                  >
                    Accept
                  </Button>
                  <Link
                    href={createPageUrl("Privacy")}
                    className="text-white/60 hover:text-white text-sm flex items-center transition-colors"
                  >
                    Learn more
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

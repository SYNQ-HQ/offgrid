"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { createPageUrl } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-[#F5EDE4] p-2 hover:bg-white/10 rounded"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-20 left-0 right-0 bg-black border-b border-white/10 p-6 space-y-4"
          >
            <a
              href="#manifesto"
              onClick={() => setIsOpen(false)}
              className="block text-[#F5EDE4]/60 text-sm hover:text-[#FF5401] transition-colors"
            >
              MANIFESTO
            </a>
            <a
              href="#experience"
              onClick={() => setIsOpen(false)}
              className="block text-[#F5EDE4]/60 text-sm hover:text-[#FF5401] transition-colors"
            >
              EXPERIENCE
            </a>
            <a
              href="#events"
              onClick={() => setIsOpen(false)}
              className="block text-[#F5EDE4]/60 text-sm hover:text-[#FF5401] transition-colors"
            >
              EVENTS
            </a>
            <a
              href="#store"
              onClick={() => setIsOpen(false)}
              className="block text-[#F5EDE4]/60 text-sm hover:text-[#FF5401] transition-colors"
            >
              STORE
            </a>
            <Link
              href={createPageUrl("Blog")}
              onClick={() => setIsOpen(false)}
              className="block text-[#F5EDE4]/60 text-sm hover:text-[#FF5401] transition-colors"
            >
              BLOG
            </Link>
            <Link
              href={createPageUrl("Contact")}
              onClick={() => setIsOpen(false)}
              className="block text-[#F5EDE4]/60 text-sm hover:text-[#FF5401] transition-colors"
            >
              CONTACT
            </Link>
            <div className="pt-4 border-t border-white/10">
              {user ? (
                <>
                  <Link
                    href={createPageUrl("Profile")}
                    onClick={() => setIsOpen(false)}
                    className="block text-[#FF5401] text-sm hover:text-[#F5EDE4] transition-colors mb-4"
                  >
                    MY PROFILE
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      href={createPageUrl("AdminDashboard")}
                      onClick={() => setIsOpen(false)}
                      className="block text-[#FF5401] text-sm hover:text-[#F5EDE4] transition-colors mb-4"
                    >
                      ADMIN DASHBOARD
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      signOut();
                    }}
                    className="block text-[#F5EDE4]/40 text-sm hover:text-[#FF5401] transition-colors"
                  >
                    LOGOUT
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block text-[#FF5401] text-sm hover:text-[#F5EDE4] transition-colors"
                >
                  LOGIN
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

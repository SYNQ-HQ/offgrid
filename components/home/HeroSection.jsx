"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import Link from "next/link";
import { createPageUrl } from "@/lib/utils";
import MobileNav from "./MobileNav";
import { useSession } from "next-auth/react";

export default function HeroSection() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <section className="min-h-screen bg-black flex flex-col justify-between relative overflow-hidden">
      {/* Subtle grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex justify-between items-center px-6 md:px-12 py-8 relative z-10"
      >
        <div className="text-[#F5EDE4] font-light tracking-[0.3em] text-sm">
          OFFGRID
        </div>
        <div className="hidden md:flex items-center gap-12 text-[#F5EDE4]/60 text-xs tracking-[0.2em]">
          <a
            href="#manifesto"
            className="hover:text-[#FF5401] transition-colors duration-300"
          >
            MANIFESTO
          </a>
          <a
            href="#experience"
            className="hover:text-[#FF5401] transition-colors duration-300"
          >
            EXPERIENCE
          </a>
          <a
            href="#events"
            className="hover:text-[#FF5401] transition-colors duration-300"
          >
            EVENTS
          </a>
          <a
            href="#store"
            className="hover:text-[#FF5401] transition-colors duration-300"
          >
            STORE
          </a>
          <Link
            href={createPageUrl("Blog")}
            className="hover:text-[#FF5401] transition-colors duration-300"
          >
            BLOG
          </Link>
          <Link
            href={createPageUrl("Contact")}
            className="hover:text-[#FF5401] transition-colors duration-300"
          >
            CONTACT
          </Link>
          {user ? (
            <Link
              href={createPageUrl("Profile")}
              className="text-[#FF5401] hover:text-[#F5EDE4] transition-colors duration-300 border border-[#FF5401] px-4 py-2"
            >
              PROFILE
            </Link>
          ) : (
            <Link
              href="/login"
              className="hover:text-[#FF5401] transition-colors duration-300"
            >
              LOGIN
            </Link>
          )}
        </div>
        <MobileNav />
      </motion.nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="text-center"
        >
          <h1 className="text-[#F5EDE4] text-[12vw] md:text-[8vw] font-extralight tracking-[-0.02em] leading-[0.9]">
            OFFGRID
          </h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, delay: 1 }}
            className="h-[1px] bg-gradient-to-r from-transparent via-[#FF5401] to-transparent mx-auto mt-8"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-[#F5EDE4]/50 text-sm md:text-base font-light tracking-[0.15em] mt-12 text-center max-w-md"
        >
          {/* NO WI-FI. NO PITCHING. JUST BUILDERS AND VIBES. */}
          NO SCREENS. NO STANDUP. JUST BUILDERS AND VIBES.
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.8 }}
        className="flex justify-center pb-12 relative z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="w-5 h-5 text-[#F5EDE4]/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}

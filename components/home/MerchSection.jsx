"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, AlertCircle, Plus, Timer } from "lucide-react";

// --- Glitch Text Component ---
const CipherText = ({ text, active }) => {
  const [display, setDisplay] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&";

  useEffect(() => {
    let interval;
    if (active) {
      let iteration = 0;
      interval = setInterval(() => {
        setDisplay(
          text
            .split("")
            .map((letter, index) => {
              if (index < iteration) {
                return text[index];
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join(""),
        );

        if (iteration >= text.length) {
          clearInterval(interval);
        }

        iteration += 1 / 2;
      }, 30);
    } else {
      setDisplay(text);
    }
    return () => clearInterval(interval);
  }, [active, text]);

  return <span>{display}</span>;
};

// --- Marquee Component ---
const Marquee = () => {
  return (
    <div className="overflow-hidden border-t border-b border-white/5 py-3 bg-black relative">
      <div className="absolute inset-0 bg-[#FF5401]/5 mix-blend-overlay" />
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: [0, -1000] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 20,
        }}
      >
        {[...Array(8)].map((_, i) => (
          <span
            key={i}
            className="text-[#F5EDE4]/20 font-mono text-xs tracking-[0.3em] mx-8 flex items-center gap-4"
          >
            /// OFFGRID SYSTEMS /// PROTOTYPE PHASE /// DO NOT DISTRIBUTE
            <AlertCircle className="w-3 h-3 inline-block text-[#FF5401]/50" />
          </span>
        ))}
      </motion.div>
    </div>
  );
};

const MerchItem = ({ imgFront, imgBack, title, delay }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      className="group relative aspect-[3/4] overflow-hidden bg-black cursor-crosshair"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Back Image (Revealed on Hover) */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out"
        style={{
          backgroundImage: `url(${imgBack})`,
          opacity: isHovered ? 0.4 : 0,
          scale: isHovered ? 1.05 : 1,
          filter: "grayscale(100%)",
        }}
      />

      {/* Front Image (Hidden on Hover) */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out"
        style={{
          backgroundImage: `url(${imgFront})`,
          opacity: isHovered ? 0 : 0.6,
          scale: 1,
          filter: "grayscale(100%)",
        }}
      />

      {/* Noise Overlay */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* "COMING SOON" Center Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <div className="overflow-hidden">
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: isHovered ? "0%" : "100%" }}
            transition={{ duration: 0.4, ease: "circOut" }}
            className="bg-[#FF5401] text-black text-2xl md:text-3xl font-bold italic tracking-tighter px-4 py-2 transform -rotate-2"
          >
            COMING SOON
          </motion.div>
        </div>
      </div>

      {/* Crosshair Overlay Corners */}
      <div className="absolute inset-4 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#FF5401]" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#FF5401]" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#FF5401]" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#FF5401]" />
      </div>

      {/* Locked State UI */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-mono text-[#FF5401] border border-[#FF5401] px-2 py-1 bg-black/50 backdrop-blur-md">
            PROTO_00{Math.floor(delay * 100)}
          </span>
          <div className="bg-black/50 p-2 rounded-full backdrop-blur-sm">
            <Lock className="w-4 h-4 text-[#F5EDE4]/60" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-px w-full bg-white/20 overflow-hidden">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 2,
              }}
              className="h-full w-1/3 bg-[#FF5401]"
            />
          </div>
          <p className="text-[#F5EDE4] text-xs font-mono tracking-widest uppercase flex items-center gap-2">
            {title} ///{" "}
            <span className="text-[#FF5401] bg-[#FF5401]/10 px-1">
              <CipherText text="COMING SOON" active={isHovered} />
            </span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default function MerchSection() {
  return (
    <section className="bg-[#0A0A0A] pt-24 pb-0 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-4"
            >
              <span className="w-2 h-2 bg-[#FF5401] rounded-full animate-pulse" />
              <span className="text-[#FF5401] text-xs tracking-[0.2em] font-mono">
                COMING SOON
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#F5EDE4] text-4xl md:text-6xl font-light tracking-tight leading-[0.9]"
            >
              UNIFORM FOR
              <br />
              <span className="text-[#F5EDE4]/30">BUILDERS.</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-right flex flex-col items-end gap-4"
          >
            <Timer className="w-6 h-6 text-[#F5EDE4]/20" />
            <p className="text-[#F5EDE4]/40 text-sm font-mono max-w-xs">
              Collection in development.
              <br />
              Register for drop access.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 border border-white/5 bg-white/5 p-1">
          <MerchItem
            imgFront="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop"
            imgBack="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop"
            title="CORE_TEE"
            delay={0.1}
          />
          <MerchItem
            imgFront="https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop"
            imgBack="https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop"
            title="HOODIE_01"
            delay={0.2}
          />
          <MerchItem
            imgFront="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop"
            imgBack="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop"
            title="FIELD_CAP"
            delay={0.3}
          />
          <MerchItem
            imgFront="https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop"
            imgBack="https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop"
            title="SYSTEM_CREW"
            delay={0.4}
          />
        </div>
      </div>

      {/* Marquee Footer */}
      <Marquee />
    </section>
  );
}
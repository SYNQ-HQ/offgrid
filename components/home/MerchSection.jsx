"use client";
import React from "react";
import { motion } from "framer-motion";
import { Lock, AlertCircle, Loader2 } from "lucide-react";

const MerchItem = ({ img, title, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay }}
    className="group relative aspect-[3/4] overflow-hidden bg-black"
  >
    {/* Image with Filter */}
    <div
      className="absolute inset-0 bg-cover bg-center opacity-60 grayscale group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
      style={{ backgroundImage: `url(${img})` }}
    />

    {/* Noise Overlay */}
    <div
      className="absolute inset-0 opacity-20 pointer-events-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }}
    />

    {/* Locked State UI */}
    <div className="absolute inset-0 flex flex-col justify-between p-6">
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-mono text-[#FF5401] border border-[#FF5401] px-2 py-1">
          PROTO_00{delay * 10}
        </span>
        <Lock className="w-4 h-4 text-[#F5EDE4]/40" />
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
        <p className="text-[#F5EDE4] text-xs font-mono tracking-widest uppercase">
          {title} /// <span className="text-[#FF5401]">LOCKED</span>
        </p>
      </div>
    </div>
  </motion.div>
);

export default function MerchSection() {
  return (
    <section className="bg-[#0A0A0A] py-24 md:py-32 px-6 md:px-12 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-4"
            >
              <span className="w-2 h-2 bg-[#FF5401] rounded-full animate-pulse" />
              <span className="text-[#FF5401] text-xs tracking-[0.2em] font-mono">
                SYSTEM UPDATE
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
            className="text-right"
          >
            <p className="text-[#F5EDE4]/40 text-sm font-mono max-w-xs">
              Secure fabrication in progress.
              <br />
              Access codes issuing soon.
            </p>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
          <MerchItem
            img="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop"
            title="BASIC_TEE"
            delay={0.1}
          />
          <MerchItem
            img="https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop"
            title="HEAVY_HOODIE"
            delay={0.2}
          />
          <MerchItem
            img="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop"
            title="WORK_CAP"
            delay={0.3}
          />
        </div>

        {/* Footer/Marquee */}
        <div className="mt-16 pt-8 border-t border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-4 text-[#F5EDE4]/20 text-xs font-mono uppercase">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Fabricating Assets</span>
          </div>
          <div className="flex items-center gap-2 text-[#FF5401] text-xs font-mono border border-[#FF5401]/30 px-3 py-1 bg-[#FF5401]/5 rounded">
            <AlertCircle className="w-3 h-3" />
            <span>DROP_PENDING</span>
          </div>
        </div>
      </div>
    </section>
  );
}
"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { createPageUrl } from "@/lib/utils";
import { ShoppingBag, ArrowRight } from "lucide-react";

export default function MerchSection() {
  return (
    <section className="bg-[#F5EDE4] py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          {/* Content */}
          <div>
            <span className="text-black/30 text-xs tracking-[0.3em] block mb-4">
              STORE
            </span>
            <h2 className="text-black text-3xl md:text-5xl font-extralight mb-6 leading-[1.2]">
              Gear for the intentional.
            </h2>
            <p className="text-black/50 text-sm leading-relaxed mb-8 max-w-md">
              Curated merchandise that carries the Off-Grid energy. From apparel
              to everyday essentials—each piece designed for builders who value
              substance over noise.
            </p>

            <Link
              href={createPageUrl("Merch")}
              className="inline-flex items-center gap-3 px-8 py-4 bg-black hover:bg-[#FF5401] text-[#F5EDE4] transition-colors duration-300 group"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="text-sm tracking-wider">Visit Store</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="bg-black/10 aspect-square flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-black/20" />
            </div>
            <div className="bg-black aspect-square" />
            <div className="bg-black aspect-square" />
            <div className="bg-black/10 aspect-square flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-black/20" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

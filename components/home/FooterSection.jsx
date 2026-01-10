"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { createPageUrl } from "@/lib/utils";

export default function FooterSection() {
  return (
    <footer className="bg-black py-24 md:py-32 px-6 md:px-12 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 gap-16"
        >
          <div>
            <h3 className="text-[#F5EDE4] text-4xl md:text-5xl font-extralight mb-6">
              OFF-GRID
            </h3>
            <p className="text-[#F5EDE4]/40 text-sm font-light max-w-md leading-relaxed">
              A private IRL culture event for tech builders to unplug, unwind,
              and connect beyond screens.
            </p>
          </div>

          <div className="flex flex-col md:items-end justify-between">
            <div className="space-y-6 mb-8 md:mb-0">
              <div>
                <p className="text-[#F5EDE4]/30 text-xs tracking-[0.2em] mb-3">
                  PAGES
                </p>
                <div className="flex flex-col gap-3 md:items-end">
                  <Link
                    href={createPageUrl("Blog")}
                    className="text-[#F5EDE4]/60 text-sm hover:text-[#FF5401] transition-colors duration-300"
                  >
                    Blog
                  </Link>
                  <Link
                    href={createPageUrl("Contact")}
                    className="text-[#F5EDE4]/60 text-sm hover:text-[#FF5401] transition-colors duration-300"
                  >
                    Contact
                  </Link>
                </div>
              </div>
              <div>
                <p className="text-[#F5EDE4]/30 text-xs tracking-[0.2em] mb-3">
                  SHOP
                </p>
                <div className="flex gap-6 md:justify-end">
                  <Link
                    href={createPageUrl("Merch")}
                    className="text-[#F5EDE4]/60 text-sm hover:text-[#FF5401] transition-colors duration-300"
                  >
                    Store
                  </Link>
                </div>
              </div>
              <div>
                <p className="text-[#F5EDE4]/30 text-xs tracking-[0.2em] md:text-right mb-3">
                  LEGAL
                </p>
                <div className="flex gap-6 md:justify-end">
                  <Link
                    href={createPageUrl("Terms")}
                    className="text-[#F5EDE4]/60 text-sm hover:text-[#FF5401] transition-colors duration-300"
                  >
                    Terms
                  </Link>
                  <Link
                    href={createPageUrl("Privacy")}
                    className="text-[#F5EDE4]/60 text-sm hover:text-[#FF5401] transition-colors duration-300"
                  >
                    Privacy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-[#F5EDE4]/20 text-xs">
            © {new Date().getFullYear()} Off-Grid. All rights reserved.
          </p>
          <p className="text-[#F5EDE4]/20 text-xs">
            Not loud. Not everywhere. Just intentional.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

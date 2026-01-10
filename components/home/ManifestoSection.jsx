"use client";
import React from "react";
import { motion } from "framer-motion";

export default function ManifestoSection() {
  const rules = [
    "No pitching — if someone asks, keep it human.",
    "Phones discouraged — be present.",
    "No panels, no talks, no sponsors on stage.",
    "No forced networking games.",
    "Respect the room.",
  ];

  return (
    <section
      id="manifesto"
      className="min-h-screen bg-[#FF5401] py-24 md:py-32 px-6 md:px-12 relative overflow-hidden"
    >
      {/* Decorative element */}
      <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-black/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 md:mb-32"
        >
          <span className="text-black/40 text-xs tracking-[0.3em] block mb-4">
            THE MANIFESTO
          </span>
          <h2 className="text-black text-3xl md:text-5xl lg:text-6xl font-extralight leading-[1.2] max-w-4xl">
            In a world where tech people are always online, pitching, building,
            and performing—
            <span className="font-normal">
              Off-Grid creates a rare space
            </span>{" "}
            where real conversations happen.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 md:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-black/40 text-xs tracking-[0.3em] block mb-8">
              THE RULES
            </span>
            <ul className="space-y-6">
              {rules.map((rule, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-4 text-black/80"
                >
                  <span className="text-black/30 text-xs font-mono mt-1">
                    0{index + 1}
                  </span>
                  <span className="text-lg md:text-xl font-light">{rule}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col justify-end"
          >
            <blockquote className="text-black text-2xl md:text-3xl font-extralight leading-relaxed border-l-2 border-black/20 pl-6">
              "Off-Grid is not about escaping tech. It's about remembering the
              humans behind it."
            </blockquote>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

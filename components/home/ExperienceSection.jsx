"use client";
import React from "react";
import { motion } from "framer-motion";

export default function ExperienceSection() {
  const phases = [
    {
      time: "ARRIVAL",
      duration: "30 mins",
      title: "Settle In",
      description:
        "Low-tempo music. Drinks served immediately. No loud MC. Guests settle in.",
    },
    {
      time: "PEAK",
      duration: "1.5 hrs",
      title: "The Connection",
      description:
        "DJ switches to upbeat but tasteful set. Lighting slightly brighter. Natural mingling.",
    },
    {
      time: "WIND-DOWN",
      duration: "45 mins",
      title: "Deep Conversations",
      description:
        "Softer music. Deep conversations. People exchange contacts intentionally.",
    },
  ];

  return (
    <section
      id="experience"
      className="min-h-screen bg-[#F5EDE4] py-24 md:py-32 px-6 md:px-12"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 md:mb-32"
        >
          <span className="text-black/30 text-xs tracking-[0.3em] block mb-4">
            THE EXPERIENCE
          </span>
          <h2 className="text-black text-3xl md:text-5xl font-extralight leading-[1.2] max-w-3xl">
            A carefully curated progression from calm to connection.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-4">
          {phases.map((phase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group"
            >
              <div className="border-t border-black/10 pt-8 h-full flex flex-col">
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-[#FF5401] text-xs font-mono">
                    {phase.time}
                  </span>
                  <span className="text-black/30 text-xs">
                    {phase.duration}
                  </span>
                </div>
                <h3 className="text-black text-xl md:text-2xl font-light mb-4 group-hover:text-[#FF5401] transition-colors duration-300">
                  {phase.title}
                </h3>
                <p className="text-black/50 text-sm leading-relaxed flex-1">
                  {phase.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mood & Music */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-24 md:mt-32 grid md:grid-cols-2 gap-12"
        >
          <div>
            <span className="text-black/30 text-xs tracking-[0.3em] block mb-6">
              THE SOUND
            </span>
            <div className="flex flex-wrap gap-3">
              {[
                "Afro-House",
                "Chill Electronic",
                "Deep House",
                "R&B Edits",
              ].map((genre, i) => (
                <span
                  key={i}
                  className="px-4 py-2 border border-black/10 text-black/60 text-sm hover:border-[#FF5401] hover:text-[#FF5401] transition-colors duration-300"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-black/30 text-xs tracking-[0.3em] block mb-6">
              THE CROWD
            </span>
            <div className="flex flex-wrap gap-3">
              {[
                "Founders",
                "Developers",
                "Designers",
                "Creatives",
                "Web3/AI",
                "Community",
              ].map((type, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-black text-[#F5EDE4] text-sm"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

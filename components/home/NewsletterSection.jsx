"use client";
import React from "react";
import { motion } from "framer-motion";
import NewsletterForm from "./NewsletterForm";

export default function NewsletterSection() {
  return (
    <section className="bg-black py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-[#F5EDE4] text-3xl md:text-4xl font-extralight mb-6">
            Stay in the loop
          </h2>
          <p className="text-[#F5EDE4]/50 text-sm mb-8 max-w-md mx-auto">
            Get updates on OffGrid events, stories, and culture delivered to
            your inbox.
          </p>

          <NewsletterForm />

          <p className="text-[#F5EDE4]/30 text-xs mt-6">
            We respect your inbox. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

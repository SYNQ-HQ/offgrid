"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const Partner = ({ partner, delay }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-3/2 flex items-center justify-center rounded-lg bg-black/50 p-4 border border-white/10 transition-colors duration-300 ease-in-out group-hover:bg-black/70 group-hover:border-[#FF5401]">
        <div className="relative h-full w-full">
          <Image
            src={partner.imageUrl}
            alt={`${partner.name} Logo`}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-contain transition-all duration-500 ease-out group-hover:scale-105"
            style={{
              filter: isHovered ? "grayscale(0%)" : "grayscale(100%)",
            }}
          />
        </div>
      </div>
      {/* Crosshair Overlay Corners */}
      <div className="absolute inset-2 border border-white/0 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:border-white/10" />
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute top-0 left-0 h-1.5 w-1.5 border-t border-l border-[#FF5401]" />
        <div className="absolute top-0 right-0 h-1.5 w-1.5 border-t border-r border-[#FF5401]" />
        <div className="absolute bottom-0 left-0 h-1.5 w-1.5 border-b border-l border-[#FF5401]" />
        <div className="absolute bottom-0 right-0 h-1.5 w-1.5 border-b border-r border-[#FF5401]" />
      </div>
      <p className="mt-4 text-center text-xs font-mono tracking-widest text-[#F5EDE4]/40 transition-colors group-hover:text-[#F5EDE4]/80">
        {partner.name}
      </p>
    </motion.div>
  );
};

export default function PartnersSection() {
  const [partners, setPartners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch("/api/partners");
        if (!res.ok) {
          throw new Error("Failed to fetch partners");
        }
        const data = await res.json();
        setPartners(data);
      } catch (error) {
        console.error(error);
        setPartners([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartners();
  }, []);

  if (isLoading || partners.length === 0) {
    return null;
  }

  return (
    <section className="bg-black py-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-light text-[#F5EDE4]/80 tracking-tight">
            In Collaboration With
          </h2>
          <p className="mt-4 text-base text-[#F5EDE4]/40 font-mono max-w-2xl mx-auto">
            We are proud to partner with leading hubs and organizations to build
            the future of the creative and tech ecosystem.
          </p>
        </motion.div>

        {/* Logo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
          {[...partners].map((partner, index) => (
            <Partner
              key={partner.imageUrl}
              partner={partner}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// Placeholder SVG Logo Components for demonstration
const PlaceholderLogo1 = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 40"
    fill="currentColor"
    {...props}
  >
    {/* <path d="M20 0 L0 20 L20 40 L25 40 L5 20 L25 0 Z" />*/}
    <path d="M20 0 L0 20 L20 40 L25 40 L5 20 L25 0 Z" />
    <path d="M40 10 L40 30 L60 30 L60 10 Z M 45 15 L55 15 L55 25 L45 25 Z" />
    <rect x="70" y="15" width="30" height="10" />
  </svg>
);

const PlaceholderLogo2 = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 40"
    fill="currentColor"
    {...props}
  >
    <circle cx="20" cy="20" r="15" />
    <rect x="45" y="5" width="10" height="30" />
    <rect x="65" y="5" width="10" height="30" />
    <rect x="45" y="17.5" width="30" height="5" />
  </svg>
);

const PlaceholderLogo3 = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 40"
    fill="currentColor"
    {...props}
  >
    <path d="M20 0 L0 20 L20 40 L25 40 L5 20 L25 0 Z" />
    <path d="M40 10 L40 30 L60 30 L60 10 Z M 45 15 L55 15 L55 25 L45 25 Z" />
    {/* Right arrow: moved to x=85, rotated 90° clockwise */}
    <g transform="translate(95,20) rotate(90)">
      <rect x="-15" y="-5" width="10" height="10" />
    </g>
  </svg>
);

const PartnerLogo = ({ name, logo: Logo, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="group"
  >
    <div className="flex h-32 items-center justify-center rounded-lg bg-white/5 p-6 transition-colors duration-300 ease-in-out hover:bg-white/10">
      <Logo
        alt={`${name} logo`}
        className="h-full w-auto text-white/50 transition-colors duration-300 ease-in-out group-hover:text-white"
      />
    </div>
  </motion.div>
);

export default function PartnersSection() {
  const partners = [
    { name: "Board Start Hub", logo: PlaceholderLogo1, delay: 0.1 },
    { name: "Root Hub", logo: PlaceholderLogo2, delay: 0.2 },
    { name: "Root Hub", logo: PlaceholderLogo2, delay: 0.3 },
    { name: "Root Hub", logo: PlaceholderLogo2, delay: 0.4 },
    { name: "Root Hub", logo: PlaceholderLogo2, delay: 0.5 },
    { name: "Root Hub", logo: PlaceholderLogo2, delay: 0.6 },
    { name: "Root Hub", logo: PlaceholderLogo2, delay: 0.7 },
    { name: "Board Start Hub", logo: PlaceholderLogo3, delay: 0.8 },
    // Add more partners here. For real logos, use the Image component.
    // Example for a real logo:
    // { name: "Real Partner", logo: (props) => <Image src="/partners/real-logo.svg" alt="Real Partner Logo" width={120} height={40} {...props} />, delay: 0.3 },
  ];

  return (
    <section className="bg-black py-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-light text-[#F5EDE4]/80 tracking-tight">
            In Collaboration With
          </h2>
          <p className="mt-4 text-base text-[#F5EDE4]/40 font-mono max-w-2xl mx-auto">
            We are proud to partner with leading hubs, communities and
            organizations to build the future of the creative and tech
            ecosystem.
          </p>
        </motion.div>

        {/* Logo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {partners.map((partner) => (
            <PartnerLogo
              key={partner.name}
              name={partner.name}
              logo={partner.logo}
              delay={partner.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

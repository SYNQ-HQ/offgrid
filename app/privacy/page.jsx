"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { createPageUrl } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#F5EDE4]">
      {/* Header */}
      <nav className="flex items-center px-6 md:px-12 py-8 border-b border-black/10">
        <Link
          href={createPageUrl("Home")}
          className="flex items-center gap-2 text-black/60 hover:text-[#FF5401] transition-colors duration-300 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-black text-4xl md:text-5xl font-extralight mb-8">
            Privacy Policy
          </h1>

          <div className="prose prose-sm max-w-none text-black/70 space-y-6">
            <div>
              <h2 className="text-2xl font-light text-black mb-3">
                1. Information We Collect
              </h2>
              <p>
                We collect information you provide directly to us, such as when
                you create an account, make a purchase, or sign up for our
                newsletter. This includes name, email address, and other contact
                information.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-light text-black mb-3">
                2. How We Use Your Information
              </h2>
              <p>
                We use the information we collect to provide, maintain, and
                improve our services, process transactions, send you technical
                notices and support messages, and send marketing communications
                (with your consent).
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-light text-black mb-3">
                3. Data Security
              </h2>
              <p>
                We implement appropriate technical and organizational measures
                designed to protect your personal information against
                unauthorized access, alteration, disclosure, or destruction.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-light text-black mb-3">
                4. Third-Party Services
              </h2>
              <p>
                Our website may contain links to third-party websites and
                services. We are not responsible for the privacy practices of
                these external sites. We encourage you to review their privacy
                policies.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-light text-black mb-3">
                5. Your Rights
              </h2>
              <p>
                You have the right to access, update, or delete your personal
                information at any time by contacting us. We will respond to
                your request within a reasonable timeframe.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-light text-black mb-3">
                6. Contact Us
              </h2>
              <p>
                If you have any questions about this privacy policy or our
                privacy practices, please contact us using the contact
                information provided on our website.
              </p>
            </div>

            <p className="text-black/50 text-xs pt-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

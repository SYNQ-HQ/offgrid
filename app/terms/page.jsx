"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { createPageUrl } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export default function Terms() {
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
            Terms of Service
          </h1>

          <div className="prose prose-sm max-w-none text-black/70 space-y-6">
            <div>
              <h2 className="text-2xl font-light text-black mb-3">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing and using the OffGrid website and services, you
                accept and agree to be bound by the terms and provision of this
                agreement. If you do not agree to abide by the above, please do
                not use this service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-light text-black mb-3">
                2. User Responsibilities
              </h2>
              <p>
                You agree to use this website only for lawful purposes and in a
                way that does not infringe upon the rights of others or restrict
                their use and enjoyment of the website.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-light text-black mb-3">
                3. Intellectual Property Rights
              </h2>
              <p>
                Unless otherwise stated, OffGrid owns the intellectual property
                rights for all material on this website. All intellectual
                property rights are reserved. You may view and print pages from
                the website for personal use, subject to restrictions set in
                these terms and conditions.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-light text-black mb-3">
                4. Limitations of Liability
              </h2>
              <p>
                In no event shall OffGrid, nor any of its officers, directors
                and employees, be liable to you for anything arising out of or
                in any way connected with your use of this website.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-light text-black mb-3">
                5. Governing Law
              </h2>
              <p>
                These terms and conditions are governed by and construed in
                accordance with the laws of the jurisdiction in which OffGrid
                operates, and you irrevocably submit to the exclusive
                jurisdiction of the courts located in that location.
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

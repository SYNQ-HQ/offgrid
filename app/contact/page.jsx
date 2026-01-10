"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import Link from "next/link";
import { createPageUrl } from "@/lib/utils";
import { ArrowLeft, Loader2, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send confirmation to user
      await base44.integrations.Core.SendEmail({
        to: formData.email,
        subject: `Off-Grid: We received your message`,
        body: `Hi ${formData.name},\n\nThank you for reaching out. We'll get back to you soon.\n\nOff-Grid Team`,
      });

      // Get admin users to notify
      const admins = await base44.entities.User.filter({ role: "admin" });

      // Send to all admins
      for (const admin of admins) {
        await base44.integrations.Core.SendEmail({
          to: admin.email,
          subject: `New contact form submission: ${formData.subject}`,
          body: `Name: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`,
        });
      }

      setIsSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error sending email:", error);
    }

    setIsSubmitting(false);
  };

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

      <div className="max-w-2xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-black/30 text-xs tracking-[0.3em] block mb-4">
            CONTACT
          </span>
          <h1 className="text-black text-4xl md:text-5xl font-extralight mb-4">
            Get in Touch
          </h1>
          <p className="text-black/50 text-sm max-w-lg mb-12">
            Have questions? We'd love to hear from you.
          </p>

          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 bg-[#FF5401] rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-light text-black mb-3">
                Message sent
              </h2>
              <p className="text-black/50 text-sm max-w-md mx-auto">
                Thanks for reaching out. We'll be in touch soon.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-black/60 text-xs tracking-wider">
                  NAME *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="bg-transparent border-black/10 focus:border-[#FF5401] rounded-none h-12"
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-black/60 text-xs tracking-wider">
                  EMAIL *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="bg-transparent border-black/10 focus:border-[#FF5401] rounded-none h-12"
                  placeholder="your@email.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-black/60 text-xs tracking-wider">
                  SUBJECT *
                </label>
                <Input
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  required
                  className="bg-transparent border-black/10 focus:border-[#FF5401] rounded-none h-12"
                  placeholder="What is this about?"
                />
              </div>

              <div className="space-y-2">
                <label className="text-black/60 text-xs tracking-wider">
                  MESSAGE *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                  className="w-full bg-transparent border border-black/10 focus:border-[#FF5401] p-4 text-black placeholder-black/30 rounded-none h-32"
                  placeholder="Your message..."
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black hover:bg-[#FF5401] text-white rounded-none h-12 text-sm tracking-wider"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}

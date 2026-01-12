"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { apiClient } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Check } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function NewsletterForm() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Check if already subscribed
      const existing = await apiClient.entities.NewsletterSubscriber.filter({
        email,
      });

      if (existing.length === 0) {
        await apiClient.entities.NewsletterSubscriber.create({ email });
      }

      // Send welcome email
      await apiClient.integrations.Core.SendEmail({
        to: email,
        subject: "Welcome to OffGrid Newsletter",
        body: `Welcome to the OffGrid community!\n\nYou're now subscribed to our newsletter. We'll share updates, stories, and exclusive content about OffGrid events and culture.\n\nOffGrid Team`,
      });

      setIsSuccess(true);
      toast({
        title: "Subscribed!",
        description: "Welcome to the OffGrid community.",
        variant: "success",
      });
      setEmail("");
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "error",
      });
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {isSuccess ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-green-600 text-sm"
        >
          <Check className="w-4 h-4" />
          You're subscribed!
        </motion.div>
      ) : (
        <div className="flex gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="bg-transparent border-white/20 text-white placeholder-white/50 focus:border-[#FF5401] rounded-none h-12"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-[#FF5401] hover:bg-white hover:text-black text-white rounded-none h-12 px-6"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Join"}
          </Button>
        </div>
      )}
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </form>
  );
}

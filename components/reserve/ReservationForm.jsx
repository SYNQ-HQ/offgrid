"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Check } from "lucide-react";

const roles = [
  { value: "founder", label: "Founder" },
  { value: "developer", label: "Developer" },
  { value: "designer", label: "Designer" },
  { value: "growth_marketing", label: "Growth & Marketing" },
  { value: "web3_ai", label: "Web3 / AI" },
  { value: "creative", label: "Creative" },
  { value: "community_lead", label: "Community Lead" },
  { value: "other", label: "Other" },
];

export default function ReservationForm({ onSubmit, isSubmitting, isSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    instagram: "",
    twitter: "",
    role: "",
    referral: "",
    seats: 1,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 bg-[#FF5401] rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-light text-black mb-3">
          You're on the list.
        </h3>
        <p className="text-black/50 text-sm max-w-md mx-auto">
          We'll be in touch with the details. Keep an eye on your inbox.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-black/60 text-xs tracking-wider">
            FULL NAME *
          </Label>
          <Input
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
            className="bg-transparent border-black/10 focus:border-[#FF5401] rounded-none h-12 text-black"
            placeholder="Your name"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-black/60 text-xs tracking-wider">
            EMAIL *
          </Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
            className="bg-transparent border-black/10 focus:border-[#FF5401] rounded-none h-12 text-black"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-black/60 text-xs tracking-wider">
            INSTAGRAM
          </Label>
          <Input
            value={formData.instagram}
            onChange={(e) => handleChange("instagram", e.target.value)}
            className="bg-transparent border-black/10 focus:border-[#FF5401] rounded-none h-12 text-black"
            placeholder="@handle"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-black/60 text-xs tracking-wider">
            TWITTER / X
          </Label>
          <Input
            value={formData.twitter}
            onChange={(e) => handleChange("twitter", e.target.value)}
            className="bg-transparent border-black/10 focus:border-[#FF5401] rounded-none h-12 text-black"
            placeholder="@handle"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-black/60 text-xs tracking-wider">
          WHAT DO YOU DO? *
        </Label>
        <Select
          value={formData.role}
          onValueChange={(value) => handleChange("role", value)}
          required
        >
          <SelectTrigger className="bg-transparent border-black/10 focus:border-[#FF5401] rounded-none h-12 text-black">
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-black/60 text-xs tracking-wider">
          HOW DID YOU HEAR ABOUT US?
        </Label>
        <Textarea
          value={formData.referral}
          onChange={(e) => handleChange("referral", e.target.value)}
          className="bg-transparent border-black/10 focus:border-[#FF5401] rounded-none min-h-[100px] text-black resize-none"
          placeholder="Friend referral, Twitter, etc."
        />
      </div>

      <div className="space-y-2">
        <Label className="text-black/60 text-xs tracking-wider">
          NUMBER OF SEATS
        </Label>
        <Select
          value={String(formData.seats)}
          onValueChange={(value) => handleChange("seats", parseInt(value))}
        >
          <SelectTrigger className="bg-transparent border-black/10 focus:border-[#FF5401] rounded-none h-12 text-black w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        disabled={
          isSubmitting || !formData.name || !formData.email || !formData.role
        }
        className="w-full bg-black hover:bg-[#FF5401] text-white rounded-none h-14 text-sm tracking-wider transition-colors duration-300"
      >
        {isSubmitting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          "REQUEST RESERVATION"
        )}
      </Button>

      <p className="text-black/30 text-xs text-center">
        Reservations are reviewed individually. We'll confirm your spot via
        email.
      </p>
    </form>
  );
}

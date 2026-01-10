"use client";

import React, { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createPageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const cartDataStr = searchParams.get("cart");
  const cartData = cartDataStr ? JSON.parse(cartDataStr) : [];
  
  const [formData, setFormData] = useState({
    email: "",
    name: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const total = cartData.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handlePaystackPayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError("");

    try {
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          amount: total,
          items: cartData,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Payment initialization failed");
      }

      // Redirect user to Paystack checkout page
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        throw new Error("No authorization URL returned");
      }

    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong.");
      setIsProcessing(false);
    }
  };

  if (!cartData || cartData.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5EDE4] flex flex-col">
        <nav className="flex items-center px-6 md:px-12 py-8 border-b border-black/10">
          <Link
            href={createPageUrl("Merch")}
            className="flex items-center gap-2 text-black/60 hover:text-[#FF5401] transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </nav>
        <div className="flex-1 flex items-center justify-center px-6">
          <p className="text-black/50">No items in cart.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EDE4]">
      {/* Header */}
      <nav className="flex items-center px-6 md:px-12 py-8 border-b border-black/10">
        <Link
          href={createPageUrl("Merch")}
          className="flex items-center gap-2 text-black/60 hover:text-[#FF5401] transition-colors duration-300 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-black text-3xl md:text-4xl font-extralight mb-2">
              Checkout
            </h1>
            <p className="text-black/50 text-sm mb-12">Complete your order with Paystack</p>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Form */}
              <form onSubmit={handlePaystackPayment} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-black/60 text-xs tracking-wider">EMAIL *</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-transparent border-black/10 focus:border-[#FF5401] rounded-none h-12 text-black placeholder:text-black/30"
                    placeholder="your@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-black/60 text-xs tracking-wider">NAME *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-transparent border-black/10 focus:border-[#FF5401] rounded-none h-12 text-black placeholder:text-black/30"
                    placeholder="Full name"
                  />
                </div>

                <div className="p-4 bg-white border border-black/10 text-sm text-black/60">
                    You will be redirected to Paystack to complete your payment securely via Card or Bank Transfer.
                </div>

                {error && (
                  <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-none">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-black hover:bg-[#FF5401] text-white rounded-none h-14 text-sm tracking-wider transition-colors duration-300"
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    `Pay $${total.toFixed(2)}`
                  )}
                </Button>
              </form>

              {/* Order Summary Sidebar */}
              <div>
                <div className="bg-white border border-black/10 p-8 sticky top-6">
                  <h3 className="text-black font-light text-lg mb-6">
                    Order Summary
                  </h3>
                  <div className="space-y-4 mb-6 pb-6 border-b border-black/10">
                    {cartData.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-black/60">
                          {item.name} <span className="text-black/30">x{item.quantity}</span>
                        </span>
                        <span className="text-black font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-black font-light">Total</span>
                    <span className="text-[#FF5401] font-normal">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
      </div>
    </div>
  );
}

export default function Checkout() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5EDE4] flex items-center justify-center text-black/50">
          Loading checkout...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
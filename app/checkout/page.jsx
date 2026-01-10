"use client";

import React, { useState, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createPageUrl } from "@/lib/utils";
import { base44 } from "@/api/base44Client";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, AlertCircle, Loader2, Check } from "lucide-react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || "");

function CheckoutForm({ cartData, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    address: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError("");

    const cardElement = elements.getElement(CardElement);
    const { token, error: tokenError } = await stripe.createToken(cardElement);

    if (tokenError) {
      setError(tokenError.message);
      setIsProcessing(false);
      return;
    }

    // Create order in database
    const order = await base44.entities.Order.create({
      stripe_payment_id: token.id,
      customer_email: formData.email,
      customer_name: formData.name,
      items: cartData,
      total_amount: cartData.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      ),
      shipping_address: formData.address,
      status: "completed",
    });

    if (order) {
      // Send confirmation email
      await base44.integrations.Core.SendEmail({
        to: formData.email,
        subject: "Order Confirmed - Off-Grid Store",
        body: `Hi ${formData.name},\n\nThank you for your order! Your purchase has been confirmed.\n\nOrder ID: ${order.id}\nTotal: $${order.total_amount.toFixed(2)}\n\nWe'll ship your items soon. Check your account to track your order.\n\nOff-Grid Team`,
      });
      onSuccess();
    } else {
      setError("Failed to create order. Please try again.");
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label className="text-black/60 text-xs tracking-wider">EMAIL *</Label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="bg-transparent border-black/10 focus:border-[#FF5401] rounded-none h-12"
          placeholder="your@email.com"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-black/60 text-xs tracking-wider">NAME *</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="bg-transparent border-black/10 focus:border-[#FF5401] rounded-none h-12"
          placeholder="Full name"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-black/60 text-xs tracking-wider">
          SHIPPING ADDRESS
        </Label>
        <Input
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          className="bg-transparent border-black/10 focus:border-[#FF5401] rounded-none h-12"
          placeholder="Address (optional)"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-black/60 text-xs tracking-wider">CARD *</Label>
        <div className="p-4 border border-black/10 rounded-none">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#000000",
                  "::placeholder": {
                    color: "rgba(0,0,0,0.3)",
                  },
                },
                invalid: {
                  color: "#fa755a",
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-none">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isProcessing || !stripe}
        className="w-full bg-black hover:bg-[#FF5401] text-white rounded-none h-12 text-sm tracking-wider"
      >
        {isProcessing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          "Complete Purchase"
        )}
      </Button>
    </form>
  );
}

function SuccessMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16"
    >
      <div className="w-16 h-16 bg-[#FF5401] rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-2xl font-light text-black mb-3">Order confirmed.</h2>
      <p className="text-black/50 text-sm max-w-md mx-auto mb-8">
        Thanks for your purchase. Check your email for order details.
      </p>
      <Link
        href={createPageUrl("Home")}
        className="inline-flex items-center gap-2 px-8 py-4 bg-black hover:bg-[#FF5401] text-white transition-colors duration-300"
      >
        Back Home
      </Link>
    </motion.div>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const cartDataStr = searchParams.get("cart");
  const cartData = cartDataStr ? JSON.parse(cartDataStr) : [];
  const [isSuccess, setIsSuccess] = useState(false);

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

  const total = cartData.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

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

      <div className="max-w-2xl mx-auto px-6 md:px-12 py-12 md:py-24">
        {isSuccess ? (
          <SuccessMessage />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-black text-3xl md:text-4xl font-extralight mb-2">
              Checkout
            </h1>
            <p className="text-black/50 text-sm mb-12">Complete your order</p>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Order Summary */}
              <div className="md:col-span-2">
                <Elements stripe={stripePromise}>
                  <CheckoutForm
                    cartData={cartData}
                    onSuccess={() => setIsSuccess(true)}
                  />
                </Elements>
              </div>

              {/* Order Summary Sidebar */}
              <div>
                <div className="bg-white border border-black/10 p-6 sticky top-6">
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
                          {item.name} x{item.quantity}
                        </span>
                        <span className="text-black font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black/60">Total</span>
                    <span className="text-[#FF5401] text-xl font-light">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function Checkout() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5EDE4] flex items-center justify-center text-black/50">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}

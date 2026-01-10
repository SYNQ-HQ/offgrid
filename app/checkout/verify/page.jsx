"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { createPageUrl } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

function VerifyContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference"); // Paystack sends back ?reference=...
  const router = useRouter();
  const queryClient = useQueryClient();

  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("Verifying payment...");

  useEffect(() => {
    if (!reference) {
      setStatus("error");
      setMessage("Invalid payment reference.");
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch("/api/paystack/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference }),
        });

        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          // Clear cart from local storage if used
          if (typeof window !== "undefined") {
             // If you used a store like zustand/context, clear it here.
             // We'll rely on the user manually navigating away or the CartSidebar clearing itself if it listens to something.
             // But usually we want to trigger a global "clear cart" event.
             // For now, let's assume the user just sees the success.
             window.dispatchEvent(new Event("cart-clear")); // Custom event if we had a listener
          }
          queryClient.invalidateQueries(["orders"]);
        } else {
          setStatus("error");
          setMessage(data.error || "Payment verification failed.");
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
        setMessage("Connection error.");
      }
    };

    verifyPayment();
  }, [reference, queryClient]);

  return (
    <div className="min-h-screen bg-[#F5EDE4] flex items-center justify-center p-6">
      <div className="bg-white border border-black/10 p-12 text-center max-w-md w-full">
        {status === "verifying" && (
          <>
            <Loader2 className="w-12 h-12 animate-spin text-[#FF5401] mx-auto mb-6" />
            <h2 className="text-2xl font-light text-black mb-2">Verifying...</h2>
            <p className="text-black/50">Please wait while we confirm your order.</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-light text-black mb-2">Order Confirmed</h2>
            <p className="text-black/50 mb-8">
              Thank you for your purchase. We've sent a confirmation email.
            </p>
            <Link
              href={createPageUrl("Profile")}
              className="inline-block bg-black text-white px-8 py-3 text-sm hover:bg-[#FF5401] transition-colors"
            >
              VIEW ORDER
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-light text-black mb-2">Payment Failed</h2>
            <p className="text-black/50 mb-8">{message}</p>
            <Link
              href={createPageUrl("Merch")}
              className="inline-block border border-black px-8 py-3 text-sm hover:bg-black hover:text-white transition-colors"
            >
              RETURN TO STORE
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function CheckoutVerify() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5EDE4]" />}>
      <VerifyContent />
    </Suspense>
  );
}

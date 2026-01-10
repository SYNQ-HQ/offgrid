"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { createPageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X, ShoppingBag, Trash2 } from "lucide-react";

export default function CartSidebar({ isOpen, onClose, cart, onUpdateCart }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-black/10">
              <h2 className="text-lg font-light text-black">
                Cart ({itemCount})
              </h2>
              <button
                onClick={onClose}
                className="text-black/50 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-12 h-12 text-black/20 mb-4" />
                  <p className="text-black/50 text-sm">Your cart is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    className="flex gap-4 pb-4 border-b border-black/5 last:border-b-0"
                  >
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-16 h-16 object-cover bg-black/5"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-light text-black mb-1">
                        {item.name}
                      </h4>
                      <p className="text-[#FF5401] text-sm mb-2">
                        ₦{(item.price * item.quantity).toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 bg-black/5 px-2 py-1 w-fit">
                        <button
                          onClick={() =>
                            onUpdateCart(item.id, item.quantity - 1)
                          }
                          className="text-black/60 hover:text-black text-xs"
                        >
                          −
                        </button>
                        <span className="w-4 text-center text-xs">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            onUpdateCart(item.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.stock}
                          className="text-black/60 hover:text-black text-xs disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => onUpdateCart(item.id, 0)}
                      className="text-black/30 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-black/10 p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-black/60">Total</span>
                  <span className="text-[#FF5401] text-xl font-light">
                    ₦{total.toFixed(2)}
                  </span>
                </div>
                <Link
                  href={
                    createPageUrl("Checkout") +
                    `?cart=${encodeURIComponent(JSON.stringify(cart))}`
                  }
                  onClick={onClose}
                  className="w-full block bg-black hover:bg-[#FF5401] text-white rounded-none h-12 text-sm tracking-wider transition-colors duration-300 flex items-center justify-center"
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

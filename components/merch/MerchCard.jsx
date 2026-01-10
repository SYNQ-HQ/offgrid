"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Plus, Minus } from "lucide-react";

export default function MerchCard({ item, onAddToCart, cartQuantity = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="group"
    >
      <div className="bg-white border border-black/10 overflow-hidden hover:border-[#FF5401] transition-colors duration-300">
        {/* Image */}
        <div className="relative overflow-hidden aspect-square bg-black/5">
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {item.stock <= 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white text-sm font-light">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-black text-lg font-light mb-2 group-hover:text-[#FF5401] transition-colors duration-300">
              {item.name}
            </h3>
            {item.description && (
              <p className="text-black/50 text-sm leading-relaxed">
                {item.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-black/10">
            <span className="text-[#FF5401] text-lg font-light">
              ₦{item.price.toFixed(2)}
            </span>
            {cartQuantity > 0 ? (
              <div className="flex items-center gap-2 bg-black/5 px-3 py-2 rounded-none">
                <button
                  onClick={() => onAddToCart(item, -1)}
                  className="text-black/60 hover:text-black transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-6 text-center text-sm font-medium">
                  {cartQuantity}
                </span>
                <button
                  onClick={() => onAddToCart(item, 1)}
                  disabled={cartQuantity >= item.stock}
                  className="text-black/60 hover:text-black transition-colors disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Button
                onClick={() => onAddToCart(item, 1)}
                disabled={item.stock <= 0}
                size="sm"
                className="bg-black hover:bg-[#FF5401] text-white rounded-none text-xs"
              >
                <ShoppingBag className="w-3 h-3 mr-2" />
                Add
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import Link from "next/link";
import { createPageUrl } from "@/lib/utils";
import { ShoppingBag, ArrowLeft, Search } from "lucide-react";
import MerchCard from "@/components/merch/MerchCard";
import CartSidebar from "@/components/merch/CartSidebar";
import { Input } from "@/components/ui/input";

export default function Merch() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: items = [] } = useQuery({
    queryKey: ["merch"],
    queryFn: () => base44.entities.Merch.list("-createdAt", 50),
    initialData: [],
  });

  const categories = ["all", "apparel", "accessories", "drinkware", "other"];
  const filteredItems = items.filter((item) => {
    const categoryMatch =
      selectedCategory === "all" || item.category === selectedCategory;
    const searchMatch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description &&
        item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return categoryMatch && searchMatch;
  });

  const handleAddToCart = (item, quantity) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity <= 0) {
          return prevCart.filter((i) => i.id !== item.id);
        }
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: newQuantity } : i,
        );
      }
      if (quantity > 0) {
        return [...prevCart, { ...item, quantity }];
      }
      return prevCart;
    });
  };

  const handleUpdateCart = (itemId, quantity) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((i) => i.id !== itemId));
    } else {
      setCart((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, quantity } : i)),
      );
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F5EDE4]">
      {/* Header */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-8 border-b border-black/10">
        <Link
          href={createPageUrl("Home")}
          className="flex items-center gap-2 text-black/60 hover:text-[#FF5401] transition-colors duration-300 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <div className="text-black font-light tracking-[0.3em] text-sm">
          OFFGRID STORE
        </div>
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex items-center gap-2 text-black/60 hover:text-[#FF5401] transition-colors duration-300 text-sm"
        >
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#FF5401] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
              {cartCount}
            </span>
          )}
        </button>
      </nav>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-black/30 text-xs tracking-[0.3em] block mb-4">
            STORE
          </span>
          <h1 className="text-black text-4xl md:text-5xl font-extralight mb-4">
            Off-Grid Merch
          </h1>
          <p className="text-black/50 text-sm max-w-lg">
            Curated gear for the intentional builder. Every piece carries the
            OffGrid energy.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black/30" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="bg-white border-black/10 focus:border-[#FF5401] rounded-none h-12 pl-12 w-full"
            />
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs tracking-wider transition-all duration-300 border ${
                selectedCategory === cat
                  ? "bg-black text-[#F5EDE4] border-black"
                  : "border-black/20 text-black hover:border-[#FF5401]"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1).replace("_", " ")}
            </button>
          ))}
        </motion.div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <p className="text-black/50 text-sm">
              No items in this category yet.
            </p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => {
              const cartItem = cart.find((i) => i.id === item.id);
              return (
                <MerchCard
                  key={item.id}
                  item={item}
                  onAddToCart={handleAddToCart}
                  cartQuantity={cartItem?.quantity || 0}
                />
              );
            })}
          </div>
        )}
      </div>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateCart={handleUpdateCart}
      />
    </div>
  );
}

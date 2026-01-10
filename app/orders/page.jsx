"use client";
import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import Link from "next/link";
import { createPageUrl } from "@/lib/utils";
import { ArrowLeft, Package, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function Orders() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const getUser = async () => {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    };
    getUser();
  }, []);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders", user?.email],
    queryFn: () =>
      user
        ? base44.entities.Order.filter(
            { customer_email: user.email },
            "-createdAt",
            100,
          )
        : Promise.resolve([]),
    enabled: !!user,
    initialData: [],
  });

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

      <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-black text-3xl md:text-4xl font-extralight mb-2">
            Order History
          </h1>
          <p className="text-black/50 text-sm mb-12">
            Track all your Off-Grid store purchases
          </p>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-black/50">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-black/20 mx-auto mb-4" />
              <p className="text-black/50 mb-4">No orders yet</p>
              <Link
                href={createPageUrl("Merch")}
                className="text-[#FF5401] hover:text-black transition-colors text-sm"
              >
                Start shopping →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, idx) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="bg-white border border-black/10 p-6 hover:border-[#FF5401] transition-colors duration-300"
                >
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <p className="text-black/50 text-xs tracking-wider mb-2">
                        ORDER ID
                      </p>
                      <p className="text-black font-light">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-black/50 text-xs tracking-wider mb-2">
                        DATE
                      </p>
                      <div className="flex items-center gap-2 text-black font-light">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(order.createdAt), "MMM d, yyyy")}
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 pb-6 border-b border-black/10">
                    <p className="text-black/50 text-xs tracking-wider mb-3">
                      ITEMS
                    </p>
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-black/60">
                            {item.name} x{item.quantity}
                          </span>
                          <span className="text-black">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-black/50 text-xs tracking-wider mb-2">
                        TOTAL
                      </p>
                      <p className="text-[#FF5401] text-xl font-light">
                        ${order.total_amount.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-4 py-2 text-xs tracking-wider font-medium rounded-none ${
                          order.status === "completed"
                            ? "bg-green-50 text-green-600"
                            : order.status === "pending"
                              ? "bg-yellow-50 text-yellow-600"
                              : "bg-red-50 text-red-600"
                        }`}
                      >
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

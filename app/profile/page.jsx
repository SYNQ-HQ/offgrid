"use client";
import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import Link from "next/link";
import { createPageUrl } from "@/lib/utils";
import { ArrowLeft, ShoppingBag, Ticket } from "lucide-react";
import { format } from "date-fns";

export default function UserProfile() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const getUser = async () => {
      const currentUser = await apiClient.auth.me();
      setUser(currentUser);
    };
    getUser();
  }, []);

  const { data: orders = [] } = useQuery({
    queryKey: ["orders", user?.email],
    queryFn: () =>
      user
        ? apiClient.entities.Order.filter(
            { customer_email: user.email },
            "-createdAt",
            10,
          )
        : Promise.resolve([]),
    enabled: !!user,
    initialData: [],
  });

  const { data: reservations = [] } = useQuery({
    queryKey: ["reservations", user?.email],
    queryFn: () =>
      user
        ? apiClient.entities.Reservation.filter(
            { email: user.email },
            "-createdAt",
            10,
          )
        : Promise.resolve([]),
    enabled: !!user,
    initialData: [],
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F5EDE4] flex items-center justify-center">
        <p className="text-black/50">Loading...</p>
      </div>
    );
  }

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
          {/* Profile Info */}
          <div className="bg-white border border-black/10 p-8 mb-12">
            <h1 className="text-black text-3xl md:text-4xl font-extralight mb-8">
              Profile
            </h1>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-black/50 text-xs tracking-wider mb-2">
                  NAME
                </p>
                <p className="text-black font-light text-lg">
                  {user.full_name}
                </p>
              </div>
              <div>
                <p className="text-black/50 text-xs tracking-wider mb-2">
                  EMAIL
                </p>
                <p className="text-black font-light text-lg">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <ShoppingBag className="w-5 h-5 text-black" />
              <h2 className="text-black text-2xl font-extralight">
                Recent Orders
              </h2>
            </div>
            {orders.length === 0 ? (
              <div className="text-center py-12 bg-white border border-black/10 p-6">
                <p className="text-black/50 mb-4">No orders yet</p>
                <Link
                  href={createPageUrl("Merch")}
                  className="text-[#FF5401] hover:text-black transition-colors text-sm"
                >
                  Shop now →
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 mb-12">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white border border-black/10 p-4 flex justify-between items-center hover:border-[#FF5401] transition-colors"
                  >
                    <div>
                      <p className="text-black text-sm font-medium">
                        ${order.total_amount.toFixed(2)}
                      </p>
                      <p className="text-black/50 text-xs">
                        {format(new Date(order.createdAt), "MMM d, yyyy")}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-none ${
                        order.status === "completed"
                          ? "bg-green-50 text-green-600"
                          : "bg-yellow-50 text-yellow-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <Link
              href={createPageUrl("Orders")}
              className="text-[#FF5401] hover:text-black transition-colors text-sm"
            >
              View all orders →
            </Link>
          </div>

          {/* Recent Reservations */}
          <div className="mt-16">
            <div className="flex items-center gap-2 mb-6">
              <Ticket className="w-5 h-5 text-black" />
              <h2 className="text-black text-2xl font-extralight">
                Event Reservations
              </h2>
            </div>
            {reservations.length === 0 ? (
              <div className="text-center py-12 bg-white border border-black/10 p-6">
                <p className="text-black/50 mb-4">No reservations yet</p>
                <Link
                  href={createPageUrl("Home")}
                  className="text-[#FF5401] hover:text-black transition-colors text-sm"
                >
                  Browse events →
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {reservations.map((res) => (
                  <div
                    key={res.id}
                    className="bg-white border border-black/10 p-4 flex justify-between items-center hover:border-[#FF5401] transition-colors"
                  >
                    <div>
                      <p className="text-black text-sm font-medium">
                        {res.name}
                      </p>
                      <p className="text-black/50 text-xs">
                        {res.seats} seat{res.seats > 1 ? "s" : ""} • {res.role}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-none ${
                        res.status === "confirmed"
                          ? "bg-green-50 text-green-600"
                          : res.status === "pending"
                            ? "bg-yellow-50 text-yellow-600"
                            : "bg-red-50 text-red-600"
                      }`}
                    >
                      {res.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

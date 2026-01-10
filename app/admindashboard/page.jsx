"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPageUrl } from "@/lib/utils";
import {
  ArrowLeft,
  Package,
  Ticket,
  DollarSign,
  Users,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function AdminDashboard() {
  const [user, setUser] = React.useState(null);
  const [activeTab, setActiveTab] = useState("reservations");
  const queryClient = useQueryClient();
  const router = useRouter();

  React.useEffect(() => {
    const getUser = async () => {
      const currentUser = await base44.auth.me();
      if (currentUser?.role !== "admin") {
        router.push(createPageUrl("Home"));
      }
      setUser(currentUser);
    };
    getUser();
  }, []);

  const { data: orders = [] } = useQuery({
    queryKey: ["all-orders"],
    queryFn: () => base44.entities.Order.list("-createdAt", 100),
    initialData: [],
  });

  const { data: reservations = [] } = useQuery({
    queryKey: ["all-reservations"],
    queryFn: () => base44.entities.Reservation.list("-createdAt", 100),
    initialData: [],
  });

  const updateReservationMutation = useMutation({
    mutationFn: ({ id, status }) =>
      base44.entities.Reservation.update(id, { status }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["all-reservations"] }),
  });

  const totalRevenue = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + o.total_amount, 0);

  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const pendingReservations = reservations.filter(
    (r) => r.status === "pending",
  ).length;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F5EDE4]">
      {/* Header */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-8 border-b border-black/10">
        <Link
          href={createPageUrl("Home")}
          className="flex items-center gap-2 text-black/60 hover:text-[#FF5401] transition-colors duration-300 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <h1 className="text-black font-light text-lg">Admin Dashboard</h1>
        <div />
      </nav>

      <div className="max-w-6xl mx-auto px-6 md:px-12 py-16">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-4 gap-4 mb-12"
        >
          <div className="bg-white border border-black/10 p-6 text-center">
            <DollarSign className="w-8 h-8 text-[#FF5401] mx-auto mb-2" />
            <p className="text-black/50 text-xs tracking-wider mb-1">REVENUE</p>
            <p className="text-black text-2xl font-light">
              ${totalRevenue.toFixed(0)}
            </p>
          </div>
          <div className="bg-white border border-black/10 p-6 text-center">
            <Package className="w-8 h-8 text-[#FF5401] mx-auto mb-2" />
            <p className="text-black/50 text-xs tracking-wider mb-1">ORDERS</p>
            <p className="text-black text-2xl font-light">{orders.length}</p>
          </div>
          <div className="bg-white border border-black/10 p-6 text-center">
            <Ticket className="w-8 h-8 text-[#FF5401] mx-auto mb-2" />
            <p className="text-black/50 text-xs tracking-wider mb-1">
              RESERVATIONS
            </p>
            <p className="text-black text-2xl font-light">
              {reservations.length}
            </p>
          </div>
          <div className="bg-white border border-black/10 p-6 text-center">
            <Users className="w-8 h-8 text-[#FF5401] mx-auto mb-2" />
            <p className="text-black/50 text-xs tracking-wider mb-1">PENDING</p>
            <p className="text-black text-2xl font-light">
              {pendingOrders + pendingReservations}
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-black/10">
          <button
            onClick={() => setActiveTab("reservations")}
            className={`px-4 py-4 text-sm font-light tracking-wider transition-colors duration-300 border-b-2 ${
              activeTab === "reservations"
                ? "border-[#FF5401] text-black"
                : "border-transparent text-black/50 hover:text-black"
            }`}
          >
            RESERVATIONS
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-4 text-sm font-light tracking-wider transition-colors duration-300 border-b-2 ${
              activeTab === "orders"
                ? "border-[#FF5401] text-black"
                : "border-transparent text-black/50 hover:text-black"
            }`}
          >
            ORDERS
          </button>
        </div>

        {/* Content */}
        {activeTab === "reservations" ? (
          <div className="space-y-4">
            {reservations.length === 0 ? (
              <p className="text-black/50 text-center py-12">No reservations</p>
            ) : (
              reservations.map((res) => (
                <motion.div
                  key={res.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-black/10 p-6"
                >
                  <div className="grid md:grid-cols-5 gap-4 items-center">
                    <div>
                      <p className="text-black/50 text-xs tracking-wider mb-1">
                        NAME
                      </p>
                      <p className="text-black font-light">{res.name}</p>
                    </div>
                    <div>
                      <p className="text-black/50 text-xs tracking-wider mb-1">
                        ROLE
                      </p>
                      <p className="text-black font-light text-sm">
                        {res.role}
                      </p>
                    </div>
                    <div>
                      <p className="text-black/50 text-xs tracking-wider mb-1">
                        SEATS
                      </p>
                      <p className="text-black font-light">{res.seats}</p>
                    </div>
                    <div>
                      <p className="text-black/50 text-xs tracking-wider mb-1">
                        STATUS
                      </p>
                      <span
                        className={`text-xs px-3 py-1 rounded-none inline-block ${
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
                    <div className="flex gap-2 justify-end">
                      {res.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() =>
                              updateReservationMutation.mutate({
                                id: res.id,
                                status: "confirmed",
                              })
                            }
                            className="bg-green-600 hover:bg-green-700 text-white h-8 px-3 text-xs"
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() =>
                              updateReservationMutation.mutate({
                                id: res.id,
                                status: "cancelled",
                              })
                            }
                            className="bg-red-600 hover:bg-red-700 text-white h-8 px-3 text-xs"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-black/50 text-center py-12">No orders</p>
            ) : (
              orders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-black/10 p-6"
                >
                  <div className="grid md:grid-cols-5 gap-4 items-center">
                    <div>
                      <p className="text-black/50 text-xs tracking-wider mb-1">
                        EMAIL
                      </p>
                      <p className="text-black font-light text-sm">
                        {order.customer_email}
                      </p>
                    </div>
                    <div>
                      <p className="text-black/50 text-xs tracking-wider mb-1">
                        ITEMS
                      </p>
                      <p className="text-black font-light text-sm">
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-black/50 text-xs tracking-wider mb-1">
                        AMOUNT
                      </p>
                      <p className="text-black font-light">
                        ${order.total_amount.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-black/50 text-xs tracking-wider mb-1">
                        DATE
                      </p>
                      <p className="text-black font-light text-sm">
                        {format(new Date(order.createdAt), "MMM d, yyyy")}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs px-3 py-1 rounded-none inline-block ${
                          order.status === "completed"
                            ? "bg-green-50 text-green-600"
                            : order.status === "pending"
                              ? "bg-yellow-50 text-yellow-600"
                              : "bg-red-50 text-red-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
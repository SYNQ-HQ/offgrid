"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { createPageUrl } from "@/lib/utils";
import { apiClient } from "@/lib/api";
import { format } from "date-fns";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import ReservationForm from "@/components/reserve/ReservationForm";

export default function ReserveClient({ event: initialEvent, eventId }) {
  const queryClient = useQueryClient();
  const [isSuccess, setIsSuccess] = useState(false);

  const { data: eventData } = useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      const events = await apiClient.entities.Event.filter({ id: eventId });
      return events[0] || null;
    },
    initialData: initialEvent,
    refetchInterval: 5000,
    enabled: !!eventId
  });

  const event = eventData || initialEvent;

  const createReservation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          name: data.name,
          email: data.email,
          phone: data.phone,
          seats: data.type === "ticket" ? 1 : data.seats,
          instagram: data.instagram,
          twitter: data.twitter,
          role: data.role,
          referral: data.referral,
          type: data.type,
        }),
      });

      if (!response.ok) {
         const error = await response.json();
         throw new Error(error.error || "Failed to create reservation");
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      setIsSuccess(true);
      queryClient.invalidateQueries(["event", eventId]);
      
      const phone = "2348033448191"; 
      const isTable = variables.type === "table";
      const text = `Hi, I'd like to register for ${event?.title || "OffGrid Event"}.
Type: ${isTable ? "Paid Table (Instant Approval)" : "Free Ticket (Subject to Approval)"}
Name: ${variables.name}
Email: ${variables.email}
Phone: ${variables.phone}
${isTable ? `Tables: ${variables.seats}` : ""}
Role: ${variables.role}

${isTable ? "I'm ready to proceed with payment." : "I understand my ticket requires manual approval."}
`;
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
      
      setTimeout(() => {
          window.open(url, "_blank");
      }, 1500);
    },
  });

  const spotsLeft = event ? event.total_seats - (event.seats_taken || 0) : 0;

  return (
    <div className="min-h-screen bg-[#F5EDE4]">
      {/* Header */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-8">
        <Link
          href={createPageUrl("Home")}
          className="flex items-center gap-2 text-black/60 hover:text-[#FF5401] transition-colors duration-300 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <div className="text-black font-light tracking-[0.3em] text-sm">
          OffGrid
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12 md:py-24">
        {!event ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <h2 className="text-3xl font-extralight text-black mb-4">
              Event not found
            </h2>
            <p className="text-black/50 mb-8">
              This event may no longer be available.
            </p>
            <Link
              href={createPageUrl("Home")}
              className="text-[#FF5401] text-sm hover:underline"
            >
              Return home
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Event Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <span className="text-black/30 text-xs tracking-[0.3em] block mb-4">
                RESERVE TABLE
              </span>
              <h1 className="text-black text-3xl md:text-4xl font-extralight mb-8">
                {event.title}
              </h1>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-black/60">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    {format(new Date(event.date), "EEEE, MMMM d, yyyy")}
                  </span>
                </div>
                {event.time && (
                  <div className="flex items-center gap-3 text-black/60">
                    <div className="w-4" />
                    <span className="text-sm">{event.time}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-black/60">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">
                    {event.venue}
                    {event.location && `, ${event.location}`}
                  </span>
                </div>
              </div>

              {event.description && (
                <p className="text-black/50 text-sm leading-relaxed mb-8">
                  {event.description}
                </p>
              )}

              <div className="border-t border-black/10 pt-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-[#FF5401] text-2xl font-light">
                    {spotsLeft}
                  </span>
                  <span className="text-black/40 text-sm">tables remaining</span>
                </div>
                <div className="w-full h-1 bg-black/5 mt-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${((event.seats_taken || 0) / event.total_seats) * 100}%`,
                    }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-[#FF5401]"
                  />
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-3 bg-white p-8 md:p-12"
            >
              {spotsLeft <= 0 && !isSuccess ? (
                <div className="text-center py-12">
                  <h3 className="text-2xl font-light text-black mb-3">
                    Fully Booked
                  </h3>
                  <p className="text-black/50 text-sm">
                    All tables have been reserved. Please check back later or contact us directly.
                  </p>
                </div>
              ) : (
                <ReservationForm
                  onSubmit={(data) => createReservation.mutate(data)}
                  isSubmitting={createReservation.isPending}
                  isSuccess={isSuccess}
                />
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

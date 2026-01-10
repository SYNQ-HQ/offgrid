"use client";
import React, { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createPageUrl } from "@/lib/utils";
import { format } from "date-fns";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import ReservationForm from "@/components/reserve/ReservationForm";

function ReserveContent() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");
  const queryClient = useQueryClient();
  const [isSuccess, setIsSuccess] = useState(false);

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      if (!eventId) return null;
      const events = await apiClient.entities.Event.filter({ id: eventId });
      return events[0] || null;
    },
    enabled: !!eventId,
  });

  const createReservation = useMutation({
    mutationFn: async (data) => {
      // 1. Capture the Lead in DB (Optional, but good for tracking)
      // We assume the API still works to save "pending" reservations
      // We pass 'seats' as 'tables' effectively.
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          name: data.name,
          email: data.email,
          phone: data.phone,
          seats: data.seats,
          instagram: data.instagram,
          twitter: data.twitter,
          role: data.role,
          referral: data.referral,
        }),
      });

      if (!response.ok) {
         // Even if DB fails (e.g. full), we might still want to let them whatsapp?
         // But for now let's strict fail if full.
         // Actually, if we want to bypass stock check for WhatsApp manual processing:
         // We might skip this API call or ignore error.
         // But capturing data is requested.
         const error = await response.json();
         // If "Not enough seats", we tell user.
         throw new Error(error.error || "Failed to create reservation");
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      setIsSuccess(true);
      queryClient.invalidateQueries(["event", eventId]);
      
      // 2. Redirect to WhatsApp
      const phone = "2348033448191"; // REAL ADMIN NUMBER
      const text = `Hi, I'd like to buy a table for ${event?.title || "OffGrid Event"}.
Name: ${variables.name}
Email: ${variables.email}
Phone: ${variables.phone}
Tables: ${variables.seats}
Role: ${variables.role}
`;
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
      
      // Short delay then redirect
      setTimeout(() => {
          window.open(url, "_blank");
      }, 1500);
    },
  });

  // Calculate Tables Left (Assuming total_seats = 7 tables for now, or just using seats logic)
  // If event.total_seats was e.g. 50 (people), and now we want 7 tables.
  // We should likely treat 'total_seats' as 'total_tables' in the UI if that's the new model.
  // Or just ignore the count display if it's confusing.
  // Let's assume for this MVP event, the DB 'total_seats' IS the table count (e.g. 7).
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
        {isLoading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-[#FF5401] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !event ? (
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

export default function Reserve() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5EDE4] flex items-center justify-center text-black/50">
          Loading reservation...
        </div>
      }
    >
      <ReserveContent />
    </Suspense>
  );
}
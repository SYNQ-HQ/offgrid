"use client";
import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import Link from "next/link";
import { createPageUrl } from "@/lib/utils";
import { format } from "date-fns";
import { ArrowRight, MapPin, Calendar } from "lucide-react";

export default function EventsSection() {
  const { data: events = [] } = useQuery({
    queryKey: ["events"],
    queryFn: () =>
      base44.entities.Event.filter({ status: "upcoming" }, "date", 3),
    initialData: [],
  });

  return (
    <section
      id="events"
      className="min-h-screen bg-[#F5EDE4] py-24 md:py-32 px-6 md:px-12"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 md:mb-24"
        >
          <span className="text-black/30 text-xs tracking-[0.3em] block mb-4">
            UPCOMING
          </span>
          <h2 className="text-black text-3xl md:text-5xl font-extralight">
            Reserve your space.
          </h2>
        </motion.div>

        {events.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="border border-black/10 p-12 md:p-16 text-center"
          >
            <p className="text-black/50 text-lg font-light mb-4">
              No upcoming events at the moment.
            </p>
            <p className="text-black/30 text-sm">
              Stay connected. The next edition is being curated.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Link
                  href={createPageUrl(`Reserve?eventId=${event.id}`)}
                  className="block group"
                >
                  <div className="border border-black/10 hover:border-[#FF5401] transition-colors duration-500 p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="flex items-center gap-2 text-black/40 text-xs">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(event.date), "MMM d, yyyy")}
                        </span>
                        {event.time && (
                          <span className="text-black/40 text-xs">
                            {event.time}
                          </span>
                        )}
                      </div>
                      <h3 className="text-black text-2xl md:text-3xl font-light mb-3 group-hover:text-[#FF5401] transition-colors duration-300">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-2 text-black/50 text-sm">
                        <MapPin className="w-4 h-4" />
                        {event.venue}
                        {event.location && `, ${event.location}`}
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-[#FF5401] text-sm font-mono">
                          {event.total_seats - (event.seats_taken || 0)} spots
                          left
                        </p>
                        <p className="text-black/30 text-xs">
                          of {event.total_seats}
                        </p>
                      </div>
                      <div className="w-12 h-12 border border-black/10 group-hover:border-[#FF5401] group-hover:bg-[#FF5401] flex items-center justify-center transition-all duration-300">
                        <ArrowRight className="w-5 h-5 text-black/30 group-hover:text-white transition-colors duration-300" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

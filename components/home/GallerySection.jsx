"use client";
import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

export default function GallerySection() {
  const { data: images = [] } = useQuery({
    queryKey: ["gallery"],
    queryFn: () => apiClient.entities.GalleryImage.list("order", 12),
    initialData: [],
  });

  // Placeholder images for when there's no data
  const placeholderImages = [
    {
      id: 1,
      image_url:
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
      caption: "The Connection",
    },
    {
      id: 2,
      image_url:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
      caption: "Intimate Moments",
    },
    {
      id: 3,
      image_url:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
      caption: "The Vibe",
    },
    {
      id: 4,
      image_url:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
      caption: "Sound & Soul",
    },
    {
      id: 5,
      image_url:
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
      caption: "Collective Energy",
    },
    {
      id: 6,
      image_url:
        "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80",
      caption: "After Hours",
    },
  ];

  const displayImages = images.length > 0 ? images : placeholderImages;

  return (
    <section className="bg-black py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 md:mb-24"
        >
          <span className="text-[#F5EDE4]/30 text-xs tracking-[0.3em] block mb-4">
            MOMENTS
          </span>
          <h2 className="text-[#F5EDE4] text-3xl md:text-5xl font-extralight">
            Captured in low light.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {displayImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`relative overflow-hidden group ${
                index === 0 || index === 5
                  ? "md:col-span-2 aspect-[2/1]"
                  : "aspect-square"
              }`}
            >
              <img
                src={image.url || image.image_url}
                alt={image.caption || "OffGrid moment"}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-[#F5EDE4] text-sm font-light tracking-wide">
                    {image.caption}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

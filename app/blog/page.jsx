"use client";
import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import Link from "next/link";
import { createPageUrl } from "@/lib/utils";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { format } from "date-fns";

export default function Blog() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: () =>
      base44.entities.BlogPost.filter(
        { status: "published" },
        "-published_date",
        50,
      ),
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
          <span className="text-black/30 text-xs tracking-[0.3em] block mb-4">
            BLOG
          </span>
          <h1 className="text-black text-4xl md:text-5xl font-extralight mb-4">
            Off-Grid Stories
          </h1>
          <p className="text-black/50 text-sm max-w-lg mb-12">
            Insights and updates from the Off-Grid community
          </p>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-black/50">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-black/50">No posts published yet</p>
            </div>
          ) : (
            <div className="space-y-8">
              {posts.map((post, idx) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="border-b border-black/10 pb-8 last:border-b-0"
                >
                  {post.featured_image && (
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-64 object-cover mb-6 grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  )}
                  <Link
                    href={`${createPageUrl("Blog")}?slug=${post.slug}`}
                    className="group"
                  >
                    <h2 className="text-black text-2xl md:text-3xl font-extralight mb-3 group-hover:text-[#FF5401] transition-colors">
                      {post.title}
                    </h2>
                  </Link>

                  <div className="flex flex-wrap gap-4 text-black/50 text-xs mb-4">
                    {post.published_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(post.published_date), "MMM d, yyyy")}
                      </div>
                    )}
                    {post.author && (
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {post.author}
                      </div>
                    )}
                  </div>

                  <p className="text-black/60 text-sm leading-relaxed mb-4">
                    {post.excerpt}
                  </p>

                  <Link
                    href={`${createPageUrl("Blog")}?slug=${post.slug}`}
                    className="text-[#FF5401] hover:text-black transition-colors text-sm font-light tracking-wider"
                  >
                    Read More →
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

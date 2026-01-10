"use client";

import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import Link from "next/link";
import { createPageUrl } from "@/lib/utils";
import { ArrowLeft, Calendar, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import { useParams } from "next/navigation";

export default function BlogDetail() {
  const { slug } = useParams();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      if (!slug) return null;
      const posts = await base44.entities.BlogPost.filter({
        slug,
        status: "published",
      });
      return posts[0] || null;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5EDE4] flex items-center justify-center">
        <p className="text-black/50">Loading...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#F5EDE4]">
        <nav className="flex items-center px-6 md:px-12 py-8 border-b border-black/10">
          <Link
            href={createPageUrl("Blog")}
            className="flex items-center gap-2 text-black/60 hover:text-[#FF5401] transition-colors duration-300 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </nav>
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-24 text-center">
          <p className="text-black/50">Post not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EDE4]">
      {/* Header */}
      <nav className="flex items-center px-6 md:px-12 py-8 border-b border-black/10">
        <Link
          href={createPageUrl("Blog")}
          className="flex items-center gap-2 text-black/60 hover:text-[#FF5401] transition-colors duration-300 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <motion.article
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {post.featured_image && (
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-96 object-cover mb-12 grayscale"
            />
          )}

          <h1 className="text-black text-4xl md:text-5xl font-extralight mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap gap-6 text-black/50 text-sm mb-12 pb-12 border-b border-black/10">
            {post.published_date && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {format(new Date(post.published_date), "MMMM d, yyyy")}
              </div>
            )}
            {post.author && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author}
              </div>
            )}
          </div>

          <div className="prose prose-sm max-w-none text-black/80 leading-relaxed">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-2xl font-light mt-6 mb-3">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl font-light mt-6 mb-3">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-light mt-4 mb-2">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="mb-4 leading-relaxed">{children}</p>
                ),
                a: ({ children, href }) => (
                  <a
                    href={href}
                    className="text-[#FF5401] hover:text-black transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc ml-6 mb-4 space-y-2">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal ml-6 mb-4 space-y-2">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-black/70">{children}</li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-[#FF5401] pl-6 my-6 italic text-black/60">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </motion.article>
      </div>
    </div>
  );
}
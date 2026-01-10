"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, X, Upload } from "lucide-react";

export default function BlogForm({
  onSubmit,
  isSubmitting,
  onCancel,
  initialData,
}) {
  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featured_image: "",
      author: "",
      status: "draft",
    }
  );
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      if (field === "title" && !initialData) {
        newData.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
      }
      return newData;
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (data.url) {
        handleChange("featured_image", data.url);
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-black/10 p-6 md:p-8 space-y-6"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-light text-black">
          {initialData ? "Edit Post" : "New Post"}
        </h3>
        {onCancel && (
          <button onClick={onCancel} className="text-black/40 hover:text-black">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-black">
        <div className="space-y-2">
          <Label className="text-black/60 text-xs tracking-wider">TITLE *</Label>
          <Input
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
            className="bg-[#F5EDE4] border-black/10 rounded-none h-10 text-black placeholder:text-black/30"
            placeholder="Post Title"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-black/60 text-xs tracking-wider">SLUG *</Label>
            <Input
              value={formData.slug}
              onChange={(e) => handleChange("slug", e.target.value)}
              required
              className="bg-[#F5EDE4] border-black/10 rounded-none h-10 text-black placeholder:text-black/30"
              placeholder="post-slug"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-black/60 text-xs tracking-wider">AUTHOR</Label>
            <Input
              value={formData.author}
              onChange={(e) => handleChange("author", e.target.value)}
              className="bg-[#F5EDE4] border-black/10 rounded-none h-10 text-black placeholder:text-black/30"
              placeholder="Author Name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-black/60 text-xs tracking-wider">EXCERPT</Label>
          <Textarea
            value={formData.excerpt}
            onChange={(e) => handleChange("excerpt", e.target.value)}
            className="bg-[#F5EDE4] border-black/10 rounded-none min-h-[60px] resize-none text-black placeholder:text-black/30"
            placeholder="Brief summary..."
          />
        </div>

        <div className="space-y-2">
          <Label className="text-black/60 text-xs tracking-wider">CONTENT (MARKDOWN) *</Label>
          <Textarea
            value={formData.content}
            onChange={(e) => handleChange("content", e.target.value)}
            required
            className="bg-[#F5EDE4] border-black/10 rounded-none min-h-[200px] font-mono text-sm text-black placeholder:text-black/30"
            placeholder="# Markdown Content"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-black/60 text-xs tracking-wider">FEATURED IMAGE</Label>
            <div className="flex gap-2">
              <Input
                value={formData.featured_image}
                onChange={(e) => handleChange("featured_image", e.target.value)}
                className="bg-[#F5EDE4] border-black/10 rounded-none h-10 flex-1 text-black placeholder:text-black/30"
                placeholder="https://..."
              />
              <input
                type="file"
                hidden
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="border-black/10 rounded-none h-10 px-3 text-black"
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
              </Button>
            </div>
            {formData.featured_image && (
              <img
                src={formData.featured_image}
                alt="Preview"
                className="w-full h-32 object-cover mt-2 border border-black/10"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-black/60 text-xs tracking-wider">STATUS</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange("status", value)}
            >
              <SelectTrigger className="bg-[#F5EDE4] border-black/10 rounded-none h-10 text-black">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3 pt-6">
          {onCancel && (
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="flex-1 border-black/10 text-black rounded-none h-10"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="flex-1 bg-black hover:bg-[#FF5401] text-white rounded-none h-10 transition-colors duration-300"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : initialData ? (
              "Update Post"
            ) : (
              "Create Post"
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}

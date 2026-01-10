"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, X, Upload } from "lucide-react";

export default function GalleryForm({
  onSubmit,
  isSubmitting,
  onCancel,
  initialData,
}) {
  const [formData, setFormData] = useState(
    initialData || {
      url: "",
      caption: "",
      order: 0,
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
    setFormData((prev) => ({ ...prev, [field]: value }));
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
        handleChange("url", data.url);
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      order: parseInt(formData.order) || 0,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-black/10 p-6 md:p-8 space-y-6"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-light text-black">
          {initialData ? "Edit Image" : "Add Gallery Image"}
        </h3>
        {onCancel && (
          <button onClick={onCancel} className="text-black/40 hover:text-black">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label className="text-black/60 text-xs tracking-wider">IMAGE URL *</Label>
          <div className="flex gap-2">
            <Input
              value={formData.url}
              onChange={(e) => handleChange("url", e.target.value)}
              required
              className="bg-[#F5EDE4] border-black/10 rounded-none h-10 flex-1 text-black placeholder:text-black/30"
              placeholder="https://... or upload"
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
              className="border-black/10 rounded-none h-10 px-3"
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
            </Button>
          </div>
          {formData.url && (
            <img
              src={formData.url}
              alt="Preview"
              className="w-full h-48 object-cover mt-2 border border-black/10"
            />
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-black/60 text-xs tracking-wider">CAPTION</Label>
            <Input
              value={formData.caption || ""}
              onChange={(e) => handleChange("caption", e.target.value)}
              className="bg-[#F5EDE4] border-black/10 rounded-none h-10 text-black placeholder:text-black/30"
              placeholder="Image caption"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-black/60 text-xs tracking-wider">DISPLAY ORDER</Label>
            <Input
              type="number"
              value={formData.order}
              onChange={(e) => handleChange("order", e.target.value)}
              className="bg-[#F5EDE4] border-black/10 rounded-none h-10 text-black placeholder:text-black/30"
              placeholder="0"
            />
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
              "Update Image"
            ) : (
              "Add Image"
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}

"use client";

import React, { useState, useRef } from "react";
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

export default function MerchForm({
  onSubmit,
  isSubmitting,
  onCancel,
  initialData,
}) {
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      description: "",
      price: "",
      image_url: "",
      stock: "",
      category: "other",
    },
  );
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

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
        handleChange("image_url", data.url);
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
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock) || 0,
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
          {initialData ? "Edit Merch" : "Add New Merch"}
        </h3>
        {onCancel && (
          <button onClick={onCancel} className="text-black/40 hover:text-black">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-black/60 text-xs tracking-wider">
              PRODUCT NAME *
            </Label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              className="bg-[#F5EDE4] border-black/10 rounded-none h-10 text-black placeholder:text-black/30"
              placeholder="OffGrid Hoodie"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-black/60 text-xs tracking-wider">
              PRICE (NGN) *
            </Label>
            <Input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleChange("price", e.target.value)}
              required
              className="bg-[#F5EDE4] border-black/10 rounded-none h-10 text-black placeholder:text-black/30"
              placeholder="5000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-black/60 text-xs tracking-wider">
            DESCRIPTION
          </Label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="bg-[#F5EDE4] border-black/10 rounded-none min-h-[80px] resize-none text-black placeholder:text-black/30"
            placeholder="Brief product description"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-black/60 text-xs tracking-wider">
            IMAGE URL *
          </Label>
          <div className="flex gap-2">
            <Input
              value={formData.image_url}
              onChange={(e) => handleChange("image_url", e.target.value)}
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
          {formData.image_url && (
            <img
              src={formData.image_url}
              alt="Preview"
              className="w-32 h-32 object-cover mt-2 border border-black/10"
            />
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-black/60 text-xs tracking-wider">
              STOCK *
            </Label>
            <Input
              type="number"
              value={formData.stock}
              onChange={(e) => handleChange("stock", e.target.value)}
              required
              className="bg-[#F5EDE4] border-black/10 rounded-none h-10 text-black placeholder:text-black/30"
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-black/60 text-xs tracking-wider">
              CATEGORY
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleChange("category", value)}
            >
              <SelectTrigger className="bg-[#F5EDE4] border-black/10 rounded-none h-10 text-black">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apparel">Apparel</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
                <SelectItem value="drinkware">Drinkware</SelectItem>
                <SelectItem value="other">Other</SelectItem>
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
              "Update Merch"
            ) : (
              "Add Merch"
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}

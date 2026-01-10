"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function EventForm({
  onSubmit,
  isSubmitting,
  onCancel,
  initialData = null,
}) {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    venue: "",
    location: "",
    total_seats: 10,
    cover_image: "",
    description: "",
    status: "upcoming",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        date: initialData.date ? format(new Date(initialData.date), "yyyy-MM-dd") : "",
        time: initialData.time || "",
        venue: initialData.venue || "",
        location: initialData.location || "",
        total_seats: initialData.total_seats || 10,
        cover_image: initialData.cover_image || "",
        description: initialData.description || "",
        status: initialData.status || "upcoming",
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert date string to ISO date object for Prisma
    const submissionData = {
        ...formData,
        date: new Date(formData.date).toISOString(),
        total_seats: parseInt(formData.total_seats)
    };
    onSubmit(submissionData);
  };

  return (
    <div className="bg-white border border-black/10 p-6">
      <h3 className="text-xl font-light mb-6">
        {initialData ? "Edit Event" : "Create New Event"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-black/60 text-xs tracking-wider">TITLE *</Label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
              className="bg-[#F5EDE4] border-black/10 rounded-none h-10 text-black placeholder:text-black/30"
              placeholder="Event Title"
            />
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
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="sold_out">Sold Out</SelectItem>
                <SelectItem value="past">Past</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label className="text-black/60 text-xs tracking-wider">DATE *</Label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              required
              className="bg-[#F5EDE4] border-black/10 rounded-none h-10 text-black placeholder:text-black/30"
            />
          </div>
           <div className="space-y-2">
            <Label className="text-black/60 text-xs tracking-wider">TIME *</Label>
            <Input
              value={formData.time}
              onChange={(e) => handleChange("time", e.target.value)}
              required
              className="bg-[#F5EDE4] border-black/10 rounded-none h-10 text-black placeholder:text-black/30"
              placeholder="e.g. 8PM - 2AM"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-black/60 text-xs tracking-wider">TOTAL TABLES *</Label>
            <Input
              type="number"
              min="1"
              value={formData.total_seats}
              onChange={(e) => handleChange("total_seats", e.target.value)}
              required
              className="bg-[#F5EDE4] border-black/10 rounded-none h-10 text-black placeholder:text-black/30"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-black/60 text-xs tracking-wider">VENUE *</Label>
            <Input
              value={formData.venue}
              onChange={(e) => handleChange("venue", e.target.value)}
              required
              className="bg-[#F5EDE4] border-black/10 rounded-none h-10 text-black placeholder:text-black/30"
              placeholder="Venue Name"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-black/60 text-xs tracking-wider">LOCATION</Label>
            <Input
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="bg-[#F5EDE4] border-black/10 rounded-none h-10 text-black placeholder:text-black/30"
              placeholder="City, Country"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-black/60 text-xs tracking-wider">COVER IMAGE URL</Label>
          <Input
            value={formData.cover_image}
            onChange={(e) => handleChange("cover_image", e.target.value)}
            className="bg-[#F5EDE4] border-black/10 rounded-none h-10 text-black placeholder:text-black/30"
            placeholder="https://..."
          />
        </div>

        <div className="space-y-2">
          <Label className="text-black/60 text-xs tracking-wider">DESCRIPTION</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="bg-[#F5EDE4] border-black/10 rounded-none min-h-[100px] text-black placeholder:text-black/30"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-black hover:bg-[#FF5401]"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : initialData ? (
              "Update Event"
            ) : (
              "Create Event"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

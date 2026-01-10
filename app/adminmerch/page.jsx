"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import MerchForm from "@/components/admin/MerchForm";

export default function AdminMerch() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const { data: items = [] } = useQuery({
    queryKey: ["admin-merch"],
    queryFn: () => apiClient.entities.Merch.list("-createdAt", 100),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => apiClient.entities.Merch.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-merch", "merch"] });
      setShowForm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => apiClient.entities.Merch.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-merch", "merch"] });
      setEditingItem(null);
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiClient.entities.Merch.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-merch", "merch"] });
    },
  });

  const handleSubmit = (data) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-[#F5EDE4] p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-extralight text-black mb-2">
              Manage Store
            </h1>
            <p className="text-black/50 text-sm">
              Add, edit, or remove merchandise
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-black hover:bg-[#FF5401] text-white rounded-none h-10 transition-colors duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Merch
          </Button>
        </div>

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <div className="mb-12">
              <MerchForm
                onSubmit={handleSubmit}
                isSubmitting={
                  createMutation.isPending || updateMutation.isPending
                }
                onCancel={handleCancel}
                initialData={editingItem}
              />
            </div>
          )}
        </AnimatePresence>

        {/* Items List */}
        <div className="space-y-4">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-black/10 p-12 text-center"
            >
              <p className="text-black/50">
                No merchandise yet. Create your first item.
              </p>
            </motion.div>
          ) : (
            items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white border border-black/10 p-6 flex items-center gap-6 hover:border-[#FF5401] transition-colors duration-300 group"
              >
                {/* Image */}
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-20 h-20 object-cover bg-black/5"
                />

                {/* Info */}
                <div className="flex-1">
                  <h3 className="text-black text-lg font-light mb-1">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-[#FF5401] font-mono">
                      ${item.price.toFixed(2)}
                    </span>
                    <span className="text-black/50">Stock: {item.stock}</span>
                    <span className="text-black/30 text-xs px-2 py-1 bg-black/5">
                      {item.category}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-black/40 text-xs mt-2 line-clamp-1">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    onClick={() => handleEdit(item)}
                    size="sm"
                    variant="outline"
                    className="border-black/10 rounded-none h-8"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => deleteMutation.mutate(item.id)}
                    size="sm"
                    variant="outline"
                    className="border-black/10 text-red-500 hover:bg-red-50 rounded-none h-8"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
